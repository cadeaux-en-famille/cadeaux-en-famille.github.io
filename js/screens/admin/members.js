// Admin > Membres (route "#/admin/members"): the family as the site knows it. The
// administrator adds members, changes a name, a household, an address or a birthday,
// takes a member out of the family (never deleted: the history stays) or back in, and
// lets members into the site one by one before it is opened to everybody.
//
// Addresses are readable by the administrator only (public.member_emails). The sign-in
// account follows an address change at the next run of the "Send emails" workflow
// (scripts/sync-accounts.mjs): the site never holds the key needed to change it.
// Every rule (couples, nobody leaving during a draw...) is checked by the database.

import { h, fill } from "../../dom.js?v=2c5d768";
import { t, errorText } from "../../i18n.js?v=2c5d768";
import { select, insert, update, rpc } from "../../api.js?v=2c5d768";
import {
  field, statusLine, confirmButton, whileBusy, formatDate, formatDateTime, formatBirthday, textOrNull,
} from "../../ui.js?v=2c5d768";
import { requireAdmin, adminShell } from "./common.js?v=2c5d768";

const NEW_HOUSEHOLD = "new";

// Message kept across the redraw that follows a change.
let flash = null;

export async function renderAdminMembers({ navigate }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [members, households, emails, settings, invitations] = await Promise.all([
    select(
      "members",
      "select=id,display_name,household_id,is_active,is_admin,user_id,invited_at,birthday_day,birthday_month",
    ),
    select("households", "select=id,label&order=label"),
    select("member_emails", "select=member_id,email"),
    select("settings", "select=emails_enabled"),
    rpc("invitation_status"),
  ]);
  const invitationOf = new Map(invitations.map((row) => [row.member_id, row]));
  const openToEverybody = settings[0]?.emails_enabled === true;
  const emailOf = new Map(emails.map((row) => [row.member_id, row.email]));
  const householdLabel = new Map(households.map((hh) => [hh.id, hh.label]));

  const status = statusLine();
  if (flash) {
    status.show(flash, "success");
    flash = null;
  }
  const done = (message) => {
    flash = message;
    navigate("/admin/members");
  };

  // Couples first, in household order (1, 2, 10), then by name; members without a
  // household after them, and the members who left at the end. The prefixes are letters,
  // not digits: with numeric collation "01" and "1" compare equal.
  const sortKey = (member) => [
    member.is_active ? "A" : "B",
    member.household_id ? `A${householdLabel.get(member.household_id) ?? ""}` : "Z",
    member.display_name,
  ].join("\u0000");
  members.sort((a, b) => sortKey(a).localeCompare(sortKey(b), "fr", { numeric: true }));

  const context = { members, households, emailOf, householdLabel, invitationOf, openToEverybody, status, done };

  const addArea = h("div", { class: "member-add" });
  const addButton = h("button", { type: "button", class: "button-secondary" }, t("admin.members.add"));
  addButton.addEventListener("click", () => {
    fill(addArea, memberForm(context, null, () => fill(addArea, addButton)));
    addArea.querySelector("input")?.focus();
  });
  fill(addArea, addButton);

  return adminShell(
    "/admin/members",
    h("p", { class: "lead" }, t("admin.members.intro")),
    status.element,
    addArea,
    h("ul", { class: "member-list" }, members.map((member) => memberCard(context, member))),
    h("p", { class: "field-hint" }, t("admin.members.householdHint")),
    h("p", { class: "field-hint" }, t("admin.members.emailHint")),
    h("p", { class: "field-hint" }, t(openToEverybody ? "admin.members.openHint" : "admin.members.inviteHint")),
  );
}

// ---------------------------------------------------------------------------
// One member
// ---------------------------------------------------------------------------

