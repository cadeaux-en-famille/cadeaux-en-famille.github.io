// "Ma liste d'envies" (route "#/my-list"): the member's permanent wish list and tastes.
// Visible only to the member and, while an event runs, to the person who gives to them
// (enforced by RLS in the database, not here).

import { h, fill } from "../dom.js?v=6604111";
import { t, errorText } from "../i18n.js?v=6604111";
import { getMe, select, insert, update, remove, upsert } from "../api.js?v=6604111";
import {
  field, statusLine, whileBusy, confirmButton,
  formatEuro, parseAmount, normaliseUrl, textOrNull,
} from "../ui.js?v=6604111";
import { renderNotMember } from "./not-member.js?v=6604111";

const PRIORITIES = [1, 2, 3];
const PROFILE_FIELDS = ["interests", "sizes", "colors", "dislikes", "favorite_shops"];

export async function renderMyList() {
  const me = await getMe();
  if (!me) return renderNotMember();

  const [wishes, profiles] = await Promise.all([
    select("wishes", `select=*&member_id=eq.${me.id}&order=priority.asc,created_at.asc`),
    select("profiles", `select=*&member_id=eq.${me.id}`),
  ]);

  const status = statusLine();
  const formSlot = h("div");
  const activeList = h("ul", { class: "wish-list" });
  const archivedList = h("ul", { class: "wish-list archived" });
  const archivedCount = h("span");
  const archivedSection = h("details", { class: "archived-section" }, h("summary", {}, archivedCount), archivedList);
  const emptyText = h("p", { class: "empty" }, t("myList.empty"));

  const addButton = h("button", { type: "button", class: "button-primary", onclick: showAddForm }, t("myList.add"));

  const clearButton = confirmButton({
    label: t("myList.clear"),
    confirmLabel: t("myList.clearConfirm"),
    onConfirm: async () => {
      try {
        await remove("wishes", `member_id=eq.${me.id}`);
        wishes.length = 0;
        refresh();
        status.show(t("myList.cleared"), "success");
      } catch (error) {
        status.show(errorText(error), "error");
      }
    },
  });

  refresh();

  // ---- Wish list ----------------------------------------------------------

  function refresh() {
    const active = wishes.filter((w) => !w.archived).sort(byPriority);
    const archived = wishes.filter((w) => w.archived).sort(byPriority);
    activeList.replaceChildren(...active.map(renderWish));
    archivedList.replaceChildren(...archived.map(renderWish));
    emptyText.hidden = active.length > 0;
    archivedSection.hidden = archived.length === 0;
    archivedCount.textContent = t("myList.archivedTitle", { count: archived.length });
    clearButton.hidden = wishes.length === 0;
  }

  function renderWish(wish) {
    const item = h("li", { class: "wish card" });
    showView();
    return item;

    function showView() {
      const meta = [wish.shop, formatEuro(wish.price_eur)].filter(Boolean).join(" · ");
      fill(
        item,
        h(
          "div",
          { class: "wish-head" },
          h("h3", {}, wish.title),
          h("span", { class: `priority priority-${wish.priority}` }, t(`myList.priority${wish.priority}`)),
        ),
        meta ? h("p", { class: "wish-meta" }, meta) : null,
        wish.description ? h("p", { class: "wish-description" }, wish.description) : null,
        wish.url
          ? h("p", {}, h("a", { href: wish.url, target: "_blank", rel: "noopener noreferrer" }, t("myList.openLink")))
          : null,
        h(
          "div",
          { class: "wish-actions" },
          wish.archived
            ? h("button", { type: "button", class: "button-link", onclick: () => setArchived(false) }, t("myList.restore"))
            : h("button", { type: "button", class: "button-link", onclick: showEdit }, t("myList.edit")),
          wish.archived
            ? null
            : h("button", { type: "button", class: "button-link", onclick: () => setArchived(true) }, t("myList.archive")),
          confirmButton({ label: t("myList.delete"), confirmLabel: t("myList.deleteConfirm"), onConfirm: deleteWish }),
        ),
      );
    }

    function showEdit() {
      item.replaceChildren(
        wishForm({
          initial: wish,
          submitLabel: t("myList.save"),
          onCancel: showView,
          onSave: async (values) => {
            const [saved] = await update("wishes", `id=eq.${wish.id}`, values);
            Object.assign(wish, saved);
            refresh();
            status.show(t("myList.saved"), "success");
          },
        }),
      );
      item.querySelector("input")?.focus();
    }

    async function setArchived(archived) {
      try {
        const [saved] = await update("wishes", `id=eq.${wish.id}`, { archived });
        Object.assign(wish, saved);
        refresh();
        status.show(t(archived ? "myList.archived" : "myList.restored"), "success");
      } catch (error) {
        status.show(errorText(error), "error");
      }
    }

    async function deleteWish() {
      try {
        await remove("wishes", `id=eq.${wish.id}`);
        wishes.splice(wishes.indexOf(wish), 1);
        refresh();
        status.show(t("myList.deleted"), "success");
      } catch (error) {
        status.show(errorText(error), "error");
      }
    }
  }

  function showAddForm() {
    addButton.hidden = true;
    formSlot.replaceChildren(
      h(
        "div",
        { class: "card" },
        h("h2", {}, t("myList.addTitle")),
        wishForm({
          initial: { priority: 2 },
          submitLabel: t("myList.addSubmit"),
          onCancel: closeAddForm,
          onSave: async (values) => {
            const saved = await insert("wishes", { ...values, member_id: me.id });
            wishes.push(saved);
            refresh();
            closeAddForm();
            status.show(t("myList.added"), "success");
          },
        }),
      ),
    );
    formSlot.querySelector("input")?.focus();
  }

  function closeAddForm() {
    formSlot.replaceChildren();
    addButton.hidden = false;
  }

  // ---- Tastes (profile) ---------------------------------------------------

  const profile = profiles[0] ?? {};
  const profileStatus = statusLine();
  const profileInputs = {};
  const profileForm = h(
    "form",
    { class: "card", novalidate: true, onsubmit: saveProfile },
    PROFILE_FIELDS.map((name) => {
      const f = field({
        label: t(`myList.profile.${name}`),
        hint: t(`myList.profile.${name}Hint`),
        kind: "textarea",
        value: profile[name] ?? "",
        maxlength: name === "interests" ? 2000 : 1000,
      });
      profileInputs[name] = f.input;
      return f.element;
    }),
    h("button", { type: "submit", class: "button-primary" }, t("myList.profile.save")),
    profileStatus.element,
  );

  async function saveProfile(event) {
    event.preventDefault();
    const button = profileForm.querySelector("button[type=submit]");
    const values = Object.fromEntries(PROFILE_FIELDS.map((name) => [name, textOrNull(profileInputs[name].value)]));
    try {
      await whileBusy(button, t("common.saving"), () => upsert("profiles", { member_id: me.id, ...values }, "member_id"));
      profileStatus.show(t("myList.profile.saved"), "success");
    } catch (error) {
      profileStatus.show(errorText(error), "error");
    }
  }

  return h(
    "section",
    { class: "my-list" },
    h("h1", {}, t("myList.title")),
    h("p", { class: "lead" }, t("myList.intro")),
    status.element,
    addButton,
    formSlot,
    emptyText,
    activeList,
    archivedSection,
    h("div", { class: "clear-list" }, clearButton),
    h("h2", { class: "section-title" }, t("myList.profile.title")),
    h("p", { class: "lead" }, t("myList.profile.intro")),
    profileForm,
  );
}

