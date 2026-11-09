// "Notifications" (route "#/notifications"): what the bell counts. Texts come from
// i18n/fr.js (notifications.<kind>.text); a click opens the matching screen.

import { h } from "../dom.js?v=8f2143a";
import { t, errorText } from "../i18n.js?v=8f2143a";
import { select, update } from "../api.js?v=8f2143a";
import { statusLine, formatDateTime } from "../ui.js?v=8f2143a";

const LINKS = {
  private_message: "/messages",
  family_message: "/messages",
  receiver_list_changed: "/receiver",
  draw_opened: "/home",
  wishlist_reminder: "/my-list",
  event_reminder: "/home",
  weekly_digest: "/home",
};

/** Screen a notification opens: a birthday's own page for anything about a birthday. */
function linkFor(row) {
  if (row.event_id && row.events?.kind === "birthday") return `/birthday?id=${row.event_id}`;
  return LINKS[row.kind] ?? "/home";
}

/** Number of unread notifications shown under the bell. */
export async function unreadCount() {
  const rows = await select("notifications", "select=id&in_app=is.true&read_at=is.null");
  return rows.length;
}

export async function renderNotifications({ navigate }) {
  const rows = await select("notifications", "select=*,events(kind)&in_app=is.true&order=created_at.desc&limit=50");
  const status = statusLine();

  async function markAllRead() {
    try {
      await update("notifications", "in_app=is.true&read_at=is.null", { read_at: new Date().toISOString() });
      document.dispatchEvent(new CustomEvent("notifications-changed"));
      navigate("/notifications");
    } catch (error) {
      status.show(errorText(error), "error");
    }
  }

  async function open(row) {
    if (!row.read_at) {
      try {
        await update("notifications", `id=eq.${row.id}`, { read_at: new Date().toISOString() });
        document.dispatchEvent(new CustomEvent("notifications-changed"));
      } catch {
        // still open the screen
      }
    }
    navigate(linkFor(row));
  }

  const unread = rows.filter((r) => !r.read_at).length;
  return h(
    "section",
    { class: "notifications" },
    h("h1", {}, t("notificationsScreen.title")),
    status.element,
    unread > 0
      ? h("button", { type: "button", class: "button-secondary", onclick: markAllRead }, t("notificationsScreen.markAll"))
      : null,
    rows.length === 0
      ? h("p", { class: "empty" }, t("notificationsScreen.empty"))
      : h(
          "ul",
          { class: "notification-list" },
          rows.map((row) =>
            h(
              "li",
              {},
              h(
                "button",
                { type: "button", class: `notification${row.read_at ? "" : " unread"}`, onclick: () => open(row) },
                h("span", { class: "notification-text" }, t(`notifications.${row.kind}.text`, { author: row.payload?.author ?? "", days: row.payload?.days ?? "" })),
                h("span", { class: "notification-date" }, formatDateTime(row.created_at)),
              ),
            ),
          ),
        ),
  );
}
