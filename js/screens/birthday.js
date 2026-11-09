// A birthday being prepared (route "#/birthday?id=<event>"), for its participants only:
// the celebrated member's wish list and tastes, who takes which gift in hand or chips in
// (amounts visible to all participants), common gifts proposed outside the list, a
// discussion between participants, and who takes part (chosen by the organiser).
// The celebrated member never reaches this screen: the database hides the event from them.

import { h, fill } from "../dom.js?v=7d6d5f9";
import { t, errorText } from "../i18n.js?v=7d6d5f9";
import { getMe, select, rpc, insert, update } from "../api.js?v=7d6d5f9";
import {
  field, statusLine, whileBusy, confirmButton, formatEuro, formatDate, parseAmount, normaliseUrl, textOrNull,
} from "../ui.js?v=7d6d5f9";
import { bubbles, composer } from "./messages.js?v=7d6d5f9";
import { renderNotMember } from "./not-member.js?v=7d6d5f9";

const PROFILE_FIELDS = ["interests", "sizes", "colors", "dislikes", "favorite_shops"];

// Message kept across the redraw that follows a change.
let flash = null;

export async function renderBirthday({ navigate, params }) {
  const me = await getMe();
  if (!me) return renderNotMember();

  const eventId = params?.get("id") ?? "";
  const [event] = /^[0-9a-f-]{36}$/i.test(eventId)
    ? await select("events", `select=*&id=eq.${eventId}&kind=eq.birthday`)
    : [];
  if (!event) {
    return h(
      "section",
      { class: "card" },
      h("h1", {}, t("birthday.notFoundTitle")),
      h("p", {}, t("birthday.notFoundText")),
      h("p", {}, h("a", { href: "#/home" }, t("common.back"))),
    );
  }

  const [participants, members, wishes, profiles, gifts, contributions, messages] = await Promise.all([
    select("participants", `select=member_id&event_id=eq.${event.id}`),
    select("members", "select=id,display_name,is_active&order=display_name"),
    select("wishes", `select=*&member_id=eq.${event.celebrated_id}&archived=is.false&order=priority.asc,created_at.asc`),
    select("profiles", `select=*&member_id=eq.${event.celebrated_id}`),
    select("birthday_gifts", `select=*&event_id=eq.${event.id}&order=created_at.asc`),
    select("birthday_contributions", `select=*&event_id=eq.${event.id}&order=created_at.asc`),
    select("family_messages", `select=id,author_id,body,created_at&event_id=eq.${event.id}&order=created_at.asc`),
  ]);
  const names = new Map(members.map((m) => [m.id, m.display_name]));
  const celebrated = names.get(event.celebrated_id) ?? "?";
  const participantIds = new Set(participants.map((p) => p.member_id));
  const takingPart = participantIds.has(me.id);
  const open = event.status !== "closed";
  const canEdit = open && takingPart;
  const organiser = open && (event.launched_by === me.id || me.is_admin);

  const status = statusLine();
  if (flash) {
    status.show(flash, "success");
    flash = null;
  }
  const here = `/birthday?id=${event.id}`;
  const done = (message) => {
    flash = message;
    navigate(here);
  };
  const failed = (error) => status.show(errorText(error), "error");

  const context = { me, event, names, contributions, canEdit, done, failed };
  const giftByWish = new Map(gifts.filter((g) => g.wish_id).map((g) => [g.wish_id, g]));
  // Gifts of wishes since deleted or archived stay visible with the proposals.
  const otherGifts = gifts.filter((g) => !g.wish_id || !wishes.some((w) => w.id === g.wish_id));
  const total = contributions.reduce((sum, c) => sum + Number(c.amount_eur ?? 0), 0);
  const profile = profiles[0] ?? {};
  const tastes = PROFILE_FIELDS.filter((name) => profile[name]).map((name) =>
    h("div", { class: "taste" }, h("dt", {}, t(`myList.profile.${name}`)), h("dd", {}, profile[name])),
  );

  markRead(event);

  // The administrator or the organiser without taking part: only who takes part.
  if (!takingPart) {
    return h(
      "section",
      { class: "birthday-page" },
      h("h1", {}, event.title),
      h("ul", { class: "event-meta" }, h("li", {}, t("birthday.dateLine", { date: formatDate(event.event_date) }))),
      h("p", { class: "lead" }, t("birthday.notTakingPart", { name: celebrated })),
      status.element,
      h("h2", { class: "section-title" }, t("birthday.participantsTitle", { count: participantIds.size })),
      participantsCard({ event, members, participantIds, names, organiser, done, failed }),
    );
  }

  return h(
    "section",
    { class: "birthday-page" },
    h("h1", {}, event.title),
    h(
      "ul",
      { class: "event-meta" },
      h("li", {}, t("birthday.dateLine", { date: formatDate(event.event_date) })),
      h("li", {}, t("birthday.contributionLine", { amount: formatEuro(event.budget_eur) })),
      total > 0 ? h("li", {}, t("birthday.totalLine", { amount: formatEuro(total) })) : null,
    ),
    h("p", { class: "lead" }, t(open ? "birthday.intro" : "birthday.closedIntro", { name: celebrated })),
    status.element,

    h("h2", { class: "section-title first" }, t("birthday.wishesTitle", { name: celebrated })),
    wishes.length === 0
      ? h("p", { class: "empty" }, t("birthday.wishesEmpty", { name: celebrated }))
      : h("ul", { class: "wish-list" }, wishes.map((wish) => wishCard(wish, giftByWish.get(wish.id), context))),

    h("h2", { class: "section-title" }, t("birthday.commonTitle")),
    otherGifts.length === 0 ? h("p", { class: "empty" }, t("birthday.commonEmpty")) : null,
    otherGifts.length > 0 ? h("ul", { class: "wish-list" }, otherGifts.map((gift) => giftCard(gift, context))) : null,
    canEdit ? proposeForm(event, done, failed) : null,

    h("h2", { class: "section-title" }, t("birthday.tastesTitle", { name: celebrated })),
    tastes.length === 0
      ? h("p", { class: "empty" }, t("birthday.tastesEmpty"))
      : h("dl", { class: "card tastes" }, tastes),

    h("h2", { class: "section-title" }, t("birthday.discussionTitle")),
    h(
      "article",
      { class: "card thread family" },
      h("p", { class: "field-hint" }, t("birthday.discussionHint", { name: celebrated })),
      bubbles(messages.map((m) => ({
        mine: m.author_id === me.id,
        author: m.author_id === me.id ? t("messages.me") : names.get(m.author_id) ?? "?",
        body: m.body,
        date: m.created_at,
      }))),
      canEdit ? composer((body) => insert("family_messages", { event_id: event.id, body }), () => navigate(here)) : null,
    ),

    h("h2", { class: "section-title" }, t("birthday.participantsTitle", { count: participantIds.size })),
    participantsCard({ event, members, participantIds, names, organiser, done, failed }),
  );
}

