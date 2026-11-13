// "Aide" (route "#/help"): a short illustrated guide for the family, open to everybody,
// signed in or not, since its first section explains how to sign in.
//
// The screenshots in site/help/ show a fictional family; they are produced by
// scripts/help/make-guide.mjs (which also prints this page to site/help/guide.pdf).
// Texts live in fr.js under "help"; this file only knows the order of the sections and
// their pictures.

import { h } from "../dom.js?v=6c60e8a";
import { t } from "../i18n.js?v=6c60e8a";
import { isSignedIn } from "../api.js?v=6c60e8a";

// Section id -> pictures (file names in site/help/), in reading order.
export const HELP_SECTIONS = [
  { id: "connexion", images: ["connexion-email.jpg", "connexion-code.jpg"] },
  { id: "accueil", images: ["accueil.jpg"] },
  { id: "liste", images: ["liste.jpg"] },
  { id: "tirage", images: ["tirage-declaration.jpg", "tirage.jpg"] },
  { id: "messages", images: ["messages.jpg"] },
  { id: "anniversaires", images: ["anniversaire-accueil.jpg", "anniversaire.jpg"] },
  { id: "notifications", images: ["notifications.jpg"] },
];

export const HELP_PDF = "help/guide.pdf";

export function renderHelp() {
  const signedIn = isSignedIn();
  return h(
    "section",
    { class: "help" },
    h("h1", {}, t("help.title")),
    h("p", { class: "lead" }, t("help.intro")),
    h(
      "div",
      { class: "button-row help-actions" },
      signedIn ? null : h("a", { class: "button-primary link-button", href: "#/" }, t("help.signIn")),
      h("a", { class: "button-secondary link-button", href: HELP_PDF, download: "" }, t("help.pdf")),
    ),
    h(
      "nav",
      { class: "card help-toc", "aria-label": t("help.tocTitle") },
      h("h2", {}, t("help.tocTitle")),
      h(
        "ol",
        {},
        HELP_SECTIONS.map(({ id }) => h("li", {}, h("a", { href: `#/help?to=${id}` }, t(`help.sections.${id}.title`)))),
        h("li", {}, h("a", { href: "#/help?to=questions" }, t("help.faqTitle"))),
      ),
    ),
    HELP_SECTIONS.map(({ id, images }, index) =>
      h(
        "article",
        { class: "card help-section", id },
        h("h2", {}, h("span", { class: "help-number" }, String(index + 1)), t(`help.sections.${id}.title`)),
        h(
          "div",
          { class: "help-text" },
          h("ol", { class: "help-steps" }, t(`help.sections.${id}.steps`).map((step) => h("li", {}, step))),
          rulesFor(id),
          t(`help.sections.${id}.tip`) ? h("p", { class: "help-tip" }, t(`help.sections.${id}.tip`)) : null,
        ),
        h("div", { class: "help-figures" }, images.map((file, i) =>
          h(
            "figure",
            { class: "help-figure" },
            h("img", {
              src: `help/${file}`,
              alt: t(`help.sections.${id}.alt`)[i],
              loading: index === 0 ? "eager" : "lazy",
              width: "390",
            }),
            h("figcaption", {}, t(`help.sections.${id}.alt`)[i]),
          ),
        )),
      ),
    ),
    h(
      "article",
      { class: "card help-section", id: "questions" },
      h("h2", {}, t("help.faqTitle")),
      h(
        "dl",
        { class: "help-faq" },
        t("help.faq").flatMap(({ q, a }) => [h("dt", {}, q), h("dd", {}, a)]),
      ),
    ),
    signedIn ? h("p", {}, h("a", { href: "#/home" }, t("common.back"))) : null,
  );
}

// The draw rules, under the steps of the Christmas section (the only one that has them).
function rulesFor(id) {
  if (id !== "tirage") return null;
  return h(
    "div",
    { class: "help-rules" },
    h("h3", {}, t("help.sections.tirage.rulesTitle")),
    h("ul", {}, t("help.sections.tirage.rules").map((rule) => h("li", {}, rule))),
  );
}
