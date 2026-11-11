// Personal space (route "#/home"): greeting, the current Christmas event with "my draw",
// the coming birthdays (with a way to launch or open their preparation), shortcuts.
//
// "My draw" card, depending on the situation:
//   - no event in progress            -> short message
//   - declared event, not declared yet -> "J'offre à…" form (2026, draw made before the site)
//   - random event, not drawn yet      -> waiting message
//   - draw not seen yet                -> "Découvrir" button (reveal; the first view is recorded)
//   - draw already seen                -> receiver's name and link to their list
// The receiver is only fetched (get_my_draws) when the member asks to see it.

import { h, fill } from "../dom.js?v=3bb9c56";
import { t, errorText } from "../i18n.js?v=3bb9c56";
import { getMe, select, rpc } from "../api.js?v=3bb9c56";
import { field, statusLine, confirmButton, formatEuro, formatDate, formatBirthday } from "../ui.js?v=3bb9c56";
import { renderNotMember } from "./not-member.js?v=3bb9c56";

export async function renderHome({ navigate }) {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [wishes, events, statuses, birthdays] = await Promise.all([
    select("wishes", `select=id&member_id=eq.${me.id}&archived=is.false`),
    select("events", "select=*&status=neq.closed&kind=eq.christmas&order=year.desc"),
    rpc("my_draw_status"),
    rpc("upcoming_birthdays", { p_days: BIRTHDAY_DAYS }),
  ]);
  const statusByEvent = new Map(statuses.map((s) => [s.event_id, s]));
  const event = events.find((e) => statusByEvent.has(e.id)) ?? null;

  const wishSummary = wishes.length === 0
    ? t("home.listEmpty")
    : t(wishes.length === 1 ? "home.listOne" : "home.listMany", { count: wishes.length });

  return h(
    "section",
    { class: "home" },
    h(
      "div",
      { class: "home-header" },
      h("h1", {}, t("home.greeting", { name: me.display_name })),
      me.is_admin ? h("span", { class: "badge" }, t("home.adminBadge")) : null,
    ),
    h("p", { class: "lead" }, t("home.intro")),
    await drawCard(me, event, event ? statusByEvent.get(event.id) : null, navigate),
    await birthdayCard(me, birthdays, navigate),
    h(
      "div",
      { class: "shortcuts" },
      shortcut("#/my-list", t("home.myListTitle"), wishSummary, wishes.length === 0),
      shortcut("#/messages", t("home.messagesTitle"), t("home.messagesText"), false),
      shortcut("#/history", t("home.historyTitle"), t("home.historyText"), false),
      shortcut("#/profile", t("home.profileTitle"), t("home.profileText"), false),
    ),
  );
}

// ---------------------------------------------------------------------------
// "My draw" card
// ---------------------------------------------------------------------------

async function drawCard(me, event, status, navigate) {
  const card = h("article", { class: "card draw-card" });
  if (!event) {
    return fill(card, h("h2", {}, t("home.drawTitle")), h("p", {}, t("home.noEvent")));
  }

  const header = [
    h("div", { class: "draw-head" }, h("h2", {}, event.title), countdown(event.event_date)),
    h(
      "ul",
      { class: "event-meta" },
      h("li", {}, t("home.eventDate", { date: formatDate(event.event_date) })),
      h("li", {}, t("home.eventBudget", { budget: formatEuro(event.budget_eur) })),
      event.wishlist_deadline
        ? h("li", {}, t("home.eventDeadline", { date: formatDate(event.wishlist_deadline) }))
        : null,
    ),
  ];
  const body = h("div", { class: "draw-body" });
  fill(card, ...header, body);

  if (status.has_draw && status.viewed) {
    await showReceiver();
  } else if (status.has_draw) {
    fill(
      body,
      h("p", {}, t("home.drawReady")),
      h("button", { type: "button", class: "button-primary reveal", onclick: showReceiver }, t("home.reveal")),
    );
  } else if (event.draw_mode === "declared" && event.status === "preparing") {
    fill(body, await declarationForm(me, event, navigate));
  } else {
    fill(body, h("p", {}, t("home.drawNotYet")));
  }
  return card;

  async function showReceiver() {
    try {
      const draws = await rpc("get_my_draws");
      const mine = draws.find((d) => d.event_id === event.id);
      fill(
        body,
        h("p", { class: "draw-label" }, t("home.youGiveTo")),
        h("p", { class: "draw-name" }, mine.receiver_name),
        h("a", { class: "button-primary link-button", href: "#/receiver" }, t("home.seeList", { name: mine.receiver_name })),
      );
      body.classList.add("revealed");
    } catch (error) {
      fill(body, h("p", { class: "form-message", "data-kind": "error" }, errorText(error)));
    }
  }
}

