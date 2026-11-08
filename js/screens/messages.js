// "Messages" (route "#/messages") for the current event:
//   - with my secret giver   (anonymous: I never learn who writes)
//   - with the person I give to (they never learn it is me)
//   - with the whole family  (signed, shown as "À toute la famille")
// Opening the screen marks the messages and their notifications as read.

import { h } from "../dom.js?v=fffb887";
import { t, errorText } from "../i18n.js?v=fffb887";
import { getMe, select, rpc, insert, update } from "../api.js?v=fffb887";
import { statusLine, whileBusy, formatDateTime } from "../ui.js?v=fffb887";
import { renderNotMember } from "./not-member.js?v=fffb887";

export async function renderMessages({ navigate }) {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [events, statuses] = await Promise.all([
    select("events", "select=id,title,status&status=neq.closed&order=year.desc"),
    rpc("my_draw_status"),
  ]);
  const statusByEvent = new Map(statuses.map((s) => [s.event_id, s]));
  const event = events.find((e) => statusByEvent.has(e.id));
  if (!event) {
    return h("section", { class: "card" }, h("h1", {}, t("messages.title")), h("p", {}, t("messages.noEvent")));
  }
  const drawStatus = statusByEvent.get(event.id);

  // The receiver's name is only shown once the member has revealed their draw.
  let receiverName = null;
  if (drawStatus.has_draw && drawStatus.viewed) {
    const draws = await rpc("get_my_draws");
    receiverName = draws.find((d) => d.event_id === event.id)?.receiver_name ?? null;
  }

  const [messages, familyMessages, members] = await Promise.all([
    rpc("get_my_messages", { p_event_id: event.id }),
    select("family_messages", `select=id,author_id,body,created_at&event_id=eq.${event.id}&order=created_at.asc`),
    select("members", "select=id,display_name"),
  ]);
  const names = new Map(members.map((m) => [m.id, m.display_name]));
  const reload = () => navigate("/messages");

  const content = h(
    "section",
    { class: "messages" },
    h("h1", {}, t("messages.title")),
    h("p", { class: "lead" }, t("messages.intro", { event: event.title })),
    anonymousThread({
      title: t("messages.withGiverTitle"),
      hint: t("messages.withGiverHint"),
      messages: messages.filter((m) => m.thread === "giver"),
      theirLabel: t("messages.secretGiver"),
      send: (body) => rpc("send_anonymous_message", { p_event_id: event.id, p_to: "giver", p_body: body }),
      reload,
    }),
    drawStatus.has_draw
      ? anonymousThread({
          title: receiverName ? t("messages.withReceiverTitle", { name: receiverName }) : t("messages.withReceiverHidden"),
          hint: t("messages.withReceiverHint"),
          messages: messages.filter((m) => m.thread === "receiver"),
          theirLabel: receiverName ?? t("messages.myReceiver"),
          send: (body) => rpc("send_anonymous_message", { p_event_id: event.id, p_to: "receiver", p_body: body }),
          reload,
        })
      : null,
    familyThread(event, familyMessages, names, me, reload),
  );

  markRead(event, messages);
  return content;
}

function anonymousThread({ title, hint, messages, theirLabel, send, reload }) {
  return h(
    "article",
    { class: "card thread" },
    h("h2", {}, title),
    h("p", { class: "field-hint" }, hint),
    bubbles(messages.map((m) => ({
      mine: m.mine,
      author: m.mine ? t("messages.me") : theirLabel,
      body: m.body,
      date: m.created_at,
      unread: !m.mine && !m.read_at,
    }))),
    composer(send, reload),
  );
}

function familyThread(event, familyMessages, names, me, reload) {
  return h(
    "article",
    { class: "card thread family" },
    h("h2", {}, t("messages.familyTitle")),
    h("p", { class: "field-hint" }, t("messages.familyHint")),
    bubbles(familyMessages.map((m) => ({
      mine: m.author_id === me.id,
      author: m.author_id === me.id ? t("messages.me") : names.get(m.author_id) ?? "?",
      body: m.body,
      date: m.created_at,
      tag: t("messages.toEveryone"),
    }))),
    composer((body) => insert("family_messages", { event_id: event.id, body }), reload),
  );
}

function bubbles(items) {
  if (items.length === 0) return h("p", { class: "empty" }, t("messages.empty"));
  return h(
    "ol",
    { class: "bubbles" },
    items.map((item) =>
      h(
        "li",
        { class: `bubble${item.mine ? " mine" : ""}${item.unread ? " unread" : ""}` },
        h(
          "p",
          { class: "bubble-meta" },
          h("span", { class: "bubble-author" }, item.author),
          item.tag ? h("span", { class: "bubble-tag" }, item.tag) : null,
          h("span", { class: "bubble-date" }, formatDateTime(item.date)),
        ),
        h("p", { class: "bubble-body" }, item.body),
      ),
    ),
  );
}

function composer(send, reload) {
  const status = statusLine();
  const input = h("textarea", { rows: 2, maxlength: 2000, "aria-label": t("messages.write"), placeholder: t("messages.write") });
  const button = h("button", { type: "submit", class: "button-primary" }, t("messages.send"));
  return h(
    "form",
    {
      class: "composer",
      novalidate: true,
      onsubmit: async (event) => {
        event.preventDefault();
        const body = input.value.trim();
        if (!body) return;
        try {
          await whileBusy(button, t("messages.sending"), () => send(body));
          reload();
        } catch (error) {
          status.show(errorText(error), "error");
        }
      },
    },
    input,
    button,
    status.element,
  );
}

// Best effort: failures only mean the bell keeps its count a little longer.
async function markRead(event, messages) {
  try {
    const jobs = [];
    for (const thread of ["giver", "receiver"]) {
      if (messages.some((m) => m.thread === thread && !m.mine && !m.read_at)) {
        jobs.push(rpc("mark_messages_read", { p_event_id: event.id, p_thread: thread }));
      }
    }
    jobs.push(update(
      "notifications",
      `kind=eq.family_message&event_id=eq.${event.id}&read_at=is.null`,
      { read_at: new Date().toISOString() },
    ));
    await Promise.all(jobs);
    document.dispatchEvent(new CustomEvent("notifications-changed"));
  } catch {
    // ignore
  }
}

