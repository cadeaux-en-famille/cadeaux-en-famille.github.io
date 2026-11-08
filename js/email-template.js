// Email template rendering, shared by the admin screen (preview) and by
// scripts/send-emails.mjs (real emails), so both always render the same way.
// Pure module: no DOM, no network.

/** Variables an email template may use. None of them gives access to draw results. */
export const TEMPLATE_VARIABLES = ["prenom", "evenement", "budget", "date", "date_limite", "lien", "resume"];

/** Replaces {variable} placeholders; unknown ones are left untouched. */
export function renderTemplate(text, values) {
  return String(text).replace(/\{(\w+)\}/g, (match, name) =>
    TEMPLATE_VARIABLES.includes(name) && name in values ? String(values[name] ?? "") : match,
  );
}
