// "La liste de mon conjoint" (route "#/partner"): the wish list and tastes of the other
// member of my household, read-only. The database lets partners read each other's
// active wishes and tastes (20261125000100_household_lists.sql), nothing more: not what
// anybody plans to give them.

import { h } from "../dom.js?v=5d60296";
import { t } from "../i18n.js?v=5d60296";
import { getMe, select } from "../api.js?v=5d60296";
import { formatEuro } from "../ui.js?v=5d60296";
import { renderNotMember } from "./not-member.js?v=5d60296";

const PROFILE_FIELDS = ["current_wishes", "interests", "sizes", "colors", "dislikes", "favorite_shops"];

/** The other active member of my household, or null. */
export async function findPartner(me) {
  if (!me?.household_id) return null;
  const [partner] = await select(
    "members",
    `select=id,display_name&household_id=eq.${me.household_id}&id=neq.${me.id}&is_active=is.true&limit=1`,
  );
  return partner ?? null;
}

export async function renderPartner() {
  const me = await getMe();
  if (!me) return renderNotMember();
  const partner = await findPartner(me);
  if (!partner) {
    return h(
      "section",
      { class: "card" },
      h("h1", {}, t("partner.noneTitle")),
      h("p", {}, t("partner.noneText")),
      h("p", {}, h("a", { href: "#/my-list" }, t("partner.back"))),
    );
  }

  const [wishes, profiles] = await Promise.all([
    select("wishes", `select=*&member_id=eq.${partner.id}&archived=is.false&order=priority.asc,created_at.asc`),
    select("profiles", `select=*&member_id=eq.${partner.id}`),
  ]);
  const profile = profiles[0] ?? {};
  const tastes = PROFILE_FIELDS.filter((name) => profile[name]).map((name) =>
    h("div", { class: "taste" }, h("dt", {}, t(`myList.profile.${name}`)), h("dd", {}, profile[name])),
  );

  return h(
    "section",
    { class: "receiver partner" },
    h("h1", {}, t("partner.title", { name: partner.display_name })),
    h("p", { class: "lead" }, t("partner.intro", { name: partner.display_name })),
    h("h2", { class: "section-title first" }, t("partner.wishesTitle")),
    wishes.length === 0
      ? h("p", { class: "empty" }, t("partner.wishesEmpty", { name: partner.display_name }))
      : h(
          "ul",
          { class: "wish-list" },
          wishes.map((wish) => {
            const meta = [wish.shop, formatEuro(wish.price_eur)].filter(Boolean).join(" · ");
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
            );
          }),
        ),
    h("h2", { class: "section-title" }, t("partner.tastesTitle")),
    tastes.length === 0
      ? h("p", { class: "empty" }, t("receiver.tastesEmpty"))
      : h("dl", { class: "card tastes" }, tastes),
    h("p", {}, h("a", { href: "#/my-list" }, t("partner.back"))),
  );
}
