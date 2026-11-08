// Admin > Tirage automatique (route "#/admin/settings"): date and defaults of the yearly
// automatic draw, and the (read-only) status of the email gate.

import { h } from "../../dom.js";
import { t, errorText } from "../../i18n.js";
import { select, update } from "../../api.js";
import { field, statusLine, whileBusy, parseAmount, formatDate } from "../../ui.js";
import { requireAdmin, adminShell } from "./common.js";

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
    form,
    h("h2", { class: "section-title" }, t("admin.settings.emailsTitle")),
    h("div", { class: `card gate ${settings.emails_enabled ? "gate-open" : "gate-closed"}` }, h("p", {}, gate)),
  );
}
