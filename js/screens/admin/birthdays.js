// Admin > Anniversaires (route "#/admin/birthdays"): the defaults of every birthday (the
// indicative contribution, how long before it opens by itself, the members concerned:
// their birthday opens by itself and they take part in the others'), and the birthdays
// being prepared or past: change their date or contribution, cancel one, open its page to choose the
// participants. The database hides the administrator's own birthday and his partner's.

import { h, fill } from "../../dom.js?v=7d6d5f9";
import { t, errorText } from "../../i18n.js?v=7d6d5f9";
import { select, update, remove } from "../../api.js?v=7d6d5f9";
import { field, statusLine, whileBusy, confirmButton, formatEuro, formatDate, parseAmount } from "../../ui.js?v=7d6d5f9";
import { requireAdmin, adminShell } from "./common.js?v=7d6d5f9";

let flash = null;

const MAX_MONTHS = 6;
const MAX_WEEKS = 26;

export async function renderAdminBirthdays({ navigate }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [[settings], members, events, participants] = await Promise.all([
    select("settings", "select=birthday_contribution_eur,birthday_open_amount,birthday_open_unit"),
    select("members", "select=id,display_name,is_active,in_birthdays,birthday_day&is_active=is.true&order=display_name"),
    select("events", "select=*&kind=eq.birthday&order=event_date.desc"),
    select("participants", "select=event_id,member_id"),
  ]);
  const names = new Map(members.map((m) => [m.id, m.display_name]));
  const status = statusLine();
  if (flash) {
    status.show(flash, "success");
    flash = null;
  }
  const done = (message) => {
    flash = message;
    navigate("/admin/birthdays");
  };

  // ---- Defaults --------------------------------------------------------------
  const contribution = field({
    label: t("admin.birthdays.contribution"),
    inputmode: "decimal",
    value: settings?.birthday_contribution_eur ?? 25,
    hint: t("admin.birthdays.contributionHint"),
  });
  // How long before the birthday it opens by itself: 1 to 6 months, or 1 to 26 weeks
  // (the database checks the same limits).
  const openAmount = field({
    label: t("admin.birthdays.openAmount"),
    inputmode: "numeric",
    value: settings?.birthday_open_amount ?? 2,
    maxlength: 2,
  });
  const openUnit = field({
    label: t("admin.birthdays.openUnit"),
    kind: "select",
    value: settings?.birthday_open_unit ?? "months",
    options: [
      { value: "weeks", label: t("admin.birthdays.weeks") },
      { value: "months", label: t("admin.birthdays.months") },
    ],
  });
  const boxes = members.map((m) => ({ member: m, box: h("input", { type: "checkbox", checked: m.in_birthdays, value: m.id }) }));
  const submit = h("button", { type: "submit", class: "button-primary" }, t("admin.birthdays.save"));
  const defaults = h(
    "form",
    {
      class: "card",
      novalidate: true,
      onsubmit: async (e) => {
        e.preventDefault();
        const amount = parseAmount(contribution.input.value);
        if (amount === null || Number.isNaN(amount)) {
          status.show(t("admin.birthdays.invalidContribution"), "error");
          return;
        }
        const opening = { amount: Number(openAmount.input.value.trim()), unit: openUnit.input.value };
        const maximum = opening.unit === "weeks" ? MAX_WEEKS : MAX_MONTHS;
        if (!Number.isInteger(opening.amount) || opening.amount < 1 || opening.amount > maximum) {
          status.show(t(opening.unit === "weeks" ? "admin.birthdays.invalidWeeks" : "admin.birthdays.invalidMonths"), "error");
          return;
        }
        const ticked = boxes.filter(({ box }) => box.checked).map(({ member }) => member.id);
        const unticked = boxes.filter(({ box }) => !box.checked).map(({ member }) => member.id);
        try {
          await whileBusy(submit, t("common.saving"), async () => {
            await update("settings", "id=eq.true", {
              birthday_contribution_eur: amount,
              birthday_open_amount: opening.amount,
              birthday_open_unit: opening.unit,
            });
            if (ticked.length > 0) await update("members", `id=in.(${ticked.join(",")})`, { in_birthdays: true });
            if (unticked.length > 0) await update("members", `id=in.(${unticked.join(",")})`, { in_birthdays: false });
          });
          done(t("admin.birthdays.saved"));
        } catch (error) {
          status.show(errorText(error), "error");
        }
      },
    },
    contribution.element,
    h(
      "fieldset",
      { class: "opening" },
      h("legend", {}, t("admin.birthdays.opening")),
      h("div", { class: "field-row" }, openAmount.element, openUnit.element),
      h("p", { class: "field-hint" }, t("admin.birthdays.openingHint")),
    ),
    h(
      "fieldset",
      { class: "checklist" },
      h("legend", {}, t("admin.birthdays.defaultParticipants")),
      h("p", { class: "field-hint" }, t("admin.birthdays.defaultParticipantsHint")),
      boxes.map(({ member, box }) => h("label", { class: "check" }, box, member.display_name)),
    ),
    submit,
  );

  const withoutDate = members.filter((m) => !m.birthday_day).map((m) => m.display_name);

  return adminShell(
    "/admin/birthdays",
    h("p", { class: "lead" }, t("admin.birthdays.intro")),
    status.element,
    defaults,
    withoutDate.length > 0
      ? h("p", { class: "field-hint" }, t("admin.birthdays.withoutDate", { names: withoutDate.join(", ") }))
      : null,
    h("h2", { class: "section-title" }, t("admin.birthdays.listTitle")),
    events.length === 0
      ? h("p", { class: "empty" }, t("admin.birthdays.none"))
      : h("div", { class: "event-list" }, events.map((event) => birthdayCard(event, { names, participants, done }))),
    h("p", { class: "field-hint" }, t("admin.birthdays.hiddenHint")),
  );
}

