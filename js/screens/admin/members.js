// Admin > Membres (route "#/admin/members"): household and active flag of each member.
// Adding members and email addresses is done by the "Import members" workflow,
// so no email address ever reaches the site.

import { h } from "../../dom.js?v=0b95232";
import { t, errorText } from "../../i18n.js?v=0b95232";
import { select, update } from "../../api.js?v=0b95232";
import { statusLine } from "../../ui.js?v=0b95232";
import { requireAdmin, adminShell } from "./common.js?v=0b95232";

export async function renderAdminMembers() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [members, households] = await Promise.all([
    select("members", "select=id,display_name,household_id,is_active,is_admin,user_id&order=display_name"),
    select("households", "select=id,label&order=label"),
  ]);
  const status = statusLine();

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
  );
}
