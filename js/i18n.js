// Tiny translation helper. The site is French only, but keeping every text in
// one dictionary (i18n/fr.js) keeps the code in English and the texts easy to edit.

import { fr } from "./i18n/fr.js";

/**
 * Returns the text for a dotted key, e.g. t("welcome.title").
 * Unknown keys return the key itself so a missing text is visible, not silent.
 * (PowerShell analogy: like reading $dict.welcome.title on a nested hashtable.)
 */
export function t(key) {
  const value = key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), fr);
  if (value === undefined) {
    console.warn(`Missing text for key "${key}"`);
    return key;
  }
  return value;
}

/** Fills every element carrying a data-i18n="key" attribute inside root. */
export function applyTranslations(root = document) {
  for (const element of root.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
}
