// "Historique" (route "#/history"): every event I took part in, newest first, with
// the budget and, for finished events, who I gave to and the gifts I noted as bought.
// Events still running only link to the home screen: their draw is never revealed here.
// Birthdays I prepared link to their page; my own past birthdays say who took part.

import { h } from "../dom.js?v=0a82ace";
import { t } from "../i18n.js?v=0a82ace";
import { getMe, select, rpc } from "../api.js?v=0a82ace";
import { formatEuro, formatDate } from "../ui.js?v=0a82ace";
import { renderNotMember } from "./not-member.js?v=0a82ace";

export async function renderHistory() {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [participations, pastDraws, purchases, myBirthdays] = await Promise.all([
    select(
      "participants",
      `select=event_id,events(id,kind,year,title,event_date,budget_eur,status)&member_id=eq.${me.id}`,
    ),
    rpc("get_my_past_draws"),
    select("purchase_tracking", `select=event_id,label,status&giver_id=eq.${me.id}&order=created_at.asc`),
    rpc("my_past_birthdays"),
  ]);

  const events = participations
    .map((p) => p.events)
    .filter(Boolean)
    .sort((a, b) => b.year - a.year || String(b.event_date).localeCompare(String(a.event_date)));
  const receiverByEvent = new Map(pastDraws.map((d) => [d.event_id, d.receiver_name]));

  if (events.length === 0 && myBirthdays.length === 0) {
    return h("section", { class: "card" }, h("h1", {}, t("history.title")), h("p", {}, t("history.empty")));
  }

  return h(
    "section",
    { class: "history" },
    h("h1", {}, t("history.title")),
    h("p", { class: "lead" }, t("history.intro")),
    myBirthdays.length > 0
      ? h(
          "ol",
          { class: "history-list" },
          myBirthdays.map((b) =>
            h(
              "li",
              { class: "card history-item" },
              h("div", { class: "event-head" }, h("h2", {}, t("history.myBirthday", { year: b.year }))),
              h("p", {}, t("history.birthdayParticipants", { names: b.participants.join(", ") })),
            ),
          ),
        )
      : null,
    h(
      "ol",
      { class: "history-list" },
      events.map((event) => {
        const gifts = purchases.filter(
          (p) => p.event_id === event.id && (p.status === "bought" || p.status === "wrapped"),
        );
        const closed = event.status === "closed";
        const receiver = receiverByEvent.get(event.id);
        if (event.kind === "birthday") return birthdayItem(event);
        return h(
          "li",
          { class: "card history-item" },
          h(
            "div",
            { class: "event-head" },
            h("h2", {}, event.title),
            h("span", { class: `status status-${event.status}` }, t(`admin.events.status.${event.status}`)),
          ),
          h(
            "ul",
            { class: "event-meta" },
            h("li", {}, t("home.eventDate", { date: formatDate(event.event_date) })),
            h("li", {}, t("home.eventBudget", { budget: formatEuro(event.budget_eur) })),
          ),
          closed
            ? h(
                "p",
                { class: "history-receiver" },
                receiver ? t("history.gaveTo", { name: receiver }) : t("history.noDraw"),
              )
            : h("p", {}, h("a", { href: "#/home" }, t("history.inProgress"))),
          closed && gifts.length > 0
            ? h(
                "div",
                { class: "history-gifts" },
                h("p", { class: "field-hint" }, t("history.myGifts")),
                h("ul", {}, gifts.map((g) => h("li", {}, g.label))),
              )
            : null,
        );
      }),
    ),
  );
}

function birthdayItem(event) {
  return h(
    "li",
    { class: "card history-item" },
    h(
      "div",
      { class: "event-head" },
      h("h2", {}, event.title),
      h("span", { class: `status status-${event.status}` }, t(`history.birthdayStatus.${event.status}`)),
    ),
    h("ul", { class: "event-meta" }, h("li", {}, t("home.eventDate", { date: formatDate(event.event_date) }))),
    h("p", {}, h("a", { href: `#/birthday?id=${event.id}` }, t("history.birthdayOpen"))),
  );
}
