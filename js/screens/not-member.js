// Shown to a signed-in account that is not linked to an active family member.

import { h } from "../dom.js?v=5c310fc";
import { t } from "../i18n.js?v=5c310fc";

export function renderNotMember() {
  return h(
    "section",
    { class: "card" },
    h("h1", {}, t("home.notMemberTitle")),
    h("p", {}, t("home.notMemberText")),
  );
}
