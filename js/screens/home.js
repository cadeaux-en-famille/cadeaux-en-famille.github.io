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

import { h, fill } from "../dom.js?v=6c60e8a";
import { t, errorText } from "../i18n.js?v=6c60e8a";
import { getMe, select, rpc } from "../api.js?v=6c60e8a";
import { field, statusLine, confirmButton, formatEuro, formatDate, formatBirthday } from "../ui.js?v=6c60e8a";
import { renderNotMember } from "./not-member.js?v=6c60e8a";

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

  const [christmas, preparing] = await Promise.all([
    drawCard(me, event, event ? statusByEvent.get(event.id) : null, navigate),
    birthdayCards(me, birthdays),
  ]);

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
    // A Christmas in progress comes first; otherwise the birthdays being prepared go
    // before the empty « Mon tirage » card.
    event ? christmas : null,
    preparing,
    event ? null : christmas,
    comingBirthdaysCard(birthdays, navigate),
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

// The birthdays I take part in get a card each, framed like the Christmas one, with where
// things stand (participants, money gathered, what I chose or « rien choisi »). The other
// coming birthdays are listed in « Anniversaires à venir », with « Lancer la préparation »
// when I may and the date it will open by itself.
const takingPart = (b) => b.state === "open" && b.taking_part;

async function birthdayCards(me, birthdays) {
  const ids = birthdays.filter(takingPart).map((b) => b.event_id);
  if (ids.length === 0) return [];
  const among = `event_id=in.(${ids.join(",")})`;
  const [events, participants, contributions, gifts] = await Promise.all([
    select("events", `select=id,title,event_date,budget_eur&id=in.(${ids.join(",")})`),
    select("participants", `select=event_id&${among}`),
    select("birthday_contributions", `select=event_id,gift_id,member_id,amount_eur&${among}`),
    select("birthday_gifts", `select=id,title&${among}`),
  ]);
  const giftTitle = new Map(gifts.map((g) => [g.id, g.title]));

  return events
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .map((event) => {
      const count = participants.filter((p) => p.event_id === event.id).length;
      const onIt = contributions.filter((c) => c.event_id === event.id);
      const total = onIt.reduce((sum, c) => sum + Number(c.amount_eur ?? 0), 0);
      const chosen = onIt.filter((c) => c.member_id === me.id).map((c) => giftTitle.get(c.gift_id)).filter(Boolean);
      return h(
        "article",
        { class: "card draw-card birthday-card" },
        h("div", { class: "draw-head" }, h("h2", {}, "🎁 ", event.title), countdown(event.event_date)),
        h(
          "ul",
          { class: "event-meta" },
          h("li", {}, t("home.eventDate", { date: formatDate(event.event_date) })),
          h("li", {}, t("home.birthdayContribution", { amount: formatEuro(event.budget_eur) })),
          h("li", {}, total > 0
            ? t("home.birthdayFactsMoney", { count, amount: formatEuro(total) })
            : t("home.birthdayFacts", { count })),
        ),
        h(
          "div",
          { class: "draw-body" },
          chosen.length > 0
            ? h("p", { class: "birthday-mine" }, t("home.birthdayYouChose", { gifts: chosen.join(", ") }))
            : h("p", { class: "birthday-todo" }, t("home.birthdayNothingChosen")),
          h("a", { class: "button-primary link-button", href: `#/birthday?id=${event.id}` }, t("home.birthdayOpen")),
        ),
      );
    });
}

function comingBirthdaysCard(birthdays, navigate) {
  const status = statusLine();
  const coming = birthdays.filter((b) => !takingPart(b)
    && (b.days <= SHOWN_WITHOUT_ACTION || b.state === "to_launch" || b.state === "open"));
  if (coming.length === 0) return null;
  return h(
    "article",
    { class: "card birthdays" },
    h("h2", {}, t("home.birthdaysTitle")),
    status.element,
    h("ul", { class: "birthday-list" }, coming.map((b) => birthdayLine(b, status, navigate))),
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
