// Entry point: reads the URL hash and renders the matching screen into <main>.
// Hash routing (#/, #/home, #/my-list...) works on GitHub Pages without any server setup.
// New screens are added to the ROUTES table as they are built.

import { applyTranslations } from "./i18n.js";
import { renderWelcome } from "./screens/welcome.js";
import { renderNotFound } from "./screens/not-found.js";

const ROUTES = {
  "/": renderWelcome,
};

function currentPath() {
  // "#/my-list?x=1" -> "/my-list"; an empty hash means the welcome screen.
  const path = location.hash.replace(/^#/, "").split("?")[0];
  return path === "" ? "/" : path;
}

function render() {
  const main = document.getElementById("main");
  const renderScreen = ROUTES[currentPath()] ?? renderNotFound;
  main.replaceChildren(renderScreen());
  // Move focus to the new content for keyboard and screen-reader users.
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

applyTranslations();
window.addEventListener("hashchange", render);
render();
