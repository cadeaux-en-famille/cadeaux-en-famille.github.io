// Personal space (route "#/home"), signed-in members only: greeting and shortcuts.
// The draw card is added in step 7.

import { h } from "../dom.js";
import { t } from "../i18n.js";
import { getMe, select } from "../api.js";
import { renderNotMember } from "./not-member.js";

export async function renderHome() {
  const me = await getMe();
  if (!me) return renderNotMember();

  const wishes = await select("wishes", `select=id&member_id=eq.${me.id}&archived=is.false`);
  const wishSummary = wishes.length === 0
    ? t("home.listEmpty")
    : t(wishes.length === 1 ? "home.listOne" : "home.listMany", { count: wishes.length });

  return h(
    "section",
    { class: "home" },
    h(
      "div",
      { class: "home-header" },
      h("h1", {}, t("home.greeting", { name: me.display_name })),
      me.is_admin ? h("span", { class: "badge" }, t("home.adminBadge")) : null,
    ),
    h("p", { class: "lead" }, t("home.intro")),
    h("div", { class: "card draw-placeholder" }, h("h2", {}, t("home.drawTitle")), h("p", {}, t("home.drawSoon"))),
    h(
      "div",
      { class: "shortcuts" },
      shortcut("#/my-list", t("home.myListTitle"), wishSummary, wishes.length === 0),
      shortcut("#/profile", t("home.profileTitle"), t("home.profileText"), false),
    ),
  );
}

function shortcut(href, title, text, highlight) {
  return h(
    "a",
    { class: `shortcut card${highlight ? " highlight" : ""}`, href },
    h("span", { class: "shortcut-title" }, title),
    h("span", { class: "shortcut-text" }, text),
  );
}
