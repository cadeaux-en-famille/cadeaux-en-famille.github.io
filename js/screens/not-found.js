// Shown for any unknown route.

import { h } from "../dom.js?v=1815b38";
import { t } from "../i18n.js?v=1815b38";

export function renderNotFound() {
  return h(
    "section",
    { class: "card" },
    h("h1", {}, t("notFound.title")),
    h("p", {}, t("notFound.text")),
    h("p", {}, h("a", { href: "#/" }, t("common.back"))),
  );
}
