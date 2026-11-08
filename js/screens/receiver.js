// "La liste de mon receveur" (route "#/receiver"): the wish list and tastes of the person
// I give to in the current event (read-only, allowed by RLS only to their giver), and my
// private purchase tracking, which the receiver can never see.

import { h, fill } from "../dom.js?v=6604111";
import { t, errorText } from "../i18n.js?v=6604111";
import { getMe, select, rpc, insert, update, remove } from "../api.js?v=6604111";
import { field, statusLine, whileBusy, confirmButton, formatEuro, textOrNull } from "../ui.js?v=6604111";
import { renderNotMember } from "./not-member.js?v=6604111";

const PROFILE_FIELDS = ["interests", "sizes", "colors", "dislikes", "favorite_shops"];
const PURCHASE_STATUSES = ["idea", "bought", "wrapped"];

export async function renderReceiver() {
  const me = await getMe();
  if (!me) return renderNotMember();

  const draws = await rpc("get_my_draws");
  const draw = draws.find((d) => d.event_status !== "closed");
  if (!draw) {
    return h(
      "section",
      { class: "card" },
      h("h1", {}, t("receiver.noneTitle")),
      h("p", {}, t("receiver.noneText")),
      h("p", {}, h("a", { href: "#/home" }, t("common.back"))),
    );
  }

  const [events, wishes, profiles, purchases] = await Promise.all([
    select("events", `select=budget_eur&id=eq.${draw.event_id}`),
    select("wishes", `select=*&member_id=eq.${draw.receiver_id}&archived=is.false&order=priority.asc,created_at.asc`),
    select("profiles", `select=*&member_id=eq.${draw.receiver_id}`),
    select("purchase_tracking", `select=*&event_id=eq.${draw.event_id}&giver_id=eq.${me.id}&order=created_at.asc`),
  ]);
  const budget = events[0]?.budget_eur;
  const profile = profiles[0] ?? {};
  const status = statusLine();
  const purchaseList = h("ul", { class: "purchase-list" });
  const chooseButtons = new Map();   // wish id -> "J'ai choisi cette idée" button

  // ---- Purchase tracking --------------------------------------------------

  function refreshPurchases() {
    fill(
      purchaseList,
      purchases.length === 0 ? h("li", { class: "empty" }, t("receiver.purchasesEmpty")) : null,
      purchases.map(purchaseItem),
    );
    for (const [wishId, button] of chooseButtons) {
      button.disabled = purchases.some((p) => p.wish_id === wishId);
      button.textContent = t(button.disabled ? "receiver.chosen" : "receiver.chooseWish");
    }
  }

  function purchaseItem(purchase) {
    const statusSelect = h(
      "select",
      { "aria-label": t("receiver.purchaseStatus") },
      PURCHASE_STATUSES.map((s) => h("option", { value: s, selected: s === purchase.status }, t(`receiver.status.${s}`))),
    );
    statusSelect.addEventListener("change", async () => {
      try {
        const [saved] = await update("purchase_tracking", `id=eq.${purchase.id}`, { status: statusSelect.value });
        Object.assign(purchase, saved);
        status.show(t("receiver.purchaseSaved"), "success");
      } catch (error) {
        statusSelect.value = purchase.status;
        status.show(errorText(error), "error");
      }
    });
    return h(
      "li",
      { class: `purchase status-${purchase.status}` },
      h("span", { class: "purchase-label" }, purchase.label),
      statusSelect,
      confirmButton({
        label: t("myList.delete"),
        confirmLabel: t("myList.deleteConfirm"),
        onConfirm: async () => {
          try {
            await remove("purchase_tracking", `id=eq.${purchase.id}`);
            purchases.splice(purchases.indexOf(purchase), 1);
            refreshPurchases();
          } catch (error) {
            status.show(errorText(error), "error");
          }
        },
      }),
    );
  }

  async function addPurchase(values) {
    const saved = await insert("purchase_tracking", {
      event_id: draw.event_id,
      giver_id: me.id,
      status: "idea",
      ...values,
    });
    purchases.push(saved);
    refreshPurchases();
    status.show(t("receiver.purchaseAdded"), "success");
  }

  const ideaField = field({ label: t("receiver.ownIdea"), maxlength: 200 });
  const ideaButton = h("button", { type: "submit", class: "button-secondary" }, t("receiver.ownIdeaAdd"));
  const ideaForm = h(
    "form",
    {
      class: "own-idea",
      novalidate: true,
      onsubmit: async (event) => {
        event.preventDefault();
        const label = textOrNull(ideaField.input.value);
        if (!label) return;
        try {
          await whileBusy(ideaButton, t("common.saving"), () => addPurchase({ label }));
          ideaField.input.value = "";
        } catch (error) {
          status.show(errorText(error), "error");
        }
      },
    },
    ideaField.element,
    ideaButton,
  );

  // ---- Wish list (read-only) ----------------------------------------------

  const wishItems = wishes.map((wish) => {
    const meta = [wish.shop, formatEuro(wish.price_eur)].filter(Boolean).join(" · ");
    const choose = h(
      "button",
      {
        type: "button",
        class: "button-link",
        onclick: async (event) => {
          try {
            await whileBusy(event.currentTarget, t("common.saving"), () =>
              addPurchase({ wish_id: wish.id, label: wish.title }),
            );
          } catch (error) {
            status.show(errorText(error), "error");
          }
          refreshPurchases();
        },
      },
      t("receiver.chooseWish"),
    );
    chooseButtons.set(wish.id, choose);
    return h(
      "li",
      { class: "wish card" },
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
      h("div", { class: "wish-actions" }, choose),
    );
  });

  const tastes = PROFILE_FIELDS.filter((name) => profile[name]).map((name) =>
    h("div", { class: "taste" }, h("dt", {}, t(`myList.profile.${name}`)), h("dd", {}, profile[name])),
  );

  const content = h(
    "section",
    { class: "receiver" },
    h("h1", {}, t("receiver.title", { name: draw.receiver_name })),
    h("p", { class: "lead" }, t("receiver.intro", { event: draw.title, budget: formatEuro(budget) })),
    status.element,
    h("h2", { class: "section-title first" }, t("receiver.wishesTitle")),
    wishes.length === 0
      ? h("p", { class: "empty" }, t("receiver.wishesEmpty", { name: draw.receiver_name }))
      : h("ul", { class: "wish-list" }, wishItems),
    h("h2", { class: "section-title" }, t("receiver.tastesTitle")),
    tastes.length === 0
      ? h("p", { class: "empty" }, t("receiver.tastesEmpty"))
      : h("dl", { class: "card tastes" }, tastes),
    h("h2", { class: "section-title" }, t("receiver.purchasesTitle")),
    h("p", { class: "lead" }, t("receiver.purchasesIntro", { name: draw.receiver_name })),
    h("div", { class: "card" }, purchaseList, ideaForm),
  );
  refreshPurchases();
  return content;
}
