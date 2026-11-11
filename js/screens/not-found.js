// Shown for any unknown route.

import { h } from "../dom.js?v=3bb9c56";
import { t } from "../i18n.js?v=3bb9c56";

export function renderNotFound() {
  return h(
    "section",
    { class: "card" },
    h("h1", {}, t("notFound.title")),
    h("p", {}, t("notFound.text")),
    h("p", {}, h("a", { href: "#/" }, t("common.back"))),
  );
}
