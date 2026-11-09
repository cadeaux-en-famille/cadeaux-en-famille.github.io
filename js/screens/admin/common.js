// Shared frame of the admin screens: admin-only guard and the tab bar.
// The guard is only for display: every admin action is also checked by the database.

import { h } from "../../dom.js?v=b3b045e";
import { t } from "../../i18n.js?v=b3b045e";
import { getMe } from "../../api.js?v=b3b045e";

export const ADMIN_TABS = [
  { path: "/admin", key: "events" },
  { path: "/admin/members", key: "members" },
  { path: "/admin/settings", key: "settings" },
  { path: "/admin/emails", key: "emails" },
];

/** Returns a "not allowed" screen for non-admins, or null when the member is the admin. */
export async function requireAdmin() {
  const me = await getMe();
  if (me?.is_admin) return null;
  return h("section", { class: "card" }, h("h1", {}, t("admin.title")), h("p", {}, t("admin.notAllowed")));
}

/** Title, tab bar and the screen content. */
export function adminShell(activePath, ...content) {
  return h(
    "section",
    { class: "admin" },
    h("h1", {}, t("admin.title")),
    h(
      "nav",
      { class: "admin-tabs", "aria-label": t("admin.title") },
      ADMIN_TABS.map((tab) =>
        h(
          "a",
          { href: `#${tab.path}`, "aria-current": tab.path === activePath ? "page" : null },
          t(`admin.tabs.${tab.key}`),
        ),
      ),
    ),
    ...content,
  );
}
