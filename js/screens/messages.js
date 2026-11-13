// "Messages" (route "#/messages") for the current event:
//   - with my secret giver   (anonymous: I never learn who writes)
//   - with the person I give to (they never learn it is me)
//   - with the whole family  (signed, shown as "À toute la famille")
// Opening the screen marks the messages and their notifications as read.

import { h } from "../dom.js?v=5d60296";
import { t, errorText } from "../i18n.js?v=5d60296";
import { getMe, select, rpc, insert, update } from "../api.js?v=5d60296";
import { statusLine, whileBusy, formatDateTime } from "../ui.js?v=5d60296";
import { renderNotMember } from "./not-member.js?v=5d60296";

export async function renderMessages({ navigate }) {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [events, statuses, familyQuestions] = await Promise.all([
    select("events", "select=id,title,status&status=neq.closed&kind=eq.christmas&order=year.desc"),
    rpc("my_draw_status"),
    rpc("my_family_questions"),
  ]);
  const statusByEvent = new Map(statuses.map((s) => [s.event_id, s]));
  const event = events.find((e) => statusByEvent.has(e.id));
  // Questions the family asks me for my birthday, whoever asked: answered here.
  const questionThreads = familyQuestionThreads(familyQuestions, () => navigate("/messages"));
  if (questionThreads.length > 0) markQuestionsRead();
  if (!event) {
    return h(
      "section",
      { class: "messages" },
      h("h1", {}, t("messages.title")),
      questionThreads,
      h("p", { class: "card" }, t("messages.noEvent")),
    );
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
    questionThreads,
    // Both conversations are two-way and anonymous for the giver: whoever writes
    // first, the other can answer. They only open once the draw gives them two ends.
    drawStatus.has_giver
      ? anonymousThread({
          title: t("messages.withGiverTitle"),
          hint: t("messages.withGiverHint"),
          messages: messages.filter((m) => m.thread === "giver"),
          theirLabel: t("messages.secretGiver"),
          send: (body) => rpc("send_anonymous_message", { p_event_id: event.id, p_to: "giver", p_body: body }),
          reload,
        })
      : closedThread(t("messages.withGiverTitle"), t("messages.noGiverYet")),
    drawStatus.has_draw
      ? anonymousThread({
          title: receiverName ? t("messages.withReceiverTitle", { name: receiverName }) : t("messages.withReceiverHidden"),
          hint: t("messages.withReceiverHint"),
          messages: messages.filter((m) => m.thread === "receiver"),
          theirLabel: receiverName ?? t("messages.myReceiver"),
          send: (body) => rpc("send_anonymous_message", { p_event_id: event.id, p_to: "receiver", p_body: body }),
          reload,
        })
      : closedThread(t("messages.withReceiverHidden"), t("messages.noReceiverYet", { event: event.title })),
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

/** One thread per birthday being prepared for me; the title only when it is not secret. */
function familyQuestionThreads(rows, reload) {
  const threads = new Map();
  for (const row of rows) {
    if (!threads.has(row.thread_id)) threads.set(row.thread_id, { title: row.title, rows: [] });
    threads.get(row.thread_id).rows.push(row);
  }
  return [...threads].map(([threadId, thread]) =>
    anonymousThread({
      title: thread.title ? t("messages.questionsForTitle", { title: thread.title }) : t("messages.questionsTitle"),
      hint: t("messages.questionsHint"),
      messages: thread.rows.map((r) => ({ mine: r.from_me, body: r.body, created_at: r.created_at, read_at: true })),
      theirLabel: t("messages.familyMember"),
      send: (body) => rpc("answer_family_question", { p_thread_id: threadId, p_body: body }),
      reload,
    }),
  );
}

async function markQuestionsRead() {
  try {
    await update("notifications", "kind=eq.family_question&read_at=is.null", { read_at: new Date().toISOString() });
    document.dispatchEvent(new CustomEvent("notifications-changed"));
  } catch {
    // ignore
  }
}

/** A conversation that cannot be opened yet: says why, instead of a box that fails. */
function closedThread(title, explanation) {
  return h(
    "article",
    { class: "card thread closed" },
    h("h2", {}, title),
    h("p", { class: "empty" }, explanation),
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

export function bubbles(items) {
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

export function composer(send, reload) {
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