// 2026: the draw took place before the site; each member says who they give to.
async function declarationForm(me, event, navigate) {
  const [participants, members] = await Promise.all([
    select("participants", `select=member_id&event_id=eq.${event.id}`),
    select("members", "select=id,display_name,household_id"),
  ]);
  const ids = new Set(participants.map((p) => p.member_id));
  const self = members.find((m) => m.id === me.id);
  const candidates = members
    .filter((m) => ids.has(m.id) && m.id !== me.id)
    .filter((m) => !self?.household_id || m.household_id !== self.household_id)
    .sort((a, b) => a.display_name.localeCompare(b.display_name, "fr"));

  const status = statusLine();
  const receiver = field({
    label: t("home.declareLabel"),
    kind: "select",
    options: [{ value: "", label: t("home.declareChoose") }, ...candidates.map((m) => ({ value: m.id, label: m.display_name }))],
  });

  const chosenName = () => candidates.find((m) => m.id === receiver.input.value)?.display_name ?? "";
  const submit = confirmButton({
    label: t("home.declareSubmit"),
    question: () => t("home.declareQuestion", { name: chosenName() }),
    confirmLabel: () => t("home.declareConfirm", { name: chosenName() }),
    className: "button-primary",
    beforeAsk: () => {
      if (receiver.input.value) {
        status.clear();
        return true;
      }
      status.show(t("home.declareMissing"), "error");
      return false;
    },
    onConfirm: async () => {
      try {
        await rpc("declare_my_draw", { p_event_id: event.id, p_receiver_id: receiver.input.value });
        navigate("/home");
      } catch (error) {
        status.show(errorText(error), "error");
      }
    },
  });

  return h(
    "div",
    { class: "declaration" },
    h("p", {}, t("home.declareIntro")),
    receiver.element,
    submit,
    h("p", { class: "field-hint" }, t("home.declareHint")),
    status.element,
  );
}

function countdown(eventDate) {
  const today = new Date();
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((Date.parse(`${eventDate}T00:00:00Z`) - start) / 86400000);
  if (days < 0) return null;
  const text = days === 0 ? t("home.today") : days === 1 ? t("home.tomorrow") : t("home.daysLeft", { days });
  return h("span", { class: "countdown" }, text);
}

// The birthdays of the next BIRTHDAY_DAYS days, the closest first (none: no card). The
// birthdays of the members ticked in Admin > Anniversaires open by themselves (two months
// before by default); any member but the celebrated one and their partner may launch any
// birthday earlier, up to six months before.
const BIRTHDAY_DAYS = 180;
const SHOWN_WITHOUT_ACTION = 30;   // further away, only the ones somebody can act on

