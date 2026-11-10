// Shared frame of the admin screens: admin-only guard, the tab bar, and a banner while
// the emails are paused (a pause forgotten in December would silently stop all mail).
// The guard is only for display: every admin action is also checked by the database.

import { h, fill } from "../../dom.js?v=420da35";
import { t } from "../../i18n.js?v=420da35";
import { getMe, select } from "../../api.js?v=420da35";
import { formatDate } from "../../ui.js?v=420da35";

export const ADMIN_TABS = [
  { path: "/admin", key: "events" },
  { path: "/admin/birthdays", key: "birthdays" },
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
  const banner = h("div", { role: "status" });
  // Filled once the settings arrive; the screen does not wait for it.
  select("settings", "select=emails_paused,emails_paused_at")
    .then(([settings]) => {
      if (!settings?.emails_paused) return;
      fill(
        banner,
        h(
          "p",
          { class: "form-message paused-banner", "data-kind": "error" },
          t("admin.pausedBanner", { date: formatDate(settings.emails_paused_at) }),
          " ",
          h("a", { href: "#/admin/settings?to=sending" }, t("admin.pausedBannerLink")),
        ),
      );
    })
    .catch(() => {});

  return h(
    "section",
    { class: "admin" },
    h("h1", {}, t("admin.title")),
    banner,
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
