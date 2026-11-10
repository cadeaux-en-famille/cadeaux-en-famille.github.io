// « Lui demander des idées »: the block shared by the Christmas receiver page and the
// birthday page. Shows when ideas were last asked for and, at most once every 7 days
// (the database checks it too), sends an anonymous request to the person.

import { h } from "../dom.js?v=420da35";
import { t, errorText } from "../i18n.js?v=420da35";
import { rpc } from "../api.js?v=420da35";
import { confirmButton, formatDate } from "../ui.js?v=420da35";

const DAYS_BETWEEN = 7;

/**
 * eventId, memberId, name: who is asked, for which event.
 * lastRequest: ISO date of the latest request for this person and event, or null.
 * mention: "christmas" | "birthday" | "secret" (what the person will be told).
 * status: the screen's statusLine; onSent(): called once the request is sent.
 */
export function askIdeasBlock({ eventId, memberId, name, lastRequest, mention, status, onSent }) {
  const next = lastRequest ? new Date(new Date(lastRequest).getTime() + DAYS_BETWEEN * 86400000) : null;
  const waiting = next && next > new Date();
  return h(
    "div",
    { class: "ask-ideas" },
    h("p", { class: "field-hint" }, t(`ideas.explain.${mention}`, { name })),
    lastRequest
      ? h("p", { class: "ask-ideas-last" }, waiting
          ? t("ideas.lastWaiting", { date: formatDate(lastRequest), next: formatDate(next.toISOString()) })
          : t("ideas.last", { date: formatDate(lastRequest) }))
      : null,
    waiting
      ? null
      : confirmButton({
          label: t("ideas.ask"),
          question: t(`ideas.question.${mention}`, { name }),
          confirmLabel: t("ideas.confirm"),
          className: "button-secondary",
          onConfirm: async () => {
            try {
              await rpc("request_ideas", { p_event_id: eventId, p_member_id: memberId });
              onSent(t("ideas.sent", { name }));
            } catch (error) {
              status.show(errorText(error), "error");
            }
          },
        }),
  );
}
