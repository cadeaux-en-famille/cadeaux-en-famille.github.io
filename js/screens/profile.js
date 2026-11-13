// "Mon profil" (route "#/profile"): display name and notification preferences.
// Each preference is saved as soon as its box is ticked or unticked.

import { h } from "../dom.js?v=6c60e8a";
import { t, errorText } from "../i18n.js?v=6c60e8a";
import { getMe, select, update, signOut } from "../api.js?v=6c60e8a";
import { field, statusLine, whileBusy } from "../ui.js?v=6c60e8a";
import { renderNotMember } from "./not-member.js?v=6c60e8a";

export async function renderProfile({ navigate }) {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [kinds, preferences] = await Promise.all([
    select("notification_kinds", "select=kind&user_configurable=is.true&order=sort_order"),
    select("notification_preferences", `select=kind,in_app,by_email&member_id=eq.${me.id}`),
  ]);
  const byKind = new Map(preferences.map((p) => [p.kind, p]));

  // ---- Display name -------------------------------------------------------
  const nameStatus = statusLine();
  const name = field({
    label: t("profile.nameLabel"),
    hint: t("profile.nameHint"),
    value: me.display_name,
    required: true,
    maxlength: 40,
    autocomplete: "given-name",
  });
  const nameButton = h("button", { type: "submit", class: "button-primary" }, t("profile.nameSave"));
  const nameForm = h(
    "form",
    { class: "card", novalidate: true, onsubmit: saveName },
    name.element,
    nameButton,
    nameStatus.element,
  );

  async function saveName(event) {
    event.preventDefault();
    const value = name.input.value.trim();
    if (value.length < 1 || value.length > 40) {
      nameStatus.show(t("profile.nameInvalid"), "error");
      name.input.focus();
      return;
    }
    try {
      await whileBusy(nameButton, t("common.saving"), () =>
        update("members", `id=eq.${me.id}`, { display_name: value }),
      );
      await getMe({ refresh: true });
      nameStatus.show(t("profile.nameSaved"), "success");
    } catch (error) {
      nameStatus.show(errorText(error), "error");
    }
  }

  // ---- Notification preferences -------------------------------------------
  const prefsStatus = statusLine();
  const rows = kinds
    .filter(({ kind }) => byKind.has(kind))
    .map(({ kind }) => {
      const preference = byKind.get(kind);
      return h(
        "tr",
        {},
        h(
          "th",
          { scope: "row" },
          h("span", { class: "pref-label" }, t(`notifications.${kind}.label`)),
          h("span", { class: "pref-hint" }, t(`notifications.${kind}.hint`)),
        ),
        h("td", {}, toggle(kind, "in_app", preference)),
        h("td", {}, toggle(kind, "by_email", preference)),
      );
    });

  function toggle(kind, column, preference) {
    const label = `${t(`notifications.${kind}.label`)} : ${t(`profile.${column === "in_app" ? "inApp" : "byEmail"}`)}`;
    const box = h("input", { type: "checkbox", "aria-label": label, checked: preference[column] });
    box.addEventListener("change", async () => {
      box.disabled = true;
      try {
        await update(
          "notification_preferences",
          `member_id=eq.${me.id}&kind=eq.${kind}`,
          { [column]: box.checked },
        );
        preference[column] = box.checked;
        prefsStatus.show(t("profile.prefsSaved"), "success");
      } catch (error) {
        box.checked = preference[column];
        prefsStatus.show(errorText(error), "error");
      } finally {
        box.disabled = false;
      }
    });
    return h("label", { class: "toggle" }, box);
  }

  const prefsTable = h(
    "table",
    { class: "prefs" },
    h(
      "thead",
      {},
      h(
        "tr",
        {},
        h("th", { scope: "col" }, t("profile.prefsColumn")),
        h("th", { scope: "col" }, t("profile.inApp")),
        h("th", { scope: "col" }, t("profile.byEmail")),
      ),
    ),
    h("tbody", {}, rows),
  );

  return h(
    "section",
    { class: "profile" },
    h("h1", {}, t("profile.title")),
    nameForm,
    h("h2", { class: "section-title" }, t("profile.prefsTitle")),
    h("p", { class: "lead" }, t("profile.prefsIntro")),
    h("div", { class: "card prefs-card" }, prefsTable, prefsStatus.element),
    h("p", { class: "field-hint" }, t("profile.signInNote")),
    h("h2", { class: "section-title" }, t("profile.signOutTitle")),
    h(
      "button",
      {
        type: "button",
        class: "button-secondary",
        onclick: async () => {
          await signOut();
          navigate("/");
        },
      },
      t("common.signOut"),
    ),
  );
}