// ---------------------------------------------------------------------------
// Gifts
// ---------------------------------------------------------------------------

function wishCard(wish, gift, context) {
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
    wish.url ? h("p", {}, h("a", { href: wish.url, target: "_blank", rel: "noopener noreferrer" }, t("myList.openLink"))) : null,
    pledgeArea({ wishId: wish.id, gift }, context),
  );
}

function giftCard(gift, context) {
  const { me, names, contributions, canEdit, done, failed } = context;
  const others = contributions.some((c) => c.gift_id === gift.id && c.member_id !== me.id);
  return h(
    "li",
    { class: "wish card" },
    h("div", { class: "wish-head" }, h("h3", {}, gift.title)),
    gift.proposed_by
      ? h("p", { class: "wish-meta" }, t("birthday.proposedBy", { name: gift.proposed_by === me.id ? t("birthday.you") : names.get(gift.proposed_by) ?? "?" }))
      : null,
    gift.note ? h("p", { class: "wish-description" }, gift.note) : null,
    gift.url ? h("p", {}, h("a", { href: gift.url, target: "_blank", rel: "noopener noreferrer" }, t("myList.openLink"))) : null,
    pledgeArea({ gift }, context),
    canEdit && gift.proposed_by === me.id && !gift.wish_id && !others
      ? h("div", { class: "button-row" }, confirmButton({
          label: t("birthday.removeProposal"),
          confirmLabel: t("birthday.removeProposalConfirm"),
          onConfirm: async () => {
            try {
              await rpc("birthday_remove_gift", { p_gift_id: gift.id });
              done(t("birthday.proposalRemoved"));
            } catch (error) {
              failed(error);
            }
          },
        }))
      : null,
  );
}

