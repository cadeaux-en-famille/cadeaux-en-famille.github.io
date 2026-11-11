// Shown for any unknown route.

import { h } from "../dom.js?v=b403f9e";
import { t } from "../i18n.js?v=b403f9e";

export function renderNotFound() {
  return h(
    "section",
    { class: "card" },
    h("h1", {}, t("notFound.title")),
    h("p", {}, t("notFound.text")),
    h("p", {}, h("a", { href: "#/" }, t("common.back"))),
  );
}
