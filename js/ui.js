// Small building blocks shared by the screens: form fields, status messages,
// busy buttons, confirmation questions and French number formatting.

import { h } from "./dom.js?v=71d0cc9";
import { t } from "./i18n.js?v=71d0cc9";

let fieldCounter = 0;

/**
 * A labelled form field. kind: "text" | "textarea" | "url" | "number" | "select".
 * Returns { element, input } so the caller can read input.value.
 */
export function field({ label, kind = "text", value = "", hint, options, required = false, ...attrs }) {
  const id = `field-${++fieldCounter}`;
  let input;
  if (kind === "textarea") {
    input = h("textarea", { id, rows: 3, required, ...attrs }, value ?? "");
  } else if (kind === "select") {
    input = h(
      "select",
      { id, required, ...attrs },
      options.map((option) => h("option", { value: option.value, selected: String(option.value) === String(value) }, option.label)),
    );
  } else {
    input = h("input", { id, type: kind, value: value ?? "", required, ...attrs });
  }
  const hintElement = hint ? h("p", { class: "field-hint", id: `${id}-hint` }, hint) : null;
  if (hintElement) input.setAttribute("aria-describedby", hintElement.id);
  return {
    element: h("div", { class: "field" }, h("label", { for: id }, label), input, hintElement),
    input,
  };
}

/** A status line under a form; message(el).show(text, "error" | "info" | "success"). */
export function statusLine() {
  const element = h("p", { class: "form-message", role: "status" });
  return {
    element,
    show(text, kind = "info") {
      element.textContent = text;
      element.dataset.kind = kind;
    },
    clear() {
      element.textContent = "";
      delete element.dataset.kind;
    },
  };
}

/** Disables a button and shows a temporary label while `task` runs. */
export async function whileBusy(button, busyLabel, task) {
  const label = button.textContent;
  button.disabled = true;
  button.textContent = busyLabel;
  try {
    return await task();
  } finally {
    button.disabled = false;
    button.textContent = label;
  }
}

/**
 * A button for an action worth a second thought. The first tap does nothing yet: it
 * opens, right under the button, a question with two plain answers, « confirmLabel »
 * and « Annuler ». Nothing happens until the first one is tapped, and the question stays
 * until answered (no timer).
 *
 * The first members did not understand the former version, which only relabelled the
 * button for five seconds and wanted a second tap on it.
 *
 *   question:   the question shown (a string, or a function called when it opens, for a
 *               question naming what is selected); "Vous confirmez ?" by default.
 *   confirmLabel: the answer that acts ("Oui, lancer"); a string or a function.
 *   beforeAsk:  optional; return false to not open (after showing why, e.g. an empty choice).
 *
 * Returns an element holding the button and its question: put it where the button goes
 * (setting .hidden on it hides both).
 */
export function confirmButton({ label, confirmLabel, question, onConfirm, beforeAsk, className = "button-link danger" }) {
  const value = (text) => (typeof text === "function" ? text() : text);
  const danger = className.includes("danger");
  const button = h("button", { type: "button", class: className, "aria-expanded": "false" }, label);
  const questionText = h("p", { class: "confirm-question" });
  const yes = h("button", { type: "button", class: danger ? "button-primary danger-fill" : "button-primary" });
  const no = h("button", { type: "button", class: "button-link" }, t("common.cancel"));
  const box = h("div", { class: "confirm-box", role: "group", hidden: true }, questionText, h("div", { class: "button-row" }, yes, no));
  const wrapper = h("span", { class: "confirm" }, button, box);

  const close = () => {
    box.hidden = true;
    button.hidden = false;
    button.setAttribute("aria-expanded", "false");
  };
  button.addEventListener("click", () => {
    if (beforeAsk && beforeAsk() === false) return;
    questionText.textContent = value(question) ?? t("common.confirmQuestion");
    yes.textContent = value(confirmLabel);
    button.hidden = true;
    button.setAttribute("aria-expanded", "true");
    box.hidden = false;
    yes.focus();
  });
  no.addEventListener("click", () => {
    close();
    button.focus();
  });
  yes.addEventListener("click", async () => {
    yes.disabled = true;
    no.disabled = true;
    try {
      await onConfirm();
    } finally {
      yes.disabled = false;
      no.disabled = false;
      if (wrapper.isConnected) close();
    }
  });
  return wrapper;
}

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** 25 -> "25,00 €" */
export function formatEuro(value) {
  return value === null || value === undefined ? "" : euro.format(Number(value));
}

/** "12,5" or "12.5" -> 12.5; "" -> null; invalid -> NaN. */
export function parseAmount(text) {
  const cleaned = String(text ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (cleaned === "") return null;
  return /^\d+(\.\d{1,2})?$/.test(cleaned) ? Number(cleaned) : Number.NaN;
}

/** "www.shop.fr/x" -> "https://www.shop.fr/x"; "" -> null. */
export function normaliseUrl(text) {
  const value = String(text ?? "").trim();
  if (value === "") return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/** Empty or blank text -> null (stored as "no value" in the database). */
export function textOrNull(text) {
  const value = String(text ?? "").trim();
  return value === "" ? null : value;
}

const longDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "2026-12-25" (or an ISO timestamp) -> "25 décembre 2026"; empty -> "". */
export function formatDate(value) {
  if (!value) return "";
  const date = new Date(String(value).length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? "" : longDate.format(date);
}

/** Adds days to a "YYYY-MM-DD" date and returns "YYYY-MM-DD". */
export function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const dateTime = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** ISO timestamp -> "8 nov., 21:45" in the member's time zone. */
export function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateTime.format(date);
}

const dayAndMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });

/** Birthday (14, 7) -> "14 juillet" (year 2000: 29 February exists). */
export function formatBirthday(day, month) {
  return day && month ? dayAndMonth.format(new Date(Date.UTC(2000, month - 1, day))) : "";
}
