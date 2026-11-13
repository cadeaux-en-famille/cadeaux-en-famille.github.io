// Admin > Tirage automatique (route "#/admin/settings"): date and defaults of the yearly
// automatic draw, the (read-only) status of the email gate, and the pause switch that
// stops every email the site sends.

import { h } from "../../dom.js?v=5d60296";
import { t, errorText } from "../../i18n.js?v=5d60296";
import { select, update, rpc } from "../../api.js?v=5d60296";
import { field, statusLine, whileBusy, parseAmount, formatDate, confirmButton } from "../../ui.js?v=5d60296";
import { requireAdmin, adminShell } from "./common.js?v=5d60296";

// Message to show once the screen is redrawn after pausing or resuming the emails.
let flash = null;

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

export async function renderAdminSettings({ navigate }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [[settings], waiting] = await Promise.all([select("settings", "select=*"), rpc("waiting_emails")]);
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

  // ---- Pause switch ---------------------------------------------------------
  const sendingStatus = statusLine();
  if (flash) {
    sendingStatus.show(flash, "success");
    flash = null;
  }
  const setPaused = (paused, cancelWaiting = false) => async () => {
    try {
      const cancelled = await rpc("set_emails_paused", { p_paused: paused, p_cancel_waiting: cancelWaiting });
      flash = paused
        ? t("admin.settings.pausedDone")
        : cancelled > 0
          ? t("admin.settings.cancelled", { count: cancelled })
          : t("admin.settings.resumedDone");
      // Redraws the screen (and the banner), back on this section, with the message.
      navigate("/admin/settings?to=sending");
    } catch (error) {
      sendingStatus.show(errorText(error), "error");
    }
  };
  const sending = settings.emails_paused
    ? h(
        "div",
        { class: "card gate gate-closed" },
        h("p", {}, t("admin.settings.paused", { date: formatDate(settings.emails_paused_at), count: waiting })),
        h(
          "div",
          { class: "button-row" },
          confirmButton({
            label: t("admin.settings.resume"),
            confirmLabel: t("admin.settings.resumeConfirm"),
            className: "button-primary",
            onConfirm: setPaused(false),
          }),
          waiting > 0
            ? confirmButton({
                label: t("admin.settings.resumeCancel"),
                confirmLabel: t("admin.settings.resumeCancelConfirm", { count: waiting }),
                className: "button-secondary",
                onConfirm: setPaused(false, true),
              })
            : null,
        ),
        sendingStatus.element,
      )
    : h(
        "div",
        { class: "card gate gate-open" },
        h("p", {}, t("admin.settings.sendingOn", { count: waiting })),
        confirmButton({
          label: t("admin.settings.pause"),
          confirmLabel: t("admin.settings.pauseConfirm"),
          className: "button-secondary",
          onConfirm: setPaused(true),
        }),
        sendingStatus.element,
      );

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
    h("h2", { class: "section-title", id: "sending" }, t("admin.settings.sendingTitle")),
    sending,
    h("p", { class: "field-hint" }, t("admin.settings.pauseHint")),
  );
}
