// Public welcome screen (route "#/"): generic text and the two-step sign-in.
//   Step 1: the member types their email, Supabase emails a 6-digit code.
//   Step 2: the member types the code and is signed in.
// The screen never says whether an address belongs to the family: the same message
// is shown for known and unknown addresses.

import { h } from "../dom.js?v=0b95232";
import { t, errorText } from "../i18n.js?v=0b95232";
import { isConfigured, sendCode, verifyCode } from "../api.js?v=0b95232";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;
const RESEND_DELAY_SECONDS = 60;

// Auth error keys that must look like a success (unknown address).
const SILENT_ERRORS = new Set(["otp_disabled", "user_not_found", "signup_disabled", "email_address_not_authorized"]);

export function renderWelcome({ navigate }) {
  const formSlot = h("div");
  let email = "";
  let resendTimer = null;

  showEmailStep();

  // ---- Step 1: email ------------------------------------------------------
  function showEmailStep() {
    stopTimer();
    const message = h("p", { class: "form-message", role: "status" });
    const input = h("input", {
      id: "email",
      name: "email",
      type: "email",
      autocomplete: "email",
      inputmode: "email",
      required: true,
      value: email,
      placeholder: t("welcome.emailPlaceholder"),
    });
    const button = h("button", { type: "submit", class: "button-primary" }, t("welcome.submit"));

    const form = h(
      "form",
      { class: "card sign-in", novalidate: true, onsubmit: submit },
      h("label", { for: "email" }, t("welcome.emailLabel")),
      input,
      button,
      message,
    );
    formSlot.replaceChildren(form);

    async function submit(event) {
      event.preventDefault();
      email = input.value.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email)) {
        showMessage(message, t("welcome.invalidEmail"), "error");
        input.focus();
        return;
      }
      if (!isConfigured()) {
        showMessage(message, t("welcome.notReady"), "info");
        return;
      }
      setBusy(button, true, t("welcome.sending"));
      try {
        await requestCode();
        showCodeStep();
      } catch (error) {
        showMessage(message, errorText(error), "error");
      } finally {
        setBusy(button, false, t("welcome.submit"));
      }
    }
  }

  // ---- Step 2: code -------------------------------------------------------
  function showCodeStep(notice) {
    const message = h("p", { class: "form-message", role: "status" });
    const input = h("input", {
      id: "code",
      name: "code",
      type: "text",
      inputmode: "numeric",
      autocomplete: "one-time-code",
      pattern: "[0-9]{6}",
      required: true,
      class: "code-input",
    });
    const button = h("button", { type: "submit", class: "button-primary" }, t("welcome.codeSubmit"));
    const resend = h("button", { type: "button", class: "button-link", onclick: resendCode });
    const change = h("button", { type: "button", class: "button-link", onclick: showEmailStep }, t("welcome.changeEmail"));

    const form = h(
      "form",
      { class: "card sign-in", novalidate: true, onsubmit: submit },
      h("p", { class: "code-sent" }, t("welcome.codeSent", { email })),
      h("label", { for: "code" }, t("welcome.codeLabel")),
      input,
      button,
      message,
      h("div", { class: "form-links" }, resend, change),
    );
    formSlot.replaceChildren(form);
    if (notice) showMessage(message, notice, "info");
    input.focus();
    startTimer(resend);

    // Digits only, and sign in automatically once 6 digits are typed or pasted.
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 6);
      if (CODE_PATTERN.test(input.value)) form.requestSubmit();
    });

    async function submit(event) {
      event.preventDefault();
      const code = input.value.trim();
      if (!CODE_PATTERN.test(code)) {
        showMessage(message, t("welcome.invalidCode"), "error");
        input.focus();
        return;
      }
      setBusy(button, true, t("welcome.checking"));
      try {
        await verifyCode(email, code);
        stopTimer();
        navigate("/home");
      } catch (error) {
        showMessage(message, errorText(error), "error");
        input.select();
        setBusy(button, false, t("welcome.codeSubmit"));
      }
    }

    async function resendCode() {
      resend.disabled = true;
      try {
        await requestCode();
        showMessage(message, t("welcome.resent"), "info");
      } catch (error) {
        showMessage(message, errorText(error), "error");
      }
      startTimer(resend);
    }
  }

  // ---- Helpers ------------------------------------------------------------
  async function requestCode() {
    try {
      await sendCode(email);
    } catch (error) {
      if (!SILENT_ERRORS.has(error.key)) throw error;
    }
  }

  function startTimer(button) {
    stopTimer();
    let remaining = RESEND_DELAY_SECONDS;
    const tick = () => {
      if (remaining <= 0) {
        stopTimer();
        button.disabled = false;
        button.textContent = t("welcome.resend");
        return;
      }
      button.disabled = true;
      button.textContent = t("welcome.resendIn", { seconds: remaining });
      remaining -= 1;
    };
    tick();
    resendTimer = setInterval(tick, 1000);
  }

  function stopTimer() {
    if (resendTimer) clearInterval(resendTimer);
    resendTimer = null;
  }

  return h(
    "section",
    { class: "welcome" },
    h("h1", {}, t("welcome.title")),
    h("p", { class: "lead" }, t("welcome.intro")),
    formSlot,
    h(
      "div",
      { class: "how" },
      h("h2", {}, t("welcome.howTitle")),
      h("ol", {}, t("welcome.steps").map((step) => h("li", {}, step))),
    ),
    h("p", { class: "privacy" }, t("welcome.privacy")),
  );
}

function showMessage(element, text, kind) {
  element.textContent = text;
  element.dataset.kind = kind;
}

function setBusy(button, busy, label) {
  button.disabled = busy;
  button.textContent = label;
}
