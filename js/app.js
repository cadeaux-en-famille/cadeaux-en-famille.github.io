// Entry point: reads the URL hash and renders the matching screen into <main>.
// Hash routing (#/, #/home, ...) works on GitHub Pages without any server setup.
//
// Each route says whether it needs a signed-in member. Screens may be async
// (they load data first); a loading text is shown meanwhile.

import { applyTranslations, t } from "./i18n.js?v=930b6bf";
import { h } from "./dom.js?v=930b6bf";
import { initApi, isSignedIn, getMe } from "./api.js?v=930b6bf";
import { renderWelcome } from "./screens/welcome.js?v=930b6bf";
import { renderHome } from "./screens/home.js?v=930b6bf";
import { renderMyList } from "./screens/my-list.js?v=930b6bf";
import { renderProfile } from "./screens/profile.js?v=930b6bf";
import { renderReceiver } from "./screens/receiver.js?v=930b6bf";
import { renderMessages } from "./screens/messages.js?v=930b6bf";
import { renderHistory } from "./screens/history.js?v=930b6bf";
import { renderNotifications, unreadCount } from "./screens/notifications.js?v=930b6bf";
import { renderNotFound } from "./screens/not-found.js?v=930b6bf";
import { renderAdminEvents } from "./screens/admin/events.js?v=930b6bf";
import { renderAdminMembers } from "./screens/admin/members.js?v=930b6bf";
import { renderAdminSettings } from "./screens/admin/settings.js?v=930b6bf";
import { renderAdminEmails } from "./screens/admin/emails.js?v=930b6bf";

const ROUTES = {
  "/": { screen: renderWelcome, public: true },
  "/home": { screen: renderHome },
  "/my-list": { screen: renderMyList },
  "/profile": { screen: renderProfile },
  "/receiver": { screen: renderReceiver },
  "/messages": { screen: renderMessages },
  "/history": { screen: renderHistory },
  "/notifications": { screen: renderNotifications },
  "/admin": { screen: renderAdminEvents },
  "/admin/members": { screen: renderAdminMembers },
  "/admin/settings": { screen: renderAdminSettings },
  "/admin/emails": { screen: renderAdminEmails },
};

// Links shown in the header for signed-in members.
const NAV_LINKS = [
  { path: "/home", label: "nav.home" },
  { path: "/my-list", label: "nav.myList" },
  { path: "/messages", label: "nav.messages" },
  { path: "/profile", label: "nav.profile" },
  { path: "/admin", label: "admin.navLabel", adminOnly: true },
];

let renderCount = 0;

function currentPath() {
  // "#/home?x=1" -> "/home"; an empty hash means the welcome screen.
  const path = location.hash.replace(/^#/, "").split("?")[0];
  return path === "" ? "/" : path;
}

// "#/admin/settings?to=sending" -> "sending": the screen opens scrolled to that element.
function scrollTarget() {
  return new URLSearchParams(location.hash.split("?")[1] ?? "").get("to");
}

export function navigate(path) {
  // Same address (query included): setting the hash again would fire no "hashchange".
  if (location.hash.replace(/^#/, "") === path || currentPath() === path) {
    render();
  } else {
    location.hash = `#${path}`;   // triggers "hashchange", which calls render()
  }
}

async function renderNav(path) {
  const nav = document.getElementById("site-nav");
  if (!isSignedIn()) {
    nav.hidden = true;
    nav.replaceChildren();
    return;
  }
  let isAdmin = false;
  try {
    isAdmin = (await getMe())?.is_admin === true;
  } catch {
    // Navigation still works without the admin link.
  }
  const section = path.startsWith("/admin") ? "/admin" : path;
  const bell = h(
    "a",
    {
      href: "#/notifications",
      class: "nav-bell",
      "aria-label": t("nav.notifications"),
      "aria-current": path === "/notifications" ? "page" : null,
    },
    bellIcon(),
    h("span", { class: "bell-count", hidden: true }),
  );
  nav.hidden = false;
  nav.replaceChildren(
    ...NAV_LINKS.filter((link) => !link.adminOnly || isAdmin).map((link) =>
      h("a", { href: `#${link.path}`, "aria-current": link.path === section ? "page" : null }, t(link.label)),
    ),
    bell,
  );
  refreshBell();
}

// Unread count on the bell; refreshed on every screen and when a screen marks items read.
async function refreshBell() {
  const badge = document.querySelector(".bell-count");
  if (!badge) return;
  try {
    const count = await unreadCount();
    badge.hidden = count === 0;
    badge.textContent = count > 9 ? "9+" : String(count);
    badge.parentElement.setAttribute("aria-label", t("nav.notificationsCount", { count }));
  } catch {
    badge.hidden = true;
  }
}
document.addEventListener("notifications-changed", refreshBell);

function bellIcon() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", "M12 3a6 6 0 0 0-6 6v3.6L4.3 15.4A1 1 0 0 0 5.2 17h13.6a1 1 0 0 0 .9-1.6L18 12.6V9a6 6 0 0 0-6-6zm-2.5 15.5a2.5 2.5 0 0 0 5 0z");
  path.setAttribute("fill", "currentColor");
  svg.append(path);
  return svg;
}

async function render() {
  const main = document.getElementById("main");
  const path = currentPath();
  const route = ROUTES[path];

  // Guards: members only on private screens; signed-in members skip the welcome screen.
  if (route && !route.public && !isSignedIn()) return navigate("/");
  if (path === "/" && isSignedIn()) return navigate("/home");

  const thisRender = ++renderCount;
  main.replaceChildren(h("p", { class: "loading" }, t("common.loading")));

  let content;
  try {
    content = route ? await route.screen({ navigate }) : renderNotFound();
  } catch (error) {
    // A screen that fails to load: if the session ended, back to sign-in.
    if (!isSignedIn()) return navigate("/");
    console.error(error);
    content = h("p", { class: "form-message", "data-kind": "error" }, t("errors.generic"));
  }

  // Ignore a slow screen if the member already moved elsewhere.
  if (thisRender !== renderCount) return;
  await renderNav(path);
  main.replaceChildren(content);
  // Move focus to the new content for keyboard and screen-reader users.
  main.focus({ preventScroll: true });
  const target = scrollTarget() && document.getElementById(scrollTarget());
  if (target) target.scrollIntoView({ block: "start" });
  else window.scrollTo(0, 0);
}

applyTranslations();
await initApi();
window.addEventListener("hashchange", render);
render();
