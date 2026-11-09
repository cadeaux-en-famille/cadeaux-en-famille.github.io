// Admin > Membres (route "#/admin/members"): household and active flag of each member,
// and letting members into the site one by one before it is opened to everybody.
// Adding members and email addresses is done by the "Import members" workflow,
// so no email address ever reaches the site.

import { h } from "../../dom.js?v=d8be852";
import { t, errorText } from "../../i18n.js?v=d8be852";
import { select, update, rpc } from "../../api.js?v=d8be852";
import { statusLine, confirmButton, formatDate } from "../../ui.js?v=d8be852";
import { requireAdmin, adminShell } from "./common.js?v=d8be852";

export async function renderAdminMembers() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [members, households, settings] = await Promise.all([
    select("members", "select=id,display_name,household_id,is_active,is_admin,user_id,invited_at"),
    select("households", "select=id,label&order=label"),
    select("settings", "select=emails_enabled"),
  ]);
  const openToEverybody = settings[0]?.emails_enabled === true;
  const status = statusLine();

  // Couples first, in household order (1, 2, 10), then by name; members without a
  // household last. The prefix is a letter, not a digit: with numeric collation "01"
  // and "1" compare equal, which would mix the two groups.
  const householdLabel = new Map(households.map((hh) => [hh.id, hh.label]));
  const sortKey = (member) => [
    member.household_id ? `A${householdLabel.get(member.household_id) ?? ""}` : "Z",
    member.display_name,
  ].join("\u0000");
  members.sort((a, b) => sortKey(a).localeCompare(sortKey(b), "fr", { numeric: true }));

  const rows = members.map((member) => {
    const householdSelect = h(
      "select",
      { "aria-label": `${t("admin.members.household")} : ${member.display_name}` },
      h("option", { value: "", selected: !member.household_id }, t("admin.members.noHousehold")),
      households.map((hh) => h("option", { value: hh.id, selected: hh.id === member.household_id }, hh.label)),
    );
    const activeBox = h("input", {
      type: "checkbox",
      checked: member.is_active,
      disabled: member.is_admin,   // the admin cannot deactivate himself
      "aria-label": `${t("admin.members.active")} : ${member.display_name}`,
    });

    householdSelect.addEventListener("change", () =>
      save({ household_id: householdSelect.value || null }, () => {
        householdSelect.value = member.household_id ?? "";
      }),
    );
    activeBox.addEventListener("change", () =>
      save({ is_active: activeBox.checked }, () => {
        activeBox.checked = member.is_active;
      }),
    );

    async function save(values, undo) {
      try {
        const [saved] = await update("members", `id=eq.${member.id}`, values);
        Object.assign(member, saved);
        status.show(t("admin.members.saved"), "success");
      } catch (error) {
        undo();
        status.show(errorText(error), "error");
      }
    }

    // Letting one member in: the site stamps them, then the "Send emails" workflow
    // creates their sign-in account and sends their invitation.
    const letIn = confirmButton({
      label: t("admin.members.invite"),
      confirmLabel: t("admin.members.inviteConfirm", { name: member.display_name }),
      className: "button-link small",
      onConfirm: async () => {
        try {
          await rpc("invite_member", { p_member_id: member.id });
          status.show(t("admin.members.invited", { name: member.display_name }), "success");
          letIn.hidden = true;
        } catch (error) {
          status.show(errorText(error), "error");
        }
      },
    });

    const canResend = member.user_id && member.is_active && (openToEverybody || member.invited_at);
    const resend = confirmButton({
      label: t("admin.members.resend"),
      confirmLabel: t("admin.members.resendConfirm"),
      className: "button-link small",
      onConfirm: async () => {
        try {
          await rpc("resend_invitation", { p_member_id: member.id });
          status.show(t("admin.members.resent", { name: member.display_name }), "success");
        } catch (error) {
          status.show(errorText(error), "error");
        }
      },
    });

    return h(
      "tr",
      {},
      h(
        "th",
        { scope: "row" },
        member.display_name,
        member.is_admin ? h("span", { class: "pref-hint" }, t("admin.members.admin")) : null,
      ),
      h("td", {}, householdSelect),
      h("td", {}, h("label", { class: "toggle" }, activeBox)),
      h(
        "td",
        { class: member.user_id ? "ok" : "muted" },
        t(member.user_id ? "admin.members.canSignIn" : "admin.members.cannotSignIn"),
        member.invited_at && !openToEverybody
          ? h("span", { class: "pref-hint" }, t("admin.members.invitedOn", { date: formatDate(member.invited_at) }))
          : null,
        canResend ? resend : null,
        !openToEverybody && member.is_active && !member.invited_at ? letIn : null,
      ),
    );
  });

  return adminShell(
    "/admin/members",
    h("p", { class: "lead" }, t("admin.members.intro")),
    status.element,
    h(
      "div",
      { class: "card table-card" },
      h(
        "table",
        { class: "admin-table" },
        h(
          "thead",
          {},
          h(
            "tr",
            {},
            h("th", { scope: "col" }, t("admin.members.name")),
            h("th", { scope: "col" }, t("admin.members.household")),
            h("th", { scope: "col" }, t("admin.members.active")),
            h("th", { scope: "col" }, t("admin.members.signIn")),
          ),
        ),
        h("tbody", {}, rows),
      ),
    ),
    h("p", { class: "field-hint" }, t("admin.members.householdHint")),
    h("p", { class: "field-hint" }, t(openToEverybody ? "admin.members.openHint" : "admin.members.inviteHint")),
  );
}
