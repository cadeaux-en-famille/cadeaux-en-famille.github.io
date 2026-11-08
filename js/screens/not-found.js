// Shown for any unknown route.

import { h } from "../dom.js?v=ac29075";
import { t } from "../i18n.js?v=ac29075";

export function renderNotFound() {
  return h(
    "section",
    { class: "card" },
    h("h1", {}, t("notFound.title")),
    h("p", {}, t("notFound.text")),
    h("p", {}, h("a", { href: "#/" }, t("common.back"))),
  );
}
