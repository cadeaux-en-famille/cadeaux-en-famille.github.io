// Personal space (route "#/home"), signed-in members only.
// For now it greets the member; draw, wish list and history are added in the next steps.

import { h } from "../dom.js";
import { t, errorText } from "../i18n.js";
import { select, currentUserId, signOut } from "../api.js";

export async function renderHome({ navigate }) {
  const signOutButton = h(
    "button",
    {
      type: "button",
      class: "button-secondary",
      onclick: async () => {
        await signOut();
        navigate("/");
      },
    },
    t("common.signOut"),
  );

  let member;
  try {
    const rows = await select(
      "members",
      `select=id,display_name,is_admin&user_id=eq.${encodeURIComponent(currentUserId())}`,
    );
    member = rows[0];
  } catch (error) {
    if (error.status === 401) {
      navigate("/");
      return h("div");
    }
    return h("section", { class: "card" }, h("p", { class: "form-message", "data-kind": "error" }, errorText(error)), signOutButton);
  }

  // Signed in, but no active member row (account not linked or deactivated).
  if (!member) {
    return h(
      "section",
      { class: "card" },
      h("h1", {}, t("home.notMemberTitle")),
      h("p", {}, t("home.notMemberText")),
      signOutButton,
    );
  }

  return h(
    "section",
    { class: "home" },
    h(
      "div",
      { class: "home-header" },
      h("h1", {}, t("home.greeting", { name: member.display_name })),
      member.is_admin ? h("span", { class: "badge" }, t("home.adminBadge")) : null,
    ),
    h("p", { class: "lead" }, t("home.intro")),
    h("div", { class: "card" }, h("p", {}, t("home.comingSoon"))),
    h("div", { class: "actions" }, signOutButton),
  );
}
