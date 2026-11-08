// Entry point: reads the URL hash and renders the matching screen into <main>.
// Hash routing (#/, #/home, ...) works on GitHub Pages without any server setup.
//
// Each route says whether it needs a signed-in member. Screens may be async
// (they load data first); a loading text is shown meanwhile.

import { applyTranslations, t } from "./i18n.js";
import { h } from "./dom.js";
import { initApi, isSignedIn } from "./api.js";
import { renderWelcome } from "./screens/welcome.js";
import { renderHome } from "./screens/home.js";
import { renderNotFound } from "./screens/not-found.js";

const ROUTES = {
  "/": { screen: renderWelcome, public: true },
  "/home": { screen: renderHome },
};

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

async function render() {
  const main = document.getElementById("main");
  const path = currentPath();
  const route = ROUTES[path];

  // Guards: members only on private screens; signed-in members skip the welcome screen.
  if (route && !route.public && !isSignedIn()) return navigate("/");
  if (path === "/" && isSignedIn()) return navigate("/home");

  const thisRender = ++renderCount;
  main.replaceChildren(h("p", { class: "loading" }, t("common.loading")));

  const content = route ? await route.screen({ navigate }) : renderNotFound();

  // Ignore a slow screen if the member already moved elsewhere.
  if (thisRender !== renderCount) return;
  main.replaceChildren(content);
  // Move focus to the new content for keyboard and screen-reader users.
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

applyTranslations();
await initApi();
window.addEventListener("hashchange", render);
render();
