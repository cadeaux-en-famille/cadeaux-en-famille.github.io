// Shown for any unknown route.

import { h } from "../dom.js?v=420da35";
import { t } from "../i18n.js?v=420da35";

export function renderNotFound() {
  return h(
    "section",
    { class: "card" },
    h("h1", {}, t("notFound.title")),
    h("p", {}, t("notFound.text")),
    h("p", {}, h("a", { href: "#/" }, t("common.back"))),
  );
}