/** Add/edit form for one wish. onSave(values) may throw; errors are shown in the form. */
function wishForm({ initial, submitLabel, onSave, onCancel }) {
  const formStatus = statusLine();
  const title = field({ label: t("myList.fields.title"), value: initial.title, required: true, maxlength: 120 });
  const url = field({
    label: t("myList.fields.url"),
    hint: t("myList.fields.urlHint"),
    kind: "url",
    inputmode: "url",
    value: initial.url,
    maxlength: 2000,
  });
  const shop = field({ label: t("myList.fields.shop"), value: initial.shop, maxlength: 120 });
  const price = field({
    label: t("myList.fields.price"),
    kind: "text",
    inputmode: "decimal",
    value: initial.price_eur ?? "",
  });
  const priority = field({
    label: t("myList.fields.priority"),
    kind: "select",
    value: initial.priority ?? 2,
    options: PRIORITIES.map((p) => ({ value: p, label: t(`myList.priority${p}`) })),
  });
  const description = field({
    label: t("myList.fields.description"),
    hint: t("myList.fields.descriptionHint"),
    kind: "textarea",
    value: initial.description,
    maxlength: 2000,
  });
  const submit = h("button", { type: "submit", class: "button-primary" }, submitLabel);

  const form = h(
    "form",
    { class: "wish-form", novalidate: true, onsubmit: handleSubmit },
    title.element,
    h("div", { class: "field-row" }, price.element, priority.element),
    shop.element,
    url.element,
    description.element,
    submit,
    h("button", { type: "button", class: "button-link", onclick: onCancel }, t("common.cancel")),
    formStatus.element,
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const values = {
      title: title.input.value.trim(),
      url: normaliseUrl(url.input.value),
      shop: textOrNull(shop.input.value),
      price_eur: parseAmount(price.input.value),
      priority: Number(priority.input.value),
      description: textOrNull(description.input.value),
    };
    if (!values.title) {
      formStatus.show(t("myList.fields.titleRequired"), "error");
      title.input.focus();
      return;
    }
    if (Number.isNaN(values.price_eur)) {
      formStatus.show(t("myList.fields.priceInvalid"), "error");
      price.input.focus();
      return;
    }
    try {
      await whileBusy(submit, t("common.saving"), () => onSave(values));
    } catch (error) {
      formStatus.show(errorText(error), "error");
    }
  }

  return form;
}

function byPriority(a, b) {
  return a.priority - b.priority || String(a.created_at).localeCompare(String(b.created_at));
}