// Who is on this gift, and what I can do about it.
function pledgeArea({ wishId = null, gift = null }, { me, event, names, contributions, canEdit, done, failed }) {
  const onGift = gift ? contributions.filter((c) => c.gift_id === gift.id) : [];
  const buyer = onGift.find((c) => c.role === "buyer");
  const helpers = onGift.filter((c) => c.role === "contributor");
  const mine = onGift.find((c) => c.member_id === me.id);
  const giftTotal = onGift.reduce((sum, c) => sum + Number(c.amount_eur ?? 0), 0);
  const who = (c) => (c.member_id === me.id ? t("birthday.you") : names.get(c.member_id) ?? "?");
  const withAmount = (c) => (c.amount_eur ? t("birthday.withAmount", { name: who(c), amount: formatEuro(c.amount_eur) }) : who(c));

  const lines = [];
  if (buyer) lines.push(h("li", { class: "pledge-buyer" }, t("birthday.buyerLine", { name: withAmount(buyer) })));
  if (helpers.length > 0) {
    lines.push(h("li", {}, t("birthday.helpersLine", { names: helpers.map(withAmount).join(", ") })));
  }
  if (giftTotal > 0) lines.push(h("li", {}, t("birthday.giftTotal", { amount: formatEuro(giftTotal) })));

  const area = h("div", { class: "pledge" });
  const summary = lines.length > 0
    ? h("ul", { class: "pledge-lines" }, lines)
    : h("p", { class: "pledge-free" }, t("birthday.nobodyYet"));
  if (!canEdit) return fill(area, summary);

  const pledge = async (role, amount, button) => {
    try {
      await whileBusy(button, t("common.saving"), () => rpc("birthday_pledge", {
        p_event_id: event.id,
        p_wish_id: gift ? null : wishId,
        p_gift_id: gift ? gift.id : null,
        p_role: role,
        p_amount: amount,
      }));
      done(t(role === "buyer" ? "birthday.buyerDone" : "birthday.helperDone"));
    } catch (error) {
      failed(error);
    }
  };

  const amountForm = (role, current) => {
    const amount = field({
      label: t("birthday.amountLabel"),
      inputmode: "decimal",
      value: current ?? "",
      hint: t("birthday.amountHint", { amount: formatEuro(event.budget_eur) }),
    });
    const submit = h("button", { type: "submit", class: "button-primary" }, t("birthday.confirmPledge"));
    const cancel = h("button", { type: "button", class: "button-link", onclick: () => fill(area, summary, actions()) }, t("common.cancel"));
    return h(
      "form",
      {
        class: "pledge-form",
        novalidate: true,
        onsubmit: (e) => {
          e.preventDefault();
          const value = parseAmount(amount.input.value);
          if (Number.isNaN(value) || value === 0) {
            failed({ key: "birthday.invalid_amount" });
            return;
          }
          pledge(role, value, submit);
        },
      },
      amount.element,
      h("div", { class: "button-row" }, submit, cancel),
    );
  };

  const button = (label, onClick, className = "button-secondary") =>
    h("button", { type: "button", class: className, onclick: onClick }, label);

  function actions() {
    const row = [];
    if (mine) {
      row.push(h("p", { class: "pledge-mine" }, t(mine.role === "buyer" ? "birthday.youBuy" : "birthday.youHelp")));
      row.push(button(t("birthday.changeAmount"), () => fill(area, summary, amountForm(mine.role, mine.amount_eur))));
      if (mine.role === "contributor" && !buyer) {
        row.push(button(t("birthday.takeInHand"), (e) => pledge("buyer", mine.amount_eur, e.currentTarget)));
      }
      row.push(confirmButton({
        label: t("birthday.withdraw"),
        confirmLabel: t("birthday.withdrawConfirm"),
        onConfirm: async () => {
          try {
            await rpc("birthday_withdraw", { p_gift_id: gift.id });
            done(t("birthday.withdrawn"));
          } catch (error) {
            failed(error);
          }
        },
      }));
    } else {
      if (!buyer) row.push(button(t("birthday.takeInHand"), (e) => pledge("buyer", null, e.currentTarget), "button-primary"));
      row.push(button(t("birthday.chipIn"), () => fill(area, summary, amountForm("contributor", null))));
    }
    return h("div", { class: "button-row pledge-actions" }, row);
  }

  return fill(area, summary, actions());
}