function memberCard(context, member) {
  const { emailOf, householdLabel, invitationOf, openToEverybody, status, done } = context;
  const email = emailOf.get(member.id);
  const card = h("li", { class: `card member${member.is_active ? "" : " member-left"}` });

  const details = [
    member.household_id
      ? t("admin.members.inHousehold", { label: householdLabel.get(member.household_id) ?? "?" })
      : t("admin.members.noHouseholdLong"),
    member.birthday_day ? t("admin.members.bornOn", { date: formatBirthday(member.birthday_day, member.birthday_month) }) : null,
  ].filter(Boolean).join(" · ");

  const signIn = !member.is_active
    ? t("admin.members.left")
    : member.user_id
      ? t("admin.members.canSignIn")
      : email && (openToEverybody || member.is_admin || member.invited_at)
        ? t("admin.members.accountSoon")
        : t("admin.members.cannotSignIn");

  // Letting one member in: the site stamps them, then the "Send emails" workflow
  // creates their sign-in account and sends their invitation.
  const letIn = confirmButton({
    label: t("admin.members.invite"),
    confirmLabel: t("admin.members.inviteConfirm", { name: member.display_name }),
    className: "button-link",
    onConfirm: async () => {
      try {
        await rpc("invite_member", { p_member_id: member.id });
        done(t("admin.members.invited", { name: member.display_name }));
      } catch (error) {
        status.show(errorText(error), "error");
      }
    },
  });

  const resend = confirmButton({
    label: t("admin.members.resend"),
    confirmLabel: t("admin.members.resendConfirm"),
    className: "button-link",
    onConfirm: async () => {
      try {
        await rpc("resend_invitation", { p_member_id: member.id });
        status.show(t("admin.members.resent", { name: member.display_name }), "success");
      } catch (error) {
        status.show(errorText(error), "error");
      }
    },
  });

  const leaveOrComeBack = confirmButton({
    label: t(member.is_active ? "admin.members.leave" : "admin.members.comeBack"),
    confirmLabel: t(member.is_active ? "admin.members.leaveConfirm" : "admin.members.comeBackConfirm",
      { name: member.display_name }),
    className: member.is_active ? "button-link danger" : "button-link",
    onConfirm: async () => {
      try {
        const [saved] = await update("members", `id=eq.${member.id}`, { is_active: !member.is_active });
        if (!saved) throw new Error("not saved");
        done(t(member.is_active ? "admin.members.leftDone" : "admin.members.cameBack", { name: member.display_name }));
      } catch (error) {
        status.show(errorText(error), "error");
      }
    },
  });

  const editButton = h("button", { type: "button", class: "button-link" }, t("admin.members.edit"));
  const view = h(
    "div",
    {},
    h(
      "div",
      { class: "member-head" },
      h("h2", {}, member.display_name),
      member.is_admin ? h("span", { class: "badge" }, t("admin.members.admin")) : null,
    ),
    details ? h("p", { class: "member-meta" }, details) : null,
    h("p", { class: "member-meta" }, email ?? t("admin.members.noEmail")),
    member.is_active ? invitationLine(invitationOf.get(member.id)) : null,
    h(
      "p",
      { class: `member-meta ${member.user_id && member.is_active ? "ok" : "muted"}` },
      signIn,
      member.invited_at && !openToEverybody && member.is_active
        ? ` · ${t("admin.members.invitedOn", { date: formatDate(member.invited_at) })}`
        : "",
    ),
    h(
      "div",
      { class: "button-row member-actions" },
      member.is_active ? editButton : null,
      member.user_id && member.is_active && (openToEverybody || member.invited_at) ? resend : null,
      !openToEverybody && member.is_active && !member.invited_at && !member.is_admin ? letIn : null,
      member.is_admin ? null : leaveOrComeBack,
    ),
  );

  editButton.addEventListener("click", () => {
    fill(card, memberForm(context, member, () => fill(card, view)));
    card.querySelector("input")?.focus();
  });
  return fill(card, view);
}

// ---------------------------------------------------------------------------
// The form: adding a member (member = null) or changing one
// ---------------------------------------------------------------------------

