// Entry point: reads the URL hash and renders the matching screen into <main>.
// Hash routing (#/, #/home, ...) works on GitHub Pages without any server setup.
//
// Each route says whether it needs a signed-in member. Screens may be async
// (they load data first); a loading text is shown meanwhile.

import { applyTranslations, t } from "./i18n.js";
import { h } from "./dom.js";
import { initApi, isSignedIn, signOut, getMe } from "./api.js";
import { renderWelcome } from "./screens/welcome.js";
import { renderHome } from "./screens/home.js";
import { renderMyList } from "./screens/my-list.js";
import { renderProfile } from "./screens/profile.js";
import { renderReceiver } from "./screens/receiver.js";
import { renderNotFound } from "./screens/not-found.js";
import { renderAdminEvents } from "./screens/admin/events.js";
import { renderAdminMembers } from "./screens/admin/members.js";
import { renderAdminSettings } from "./screens/admin/settings.js";
import { renderAdminEmails } from "./screens/admin/emails.js";

const ROUTES = {
  "/": { screen: renderWelcome, public: true },
  "/home": { screen: renderHome },
  "/my-list": { screen: renderMyList },
  "/profile": { screen: renderProfile },
  "/receiver": { screen: renderReceiver },
  "/admin": { screen: renderAdminEvents },
  "/admin/members": { screen: renderAdminMembers },
  "/admin/settings": { screen: renderAdminSettings },
  "/admin/emails": { screen: renderAdminEmails },
};

// Links shown in the header for signed-in members.
const NAV_LINKS = [
  { path: "/home", label: "nav.home" },
  { path: "/my-list", label: "nav.myList" },
  { path: "/profile", label: "nav.profile" },
  { path: "/admin", label: "admin.navLabel", adminOnly: true },
];

let renderCount = 0;

function currentPath() {
  // "#/home?x=1" -> "/home"; an empty hash means the welcome screen.
  const path = location.hash.replace(/^#/, "").split("?")[0];
  return path === "" ? "/" : path;
}

export function navigate(path) {
  if (currentPath() === path) {
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
  nav.hidden = false;
  nav.replaceChildren(
    ...NAV_LINKS.filter((link) => !link.adminOnly || isAdmin).map((link) =>
      h("a", { href: `#${link.path}`, "aria-current": link.path === section ? "page" : null }, t(link.label)),
    ),
    h(
      "button",
      {
        type: "button",
        class: "nav-sign-out",
        onclick: async () => {
          await signOut();
          navigate("/");
        },
      },
      t("common.signOut"),
    ),
  );
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
  window.scrollTo(0, 0);
}

applyTranslations();
await initApi();
window.addEventListener("hashchange", render);
render();