function proposeForm(event, done, failed) {
  const title = field({ label: t("birthday.proposeTitle"), maxlength: 120, required: true });
  const url = field({ label: t("birthday.proposeUrl"), kind: "url", inputmode: "url", maxlength: 2000 });
  const note = field({ label: t("birthday.proposeNote"), kind: "textarea", maxlength: 500 });
  const submit = h("button", { type: "submit", class: "button-secondary" }, t("birthday.proposeSubmit"));
  const toggle = h("button", { type: "button", class: "button-secondary" }, t("birthday.propose"));
  const area = h("div", { class: "propose" }, toggle);
  const form = h(
    "form",
    {
      class: "card",
      novalidate: true,
      onsubmit: async (e) => {
        e.preventDefault();
        if (!textOrNull(title.input.value)) {
          failed({ key: "birthday.invalid_title" });
          return;
        }
        try {
          await whileBusy(submit, t("common.saving"), () => rpc("birthday_propose", {
            p_event_id: event.id,
            p_title: title.input.value.trim(),
            p_url: normaliseUrl(url.input.value),
            p_note: textOrNull(note.input.value),
          }));
          done(t("birthday.proposed"));
        } catch (error) {
          failed(error);
        }
      },
    },
    h("h3", {}, t("birthday.propose")),
    h("p", { class: "field-hint" }, t("birthday.proposeHint")),
    title.element,
    url.element,
    note.element,
    h("div", { class: "button-row" }, submit,
      h("button", { type: "button", class: "button-link", onclick: () => fill(area, toggle) }, t("common.cancel"))),
  );
  toggle.addEventListener("click", () => {
    fill(area, form);
    title.input.focus();
  });
  return area;
}

// ---------------------------------------------------------------------------
// Participants
// ---------------------------------------------------------------------------

function participantsCard({ event, members, participantIds, names, organiser, done, failed }) {
  const list = h(
    "p",
    {},
    [...participantIds].map((id) => names.get(id) ?? "?").sort((a, b) => a.localeCompare(b, "fr")).join(", "),
  );
  const card = h("div", { class: "card" });
  if (!organiser) return fill(card, list, h("p", { class: "field-hint" }, t("birthday.participantsHint")));

  const edit = h("button", { type: "button", class: "button-secondary" }, t("birthday.editParticipants"));
  edit.addEventListener("click", () => {
    const boxes = members
      .filter((m) => m.is_active && m.id !== event.celebrated_id)
      .map((m) => ({ member: m, box: h("input", { type: "checkbox", checked: participantIds.has(m.id), value: m.id }) }));
    const submit = h("button", { type: "submit", class: "button-primary" }, t("birthday.saveParticipants"));
    fill(
      card,
      h(
        "form",
        {
          novalidate: true,
          onsubmit: async (e) => {
            e.preventDefault();
            const chosen = boxes.filter(({ box }) => box.checked).map(({ member }) => member.id);
            try {
              await whileBusy(submit, t("common.saving"), () =>
                rpc("set_birthday_participants", { p_event_id: event.id, p_member_ids: chosen }));
              done(t("birthday.participantsSaved"));
            } catch (error) {
              failed(error);
            }
          },
        },
        h(
          "fieldset",
          { class: "checklist" },
          h("legend", {}, t("birthday.participantsLegend")),
          h("p", { class: "field-hint" }, t("birthday.participantsEditHint")),
          boxes.map(({ member, box }) => h("label", { class: "check" }, box, member.display_name)),
        ),
        h("div", { class: "button-row" }, submit,
          h("button", { type: "button", class: "button-link", onclick: () => done(null) }, t("common.cancel"))),
      ),
    );
  });
  return fill(card, list, h("div", { class: "button-row" }, edit));
}

// Best effort: the bell forgets this birthday's messages and announcements.
async function markRead(event) {
  try {
    await update("notifications", `event_id=eq.${event.id}&read_at=is.null&kind=in.(family_message,birthday_opened,birthday_reminder)`,
      { read_at: new Date().toISOString() });
    document.dispatchEvent(new CustomEvent("notifications-changed"));
  } catch {
    // ignore
  }
}