function memberForm(context, member, cancel) {
  const { members, households, emailOf, status, done } = context;
  const months = t("common.months");

  const name = field({
    label: t("admin.members.nameLabel"),
    value: member?.display_name ?? "",
    required: true,
    maxlength: 40,
    autocomplete: "off",
  });

  // Each household with who is in it, so the administrator sees which one has room.
  const occupants = (householdId) =>
    members.filter((m) => m.is_active && m.household_id === householdId && m.id !== member?.id)
      .map((m) => m.display_name);
  const household = field({
    label: t("admin.members.household"),
    kind: "select",
    value: member?.household_id ?? "",
    options: [
      { value: "", label: t("admin.members.noHousehold") },
      ...households.map((hh) => {
        const names = occupants(hh.id);
        return {
          value: hh.id,
          label: names.length > 0
            ? t("admin.members.householdWith", { label: hh.label, names: names.join(", ") })
            : t("admin.members.householdEmpty", { label: hh.label }),
        };
      }),
      { value: NEW_HOUSEHOLD, label: t("admin.members.newHousehold") },
    ],
  });

  const email = field({
    label: t("admin.members.emailLabel"),
    kind: "email",
    value: member ? emailOf.get(member.id) ?? "" : "",
    autocomplete: "off",
    hint: member?.user_id ? t("admin.members.emailChangeHint") : null,
  });

  const day = field({
    label: t("admin.members.birthdayDay"),
    kind: "select",
    value: member?.birthday_day ?? "",
    options: [{ value: "", label: "–" }, ...Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))],
  });
  const month = field({
    label: t("admin.members.birthdayMonth"),
    kind: "select",
    value: member?.birthday_month ?? "",
    options: [{ value: "", label: "–" }, ...months.map((label, i) => ({ value: i + 1, label }))],
  });

  const formStatus = statusLine();
  const submit = h("button", { type: "submit", class: "button-primary" },
    t(member ? "admin.members.save" : "admin.members.addSubmit"));
  const cancelButton = h("button", { type: "button", class: "button-link" }, t("common.cancel"));
  cancelButton.addEventListener("click", cancel);

  const form = h(
    "form",
    { class: "member-form", novalidate: true },
    h("h2", {}, member ? t("admin.members.editTitle", { name: member.display_name }) : t("admin.members.addTitle")),
    name.element,
    household.element,
    email.element,
    h("fieldset", { class: "birthday" },
      h("legend", {}, t("admin.members.birthday")),
      h("div", { class: "field-row" }, day.element, month.element),
      h("p", { class: "field-hint" }, t("admin.members.birthdayHint"))),
    formStatus.element,
    h("div", { class: "button-row" }, submit, cancelButton),
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = {
      display_name: name.input.value.trim(),
      email: email.input.value.trim().toLowerCase(),
      birthday_day: day.input.value ? Number(day.input.value) : null,
      birthday_month: month.input.value ? Number(month.input.value) : null,
    };
    const problem = checkValues(values);
    if (problem) {
      formStatus.show(problem, "error");
      return;
    }

    await whileBusy(submit, t("common.saving"), async () => {
      try {
        const householdId = household.input.value === NEW_HOUSEHOLD
          ? (await insert("households", { label: nextHouseholdLabel(households) })).id
          : household.input.value || null;

        if (!member) {
          await rpc("add_member", {
            p_display_name: values.display_name,
            p_household_id: householdId,
            p_email: textOrNull(values.email),
            p_birthday_day: values.birthday_day,
            p_birthday_month: values.birthday_month,
          });
          done(t("admin.members.added", { name: values.display_name }));
          return;
        }

        const [saved] = await update("members", `id=eq.${member.id}`, {
          display_name: values.display_name,
          household_id: householdId,
          birthday_day: values.birthday_day,
          birthday_month: values.birthday_month,
        });
        if (!saved) throw new Error("not saved");
        const emailChanged = values.email !== (emailOf.get(member.id) ?? "");
        if (emailChanged) {
          await rpc("set_member_email", { p_member_id: member.id, p_email: values.email });
        }
        done(t(emailChanged && values.email ? "admin.members.savedWithEmail" : "admin.members.saved",
          { name: values.display_name }));
      } catch (error) {
        formStatus.show(errorText(error), "error");
      }
    });
  });

  status.clear();
  return form;
}

/** French message for the first problem in the form, or null. */
function checkValues(values) {
  if (!values.display_name) return t("admin.members.nameRequired");
  if (values.display_name.length > 40) return t("admin.members.nameTooLong");
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return t("errors.members.invalid_email");
  if ((values.birthday_day === null) !== (values.birthday_month === null)) return t("admin.members.birthdayIncomplete");
  if (values.birthday_day && values.birthday_day > [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][values.birthday_month - 1]) {
    return t("admin.members.birthdayInvalid");
  }
  return null;
}

/** "1", "2"... -> the next number not used yet. */
function nextHouseholdLabel(households) {
  const numbers = households.map((hh) => Number(hh.label)).filter(Number.isInteger);
  let next = Math.max(0, ...numbers) + 1;
  while (households.some((hh) => hh.label === String(next))) next += 1;
  return String(next);
}

/** Where the latest invitation stands (public.invitation_status), or nothing. */
function invitationLine(row) {
  if (!row) return null;
  const parts = [];
  if (row.address_pending) parts.push(t("admin.members.addressPending"));
  if (row.state) {
    parts.push(t(`admin.members.invitation.${row.state}`, { date: formatDateTime(row.at), error: row.error ?? "" }));
  }
  return h("p", { class: `member-meta invitation-${row.state ?? "none"}` }, parts.join(" "));
}