function birthdayCard(event, { names, participants, done }) {
  const card = h("article", { class: "card event" });
  const cardStatus = statusLine();
  const count = participants.filter((p) => p.event_id === event.id).length;
  const open = event.status !== "closed";

  function showView() {
    fill(
      card,
      h(
        "div",
        { class: "event-head" },
        h("h2", {}, event.title),
        h("span", { class: `status status-${event.status}` }, t(`history.birthdayStatus.${event.status}`)),
      ),
      h(
        "ul",
        { class: "event-meta" },
        h("li", {}, t("admin.events.dateLine", { date: formatDate(event.event_date) })),
        h("li", {}, t("admin.birthdays.contributionLine", { amount: formatEuro(event.budget_eur) })),
        h("li", {}, t("admin.birthdays.participantsLine", { count })),
        h("li", {}, event.launched_by
          ? t("admin.birthdays.launchedBy", { name: names.get(event.launched_by) ?? "?" })
          : t("admin.birthdays.automatic")),
      ),
      h(
        "div",
        { class: "button-row" },
        h("a", { class: "button-secondary link-button", href: `#/birthday?id=${event.id}` }, t("admin.birthdays.openPage")),
        open ? h("button", { type: "button", class: "button-secondary", onclick: showEdit }, t("admin.events.edit")) : null,
        open
          ? confirmButton({
              label: t("admin.birthdays.cancel"),
              confirmLabel: t("admin.birthdays.cancelConfirm"),
              onConfirm: async () => {
                try {
                  await remove("events", `id=eq.${event.id}`);
                  done(t("admin.birthdays.cancelled", { title: event.title }));
                } catch (error) {
                  cardStatus.show(errorText(error), "error");
                }
              },
            })
          : null,
      ),
      cardStatus.element,
    );
  }

  function showEdit() {
    const formStatus = statusLine();
    const dateField = field({ label: t("admin.events.date"), kind: "date", value: event.event_date });
    const amountField = field({ label: t("admin.birthdays.contribution"), inputmode: "decimal", value: event.budget_eur });
    const submit = h("button", { type: "submit", class: "button-primary" }, t("admin.events.save"));
    fill(
      card,
      h(
        "form",
        {
          novalidate: true,
          onsubmit: async (e) => {
            e.preventDefault();
            const values = { event_date: dateField.input.value, budget_eur: parseAmount(amountField.input.value) };
            if (!values.event_date) return formStatus.show(t("admin.events.invalidDate"), "error");
            if (values.budget_eur === null || Number.isNaN(values.budget_eur)) {
              return formStatus.show(t("admin.birthdays.invalidContribution"), "error");
            }
            try {
              await whileBusy(submit, t("common.saving"), () => update("events", `id=eq.${event.id}`, values));
              done(t("admin.events.saved"));
            } catch (error) {
              formStatus.show(errorText(error), "error");
            }
            return null;
          },
        },
        h("h2", {}, event.title),
        h("div", { class: "field-row" }, dateField.element, amountField.element),
        h("div", { class: "button-row" }, submit,
          h("button", { type: "button", class: "button-link", onclick: showView }, t("common.cancel"))),
        formStatus.element,
      ),
    );
  }

  showView();
  return card;
}
