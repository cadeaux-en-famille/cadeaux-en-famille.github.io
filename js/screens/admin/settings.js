// Admin > Tirage automatique (route "#/admin/settings"): date and defaults of the yearly
// automatic draw, and the (read-only) status of the email gate.

import { h } from "../../dom.js?v=b3b045e";
import { t, errorText } from "../../i18n.js?v=b3b045e";
import { select, update } from "../../api.js?v=b3b045e";
import { field, statusLine, whileBusy, parseAmount, formatDate } from "../../ui.js?v=b3b045e";
import { requireAdmin, adminShell } from "./common.js?v=b3b045e";

// What the daily "Yearly draw" workflow will do next, in the owner's words.
// Mirrors private.run_annual_draw: nothing before the chosen date, nothing twice
// in the same year.
function nextDrawText(settings, today = new Date()) {
  if (!settings.auto_draw_enabled) return t("admin.settings.nextOff");
  const year = today.getUTCFullYear();
  const handled = settings.last_auto_draw_year === year;
  const due = Date.UTC(year, settings.draw_month - 1, settings.draw_day);
  const startOfToday = Date.UTC(year, today.getUTCMonth(), today.getUTCDate());
  if (!handled && due <= startOfToday) return t("admin.settings.nextDue");
  const next = handled ? Date.UTC(year + 1, settings.draw_month - 1, settings.draw_day) : due;
  return t("admin.settings.next", { date: formatDate(new Date(next).toISOString().slice(0, 10)) });
}

export async function renderAdminSettings() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [settings] = await select("settings", "select=*");
  const status = statusLine();

  const enabled = h("input", { type: "checkbox", id: "auto-draw", checked: settings.auto_draw_enabled });
  const day = field({
    label: t("admin.settings.day"),
    kind: "select",
    value: settings.draw_day,
    options: Array.from({ length: 28 }, (_, i) => ({ value: i + 1, label: String(i + 1) })),
  });
  const month = field({
    label: t("admin.settings.month"),
    kind: "select",
    value: settings.draw_month,
    options: t("admin.settings.months").map((name, i) => ({ value: i + 1, label: name })),
  });
  const budget = field({ label: t("admin.settings.budget"), inputmode: "decimal", value: settings.default_budget_eur });
  const deadline = field({
    label: t("admin.settings.deadlineDays"),
    kind: "number",
    inputmode: "numeric",
    min: 0,
    max: 120,
    value: settings.wishlist_deadline_days,
  });
  const submit = h("button", { type: "submit", class: "button-primary" }, t("admin.settings.save"));

  const form = h(
    "form",
    { class: "card", novalidate: true, onsubmit: save },
    h("label", { class: "check switch", for: "auto-draw" }, enabled, t("admin.settings.enabled")),
    h("div", { class: "field-row" }, day.element, month.element),
    h("div", { class: "field-row" }, budget.element, deadline.element),
    submit,
    status.element,
  );

  async function save(event) {
    event.preventDefault();
    const values = {
      auto_draw_enabled: enabled.checked,
      draw_day: Number(day.input.value),
      draw_month: Number(month.input.value),
      default_budget_eur: parseAmount(budget.input.value),
      wishlist_deadline_days: Number(deadline.input.value),
    };
    const deadlineOk = Number.isInteger(values.wishlist_deadline_days)
      && values.wishlist_deadline_days >= 0 && values.wishlist_deadline_days <= 120;
    if (values.default_budget_eur === null || Number.isNaN(values.default_budget_eur) || !deadlineOk) {
      status.show(t("admin.settings.invalid"), "error");
      return;
    }
    try {
      await whileBusy(submit, t("common.saving"), () => update("settings", "id=eq.true", values));
      status.show(t("admin.settings.saved"), "success");
    } catch (error) {
      status.show(errorText(error), "error");
    }
  }

  const gate = settings.emails_enabled
    ? t("admin.settings.emailsOn", { date: formatDate(settings.emails_enabled_at) })
    : t("admin.settings.emailsOff");

  return adminShell(
    "/admin/settings",
    h("p", { class: "lead" }, t("admin.settings.intro")),
    h("p", { class: "field-hint" }, nextDrawText(settings)),
    settings.last_auto_draw_year
      ? h("p", { class: "field-hint" }, t("admin.settings.lastDone", { year: settings.last_auto_draw_year }))
      : null,
    form,
    h("h2", { class: "section-title" }, t("admin.settings.emailsTitle")),
    h("div", { class: `card gate ${settings.emails_enabled ? "gate-open" : "gate-closed"}` }, h("p", {}, gate)),
  );
}
