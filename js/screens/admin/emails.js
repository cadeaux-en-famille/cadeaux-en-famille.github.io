// Admin > Modèles d'emails (route "#/admin/emails"): edit the subject and text of each
// notification email, with a live preview. Until the admin saves a version, the default
// texts of i18n/fr.js (emailDefaults) are used.
// Templates only accept the variables below: none of them gives access to draw results.

import { h } from "../../dom.js?v=adc93c1";
import { t, errorText } from "../../i18n.js?v=adc93c1";
import { select, insert, update, remove, rpc } from "../../api.js?v=adc93c1";
import { field, statusLine, whileBusy, confirmButton } from "../../ui.js?v=adc93c1";
import { requireAdmin, adminShell } from "./common.js?v=adc93c1";
import { TEMPLATE_VARIABLES, renderTemplate } from "../../email-template.js?v=adc93c1";


export async function renderAdminEmails() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [kinds, templates] = await Promise.all([
    select("notification_kinds", "select=kind&order=sort_order"),
    select("email_templates", "select=*&event_id=is.null"),
  ]);
  const saved = new Map(templates.map((tpl) => [tpl.kind, tpl]));
  const sample = t("admin.emails.sample");
  const status = statusLine();

  const kind = field({
    label: t("admin.emails.kind"),
    kind: "select",
    value: kinds[0]?.kind,
    options: kinds.map(({ kind: k }) => ({ value: k, label: t(`notifications.${k}.label`) })),
  });
  const origin = h("p", { class: "field-hint" });
  const subject = field({ label: t("admin.emails.subject"), maxlength: 200 });
  const body = field({ label: t("admin.emails.body"), kind: "textarea", rows: 10, maxlength: 10000 });
  const previewSubject = h("p", { class: "preview-subject" });
  const previewBody = h("div", { class: "preview-body" });
  const submit = h("button", { type: "submit", class: "button-primary" }, t("admin.emails.save"));
  const testButton = h("button", { type: "button", class: "button-secondary", onclick: sendTest }, t("admin.emails.test"));
  const resetButton = confirmButton({
    label: t("admin.emails.reset"),
    confirmLabel: t("myList.deleteConfirm"),
    className: "button-link",
    onConfirm: resetToDefault,
  });

  function load() {
    const current = saved.get(kind.input.value);
    const defaults = t(`emailDefaults.${kind.input.value}`);
    subject.input.value = current?.subject ?? defaults.subject;
    body.input.value = current?.body ?? defaults.body;
    origin.textContent = t(current ? "admin.emails.custom" : "admin.emails.default");
    resetButton.hidden = !current;
    status.clear();
    refreshPreview();
  }

  function refreshPreview() {
    previewSubject.textContent = renderTemplate(subject.input.value, sample);
    // Text only (never HTML): each paragraph becomes a <p>.
    previewBody.replaceChildren(
      ...renderTemplate(body.input.value, sample).split(/\n{2,}/).map((paragraph) => h("p", {}, paragraph)),
    );
  }

  async function save(event) {
    event.preventDefault();
    const values = { subject: subject.input.value.trim(), body: body.input.value.trim() };
    if (!values.subject || !values.body) {
      status.show(t("admin.emails.required"), "error");
      return;
    }
    try {
      await whileBusy(submit, t("common.saving"), async () => {
        const current = saved.get(kind.input.value);
        const row = current
          ? (await update("email_templates", `id=eq.${current.id}`, values))[0]
          : await insert("email_templates", { kind: kind.input.value, ...values });
        saved.set(row.kind, row);
      });
      load();
      status.show(t("admin.emails.saved"), "success");
    } catch (error) {
      status.show(errorText(error), "error");
    }
  }

  // Queues the previewed email (sample values) to the admin; the Send emails workflow
  // delivers it within the hour, or at once when run by hand.
  async function sendTest() {
    try {
      await whileBusy(testButton, t("common.saving"), () =>
        rpc("send_test_email", {
          p_kind: kind.input.value,
          p_subject: renderTemplate(subject.input.value, sample),
          p_body: renderTemplate(body.input.value, sample),
        }),
      );
      status.show(t("admin.emails.testQueued"), "success");
    } catch (error) {
      status.show(errorText(error), "error");
    }
  }

  async function resetToDefault() {
    const current = saved.get(kind.input.value);
    try {
      if (current) await remove("email_templates", `id=eq.${current.id}`);
      saved.delete(kind.input.value);
      load();
      status.show(t("admin.emails.resetDone"), "success");
    } catch (error) {
      status.show(errorText(error), "error");
    }
  }

  kind.input.addEventListener("change", load);
  subject.input.addEventListener("input", refreshPreview);
  body.input.addEventListener("input", refreshPreview);

  const form = h(
    "form",
    { class: "card", novalidate: true, onsubmit: save },
    kind.element,
    origin,
    subject.element,
    body.element,
    h(
      "p",
      { class: "field-hint" },
      t("admin.emails.variables"),
      " ",
      TEMPLATE_VARIABLES.map((name) => h("code", {}, `{${name}}`)),
    ),
    submit,
    h("div", { class: "button-row" }, testButton, resetButton),
    status.element,
  );
  load();

  return adminShell(
    "/admin/emails",
    h("p", { class: "lead" }, t("admin.emails.intro")),
    form,
    h("h2", { class: "section-title" }, t("admin.emails.preview")),
    h("div", { class: "card email-preview" }, previewSubject, previewBody),
  );
}
