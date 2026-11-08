// Public welcome screen (route "#/"): generic text and the sign-in form.
// It shows no family data at all. The real sign-in (email code) arrives in step 4;
// until then the form only validates the address and explains that sign-in is not open yet.

import { h } from "../dom.js";
import { t } from "../i18n.js";

// Deliberately simple check; Supabase performs the real validation later.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function renderWelcome() {
  const message = h("p", { class: "form-message", role: "status" });
  const emailInput = h("input", {
    id: "email",
    name: "email",
    type: "email",
    autocomplete: "email",
    inputmode: "email",
    required: true,
    placeholder: t("welcome.emailPlaceholder"),
  });

  const form = h(
    "form",
    { class: "card sign-in", novalidate: true, onsubmit: handleSubmit },
    h("label", { for: "email" }, t("welcome.emailLabel")),
    emailInput,
    h("button", { type: "submit", class: "button-primary" }, t("welcome.submit")),
    message,
  );

  function handleSubmit(event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!EMAIL_PATTERN.test(email)) {
      showMessage(t("welcome.invalidEmail"), "error");
      emailInput.focus();
      return;
    }
    // Step 4 replaces this with: send the code, then show the code input.
    showMessage(t("welcome.notReady"), "info");
  }

  function showMessage(text, kind) {
    message.textContent = text;
    message.dataset.kind = kind;
  }

  return h(
    "section",
    { class: "welcome" },
    h("h1", {}, t("welcome.title")),
    h("p", { class: "lead" }, t("welcome.intro")),
    form,
    h(
      "div",
      { class: "how" },
      h("h2", {}, t("welcome.howTitle")),
      h("ol", {}, t("welcome.steps").map((step) => h("li", {}, step))),
    ),
    h("p", { class: "privacy" }, t("welcome.privacy")),
  );
}
