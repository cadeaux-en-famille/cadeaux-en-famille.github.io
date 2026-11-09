// Small building blocks shared by the screens: form fields, status messages,
// busy buttons, two-step confirmation and French number formatting.

import { h } from "./dom.js?v=b3b045e";

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
 * A button that asks for confirmation in place (no browser dialog): first click shows
 * "confirmLabel", second click within 5 seconds runs onConfirm.
 */
export function confirmButton({ label, confirmLabel, onConfirm, className = "button-link danger" }) {
  let armed = false;
  let timer = null;
  const button = h("button", { type: "button", class: className }, label);
  button.addEventListener("click", async () => {
    if (!armed) {
      armed = true;
      button.textContent = confirmLabel;
      button.classList.add("armed");
      timer = setTimeout(reset, 5000);
      return;
    }
    clearTimeout(timer);
    reset();
    await onConfirm();
  });
  function reset() {
    armed = false;
    button.textContent = label;
    button.classList.remove("armed");
  }
  return button;
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