// Two groups, so a birthday being prepared never looks like one to launch:
//   « En préparation »: the open birthdays I take part in, as highlighted cards with where
//   things stand (participants, money gathered, what I chose or « rien choisi »);
//   « À venir »: the others, plain, with « Lancer la préparation » when I may, and when it
//   will open by itself.
async function birthdayCard(me, birthdays, navigate) {
  const status = statusLine();
  const mine = birthdays.filter((b) => b.state === "open" && b.taking_part);
  const coming = birthdays.filter((b) => !(b.state === "open" && b.taking_part)
    && (b.days <= SHOWN_WITHOUT_ACTION || b.state === "to_launch" || b.state === "open"));
  if (mine.length === 0 && coming.length === 0) return null;

  // Where the birthdays I prepare stand.
  const ids = mine.map((b) => b.event_id);
  const [participants, contributions, gifts] = ids.length === 0 ? [[], [], []] : await Promise.all([
    select("participants", `select=event_id&event_id=in.(${ids.join(",")})`),
    select("birthday_contributions", `select=event_id,gift_id,member_id,amount_eur&event_id=in.(${ids.join(",")})`),
    select("birthday_gifts", `select=id,title&event_id=in.(${ids.join(",")})`),
  ]);
  const giftTitle = new Map(gifts.map((g) => [g.id, g.title]));

  return h(
    "article",
    { class: "card birthdays" },
    h("h2", {}, t("home.birthdaysTitle")),
    status.element,
    mine.length > 0
      ? [
          h("h3", { class: "birthday-group" }, t("home.birthdaysPreparing")),
          h("ul", { class: "birthday-open-list" }, mine.map((b) => {
            const count = participants.filter((p) => p.event_id === b.event_id).length;
            const onIt = contributions.filter((c) => c.event_id === b.event_id);
            const total = onIt.reduce((sum, c) => sum + Number(c.amount_eur ?? 0), 0);
            const chosen = onIt.filter((c) => c.member_id === me.id).map((c) => giftTitle.get(c.gift_id)).filter(Boolean);
            return h(
              "li",
              {},
              h(
                "a",
                { class: "birthday-open", href: `#/birthday?id=${b.event_id}` },
                h("span", { class: "birthday-open-title" }, "🎁 ", b.display_name, t("home.birthdaySeparator"), whenText(b)),
                h("span", { class: "birthday-open-facts" },
                  total > 0
                    ? t("home.birthdayFactsMoney", { count, amount: formatEuro(total) })
                    : t("home.birthdayFacts", { count })),
                chosen.length > 0
                  ? h("span", { class: "birthday-open-mine" }, t("home.birthdayYouChose", { gifts: chosen.join(", ") }))
                  : h("span", { class: "birthday-open-todo" }, t("home.birthdayNothingChosen")),
                h("span", { class: "button-primary birthday-open-button" }, t("home.birthdayOpen")),
              ),
            );
          })),
        ]
      : null,
    coming.length > 0
      ? [
          mine.length > 0 ? h("h3", { class: "birthday-group" }, t("home.birthdaysComing")) : null,
          h("ul", { class: "birthday-list" }, coming.map((b) => birthdayLine(b, status, navigate))),
        ]
      : null,
  );
}

function whenText(b) {
  const date = formatBirthday(b.birthday_day, b.birthday_month);
  return b.days === 0
    ? t("home.birthdayToday")
    : b.days === 1
      ? t("home.birthdayTomorrow", { date })
      : t("home.birthdayIn", { date, days: b.days });
}

function birthdayLine(b, status, navigate) {
  // Opens by itself: say when, and that launching only opens it earlier.
  const autoOpen = b.state === "to_launch" && b.auto_open_date
    ? new Date(`${b.auto_open_date}T00:00:00`) > new Date()
      ? t("home.birthdayAutoOpen", { date: formatDate(b.auto_open_date) })
      : t("home.birthdayAutoOpenSoon")
    : null;

  let action = null;
  if (b.state === "open") {
    // The administrator or the organiser, not taking part.
    action = h("a", { class: "button-link", href: `#/birthday?id=${b.event_id}` }, t("home.birthdayParticipantsLink"));
  } else if (b.state === "elsewhere") {
    action = h("span", { class: "birthday-state" }, t("home.birthdayElsewhere"));
  } else if (b.state === "to_launch") {
    action = confirmButton({
      label: t("home.birthdayLaunch"),
      question: t(b.auto_open_date ? "home.birthdayLaunchQuestionAuto" : "home.birthdayLaunchQuestionManual", {
        name: b.display_name,
        date: formatDate(b.auto_open_date),
      }),
      confirmLabel: t("home.birthdayLaunchConfirm"),
      className: "button-secondary birthday-launch",
      onConfirm: async () => {
        try {
          const eventId = await rpc("launch_birthday", {
            p_member_id: b.member_id,
            p_title: t("birthday.titleDefault", { name: b.display_name }),
          });
          navigate(`/birthday?id=${eventId}`);
        } catch (error) {
          status.show(errorText(error), "error");
        }
      },
    });
  }

  return h(
    "li",
    {},
    h(
      "p",
      { class: "birthday-line" },
      h("span", { class: "birthday-name" }, b.state === "mine" ? t("home.birthdayMe") : b.display_name),
      t("home.birthdaySeparator"),
      h("span", { class: "birthday-when" }, whenText(b)),
    ),
    autoOpen ? h("p", { class: "birthday-auto" }, autoOpen) : null,
    action,
  );
}

function shortcut(href, title, text, highlight) {
  return h(
    "a",
    { class: `shortcut card${highlight ? " highlight" : ""}`, href },
    h("span", { class: "shortcut-title" }, title),
    h("span", { class: "shortcut-text" }, text),
  );
}
