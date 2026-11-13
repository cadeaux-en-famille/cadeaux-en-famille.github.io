// Tiny translation helper. The site is French only, but keeping every text in
// one dictionary (i18n/fr.js) keeps the code in English and the texts easy to edit.

import { fr } from "./i18n/fr.js?v=6c60e8a";

/**
 * Returns the text for a dotted key, e.g. t("welcome.title").
 * Placeholders such as {email} are replaced from `vars`: t("welcome.codeSent", { email }).
 * Unknown keys return the key itself so a missing text is visible, not silent.
 * (PowerShell analogy: like reading $dict.welcome.title on a nested hashtable.)
 */
export function t(key, vars) {
  const value = lookup(key);
  if (value === undefined) {
    console.warn(`Missing text for key "${key}"`);
    return key;
  }
  if (!vars || typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

/** French message for an ApiError (or any error), falling back to a generic text. */
export function errorText(error) {
  const key = error?.key;
  if (key && lookup(`errors.${key}`) !== undefined) return lookup(`errors.${key}`);
  if (error?.status === 429) return lookup("errors.rate_limited");
  // Unknown error: show its technical code so it can be reported and diagnosed.
  if (key) return t("errors.genericWithCode", { code: `${key}${error.status ? ` / ${error.status}` : ""}` });
  return lookup("errors.generic");
}

/** Fills every element carrying a data-i18n="key" attribute inside root. */
export function applyTranslations(root = document) {
  for (const element of root.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
}

function lookup(key) {
  return key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), fr);
}
