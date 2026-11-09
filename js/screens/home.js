// Personal space (route "#/home"): greeting, the current event with "my draw", the
// birthdays of the coming weeks, shortcuts.
//
// "My draw" card, depending on the situation:
//   - no event in progress            -> short message
//   - declared event, not declared yet -> "J'offre à…" form (2026, draw made before the site)
//   - random event, not drawn yet      -> waiting message
//   - draw not seen yet                -> "Découvrir" button (reveal; the first view is recorded)
//   - draw already seen                -> receiver's name and link to their list
// The receiver is only fetched (get_my_draws) when the member asks to see it.

import { h, fill } from "../dom.js?v=930b6bf";
import { t, errorText } from "../i18n.js?v=930b6bf";
import { getMe, select, rpc } from "../api.js?v=930b6bf";
import { field, statusLine, confirmButton, formatEuro, formatDate, formatBirthday, daysUntilBirthday } from "../ui.js?v=930b6bf";
import { renderNotMember } from "./not-member.js?v=930b6bf";

export async function renderHome({ navigate }) {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [wishes, events, statuses, birthdays] = await Promise.all([
    select("wishes", `select=id&member_id=eq.${me.id}&archived=is.false`),
    select("events", "select=*&status=neq.closed&order=year.desc"),
    rpc("my_draw_status"),
    select("members", "select=id,display_name,birthday_day,birthday_month&is_active=is.true&birthday_day=not.is.null"),
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
    birthdayCard(me, birthdays),
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

  const submit = confirmButton({
    label: t("home.declareSubmit"),
    confirmLabel: t("home.declareConfirm"),
    className: "button-primary",
    onConfirm: async () => {
      if (!receiver.input.value) {
        status.show(t("home.declareMissing"), "error");
        return;
      }
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

// The birthdays of the next BIRTHDAY_DAYS days, the closest first (none: no card).
const BIRTHDAY_DAYS = 30;

function birthdayCard(me, members) {
  const coming = members
    .map((m) => ({ ...m, days: daysUntilBirthday(m.birthday_day, m.birthday_month) }))
    .filter((m) => m.days !== null && m.days <= BIRTHDAY_DAYS)
    .sort((a, b) => a.days - b.days || a.display_name.localeCompare(b.display_name, "fr"));
  if (coming.length === 0) return null;
  return h(
    "article",
    { class: "card birthdays" },
    h("h2", {}, t("home.birthdaysTitle")),
    h(
      "ul",
      { class: "birthday-list" },
      coming.map((m) =>
        h(
          "li",
          {},
          h("span", { class: "birthday-name" }, m.id === me.id ? t("home.birthdayMe") : m.display_name),
          t("home.birthdaySeparator"),
          h(
            "span",
            { class: "birthday-when" },
            m.days === 0
              ? t("home.birthdayToday")
              : m.days === 1
                ? t("home.birthdayTomorrow", { date: formatBirthday(m.birthday_day, m.birthday_month) })
                : t("home.birthdayIn", { date: formatBirthday(m.birthday_day, m.birthday_month), days: m.days }),
          ),
        ),
      ),
    ),
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
