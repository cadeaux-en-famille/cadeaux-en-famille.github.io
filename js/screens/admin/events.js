// Admin > Noël (route "#/admin"): create the Christmas events, choose participants, run
// or cancel the draw, follow progress (counts only) and close the event. Birthdays have
// their own screen (admin/birthdays.js).
// The admin never sees who gives to whom: the database only returns counts.

import { h, fill } from "../../dom.js?v=0a82ace";
import { t, errorText } from "../../i18n.js?v=0a82ace";
import { select, insert, update, remove, rpc } from "../../api.js?v=0a82ace";
import { field, statusLine, whileBusy, confirmButton, formatEuro, formatDate, parseAmount, addDays } from "../../ui.js?v=0a82ace";
import { requireAdmin, adminShell } from "./common.js?v=0a82ace";

export async function renderAdminEvents() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const status = statusLine();
  const body = h("div");
  await load();
  return adminShell("/admin", h("p", { class: "lead" }, t("admin.events.intro")), status.element, body);

  // Loads everything and (re)draws the screen; `message` is shown at the top.
  async function load(message, kind = "success") {
    const [events, members, participants, settingsRows] = await Promise.all([
      select("events", "select=*&kind=eq.christmas&order=year.desc"),
      select("members", "select=id,display_name,is_active&order=display_name"),
      select("participants", "select=event_id,member_id"),
      select("settings", "select=default_budget_eur,wishlist_deadline_days"),
    ]);
    const context = { members, participants, settings: settingsRows[0] ?? {}, reload };
    const createButton = h("button", { type: "button", class: "button-primary", onclick: showCreate }, t("admin.events.create"));
    const createSlot = h("div");

    fill(
      body,
      createButton,
      createSlot,
      events.length === 0 ? h("p", { class: "empty" }, t("admin.events.none")) : null,
      h("div", { class: "event-list" }, events.map((event) => eventCard(event, context))),
    );
    if (message) status.show(message, kind);

    function showCreate() {
      createButton.hidden = true;
      fill(createSlot, createForm(events, context, () => {
        createSlot.replaceChildren();
        createButton.hidden = false;
      }));
    }
  }

  async function reload(message, kind) {
    try {
      await load(message, kind);
    } catch (error) {
      status.show(errorText(error), "error");
    }
    window.scrollTo(0, 0);
  }
}

// ---------------------------------------------------------------------------
// Creation form
// ---------------------------------------------------------------------------

function createForm(events, { members, settings, reload }, onCancel) {
  const usedYears = new Set(events.map((e) => e.year));
  let year = new Date().getFullYear();
  while (usedYears.has(year)) year += 1;

  const formStatus = statusLine();
  const yearField = field({ label: t("admin.events.year"), kind: "number", value: year, min: 2000, max: 2100, inputmode: "numeric" });
  const titleField = field({ label: t("admin.events.title"), value: t("admin.events.titleDefault", { year }), maxlength: 80 });
  const dateField = field({ label: t("admin.events.date"), kind: "date", value: `${year}-12-25` });
  const budgetField = field({ label: t("admin.events.budget"), inputmode: "decimal", value: settings.default_budget_eur ?? 25 });
  const deadlineField = field({
    label: t("admin.events.deadline"),
    kind: "date",
    value: addDays(`${year}-12-25`, -(settings.wishlist_deadline_days ?? 30)),
  });
  const modeField = field({
    label: t("admin.events.mode"),
    kind: "select",
    value: "random",
    options: [
      { value: "random", label: t("admin.events.modeRandom") },
      { value: "declared", label: t("admin.events.modeDeclared") },
    ],
  });

  // Keep title and dates in step with the year while they still hold the defaults.
  yearField.input.addEventListener("change", () => {
    const newYear = Number(yearField.input.value);
    if (!newYear) return;
    titleField.input.value = t("admin.events.titleDefault", { year: newYear });
    dateField.input.value = `${newYear}-12-25`;
    deadlineField.input.value = addDays(`${newYear}-12-25`, -(settings.wishlist_deadline_days ?? 30));
  });

  const activeMembers = members.filter((m) => m.is_active);
  const boxes = activeMembers.map((m) => ({
    member: m,
    box: h("input", { type: "checkbox", checked: true, value: m.id }),
  }));
  const participantList = h(
    "fieldset",
    { class: "checklist" },
    h("legend", {}, t("admin.events.participants")),
    h("p", { class: "field-hint" }, t("admin.events.participantsHint")),
    boxes.map(({ member, box }) => h("label", { class: "check" }, box, member.display_name)),
  );

  const submit = h("button", { type: "submit", class: "button-primary" }, t("admin.events.createSubmit"));
  const form = h(
    "form",
    { class: "card", novalidate: true, onsubmit: handleSubmit },
    h("h2", {}, t("admin.events.createTitle")),
    h("div", { class: "field-row" }, yearField.element, budgetField.element),
    titleField.element,
    h("div", { class: "field-row" }, dateField.element, deadlineField.element),
    modeField.element,
    participantList,
    submit,
    h("button", { type: "button", class: "button-link", onclick: onCancel }, t("common.cancel")),
    formStatus.element,
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const values = {
      year: Number(yearField.input.value),
      title: titleField.input.value.trim(),
      event_date: dateField.input.value,
      wishlist_deadline: deadlineField.input.value || null,
      budget_eur: parseAmount(budgetField.input.value),
      draw_mode: modeField.input.value,
    };
    if (!Number.isInteger(values.year) || values.year < 2000 || values.year > 2100) {
      return formStatus.show(t("admin.events.invalidYear"), "error");
    }
    if (!values.event_date) return formStatus.show(t("admin.events.invalidDate"), "error");
    if (values.budget_eur === null || Number.isNaN(values.budget_eur)) {
      return formStatus.show(t("admin.events.invalidBudget"), "error");
    }
    if (!values.title) values.title = t("admin.events.titleDefault", { year: values.year });

    try {
      await whileBusy(submit, t("common.saving"), async () => {
        const created = await insert("events", values);
        const chosen = boxes.filter(({ box }) => box.checked).map(({ member }) => ({
          event_id: created.id,
          member_id: member.id,
        }));
        if (chosen.length > 0) await insert("participants", chosen);
      });
      await reload(t("admin.events.created"));
    } catch (error) {
      formStatus.show(errorText(error), "error");
    }
  }

  return form;
}

// ---------------------------------------------------------------------------
// One event
// ---------------------------------------------------------------------------

function eventCard(event, { members, participants, reload }) {
  const card = h("article", { class: "card event" });
  const cardStatus = statusLine();
  const memberName = new Map(members.map((m) => [m.id, m.display_name]));
  const participantIds = new Set(participants.filter((p) => p.event_id === event.id).map((p) => p.member_id));
  const progressSlot = h("div", { class: "event-progress" }, h("p", { class: "loading" }, t("common.loading")));
  const actionsSlot = h("div", { class: "event-actions" });
  const participantsSlot = h("div");

  showView();
  loadProgress();
  return card;

  function showView() {
    fill(
      card,
      h(
        "div",
        { class: "event-head" },
        h("h2", {}, event.title),
        h("span", { class: `status status-${event.status}` }, t(`admin.events.status.${event.status}`)),
      ),
      h(
        "ul",
        { class: "event-meta" },
        h("li", {}, t(`admin.events.modeLabel.${event.draw_mode}`)),
        h("li", {}, t("admin.events.dateLine", { date: formatDate(event.event_date) })),
        h("li", {}, t("admin.events.budgetLine", { budget: formatEuro(event.budget_eur) })),
        event.wishlist_deadline
          ? h("li", {}, t("admin.events.deadlineLine", { date: formatDate(event.wishlist_deadline) }))
          : null,
      ),
      progressSlot,
      participantsSlot,
      actionsSlot,
      cardStatus.element,
    );
  }

  async function loadProgress() {
    try {
      const [[draw], [wishes]] = await Promise.all([
        rpc("draw_progress", { p_event_id: event.id }),
        rpc("wishlist_progress", { p_event_id: event.id }),
      ]);
      const total = draw.participant_count;
      fill(
        progressSlot,
        h(
          "ul",
          { class: "progress-list" },
          event.draw_mode === "declared"
            ? h("li", {}, t("admin.events.progressDeclared", { assigned: draw.assigned_count, total }))
            : null,
          event.status !== "preparing"
            ? h("li", {}, t("admin.events.progressViewed", { viewed: draw.viewed_count, total }))
            : null,
          h("li", {}, t("admin.events.progressWishes", { count: wishes.with_wishes_count, total })),
        ),
      );
      renderParticipants(draw.assigned_count === 0 && event.status === "preparing");
      renderActions(draw.assigned_count);
    } catch (error) {
      fill(progressSlot, h("p", { class: "form-message", "data-kind": "error" }, errorText(error)));
    }
  }

  function renderParticipants(editable) {
    const summary = h("summary", {}, t("admin.events.participantsTitle", { count: participantIds.size }));
    const list = members
      .filter((m) => m.is_active || participantIds.has(m.id))
      .map((m) => {
        const box = h("input", { type: "checkbox", checked: participantIds.has(m.id), disabled: !editable });
        box.addEventListener("change", async () => {
          box.disabled = true;
          try {
            if (box.checked) {
              await insert("participants", { event_id: event.id, member_id: m.id });
              participantIds.add(m.id);
            } else {
              await remove("participants", `event_id=eq.${event.id}&member_id=eq.${m.id}`);
              participantIds.delete(m.id);
            }
            summary.textContent = t("admin.events.participantsTitle", { count: participantIds.size });
            cardStatus.show(t("admin.events.participantSaved"), "success");
          } catch (error) {
            box.checked = !box.checked;
            cardStatus.show(errorText(error), "error");
          } finally {
            box.disabled = false;
          }
        });
        return h("label", { class: "check" }, box, m.display_name);
      });
    fill(
      participantsSlot,
      h(
        "details",
        { class: "participants" },
        summary,
        editable ? null : h("p", { class: "field-hint" }, t("admin.events.participantsLocked")),
        h("div", { class: "checklist" }, list),
      ),
    );
  }

  function renderActions(assignedCount) {
    const act = (label, confirmLabel, task) =>
      confirmButton({
        label,
        confirmLabel,
        className: "button-secondary",
        onConfirm: async () => {
          try {
            await task();
          } catch (error) {
            cardStatus.show(errorText(error), "error");
          }
        },
      });

    const buttons = [];
    const notClosed = event.status !== "closed";

    if (notClosed) {
      buttons.push(h("button", { type: "button", class: "button-secondary", onclick: showEdit }, t("admin.events.edit")));
    }
    if (event.draw_mode === "random" && event.status === "preparing") {
      buttons.push(act(t("admin.events.runDraw"), t("admin.events.runDrawConfirm"), async () => {
        const count = await rpc("run_draw", { p_event_id: event.id });
        await reload(t("admin.events.drawDone", { count }));
      }));
    }
    if (event.draw_mode === "random" && event.status === "drawn") {
      buttons.push(act(t("admin.events.resetDraw"), t("admin.events.resetDrawConfirm"), async () => {
        await rpc("reset_draw", { p_event_id: event.id });
        await reload(t("admin.events.drawReset"));
      }));
    }
    if (event.status === "drawn") {
      buttons.push(act(t("admin.events.close"), t("admin.events.closeConfirm"), async () => {
        await rpc("close_event", { p_event_id: event.id });
        await reload(t("admin.events.closed"));
      }));
    }
    if (event.status === "preparing" && assignedCount === 0) {
      buttons.push(act(t("admin.events.delete"), t("admin.events.deleteConfirm"), async () => {
        await remove("events", `id=eq.${event.id}`);
        await reload(t("admin.events.deleted"));
      }));
    }

    fill(
      actionsSlot,
      h("div", { class: "button-row" }, buttons),
      event.draw_mode === "declared" && notClosed && assignedCount > 0 ? resetDeclarationForm() : null,
    );
  }

  function resetDeclarationForm() {
    const options = [...participantIds]
      .map((id) => ({ value: id, label: memberName.get(id) ?? id }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
    const giver = field({ label: t("admin.events.resetDeclaration"), kind: "select", options, hint: t("admin.events.resetDeclarationHint") });
    return h(
      "div",
      { class: "reset-declaration" },
      giver.element,
      confirmButton({
        label: t("admin.events.resetDeclarationSubmit"),
        confirmLabel: t("admin.events.deleteConfirm"),
        className: "button-secondary",
        onConfirm: async () => {
          try {
            await rpc("reset_declaration", { p_event_id: event.id, p_giver_id: giver.input.value });
            await reload(t("admin.events.declarationReset"));
          } catch (error) {
            cardStatus.show(errorText(error), "error");
          }
        },
      }),
    );
  }

  function showEdit() {
    const formStatus = statusLine();
    const titleField = field({ label: t("admin.events.title"), value: event.title, maxlength: 80 });
    const dateField = field({ label: t("admin.events.date"), kind: "date", value: event.event_date });
    const budgetField = field({ label: t("admin.events.budget"), inputmode: "decimal", value: event.budget_eur });
    const deadlineField = field({ label: t("admin.events.deadline"), kind: "date", value: event.wishlist_deadline ?? "" });
    const submit = h("button", { type: "submit", class: "button-primary" }, t("admin.events.save"));

    fill(
      card,
      h(
        "form",
        {
          novalidate: true,
          onsubmit: async (e) => {
            e.preventDefault();
            const values = {
              title: titleField.input.value.trim() || event.title,
              event_date: dateField.input.value,
              budget_eur: parseAmount(budgetField.input.value),
              wishlist_deadline: deadlineField.input.value || null,
            };
            if (!values.event_date) return formStatus.show(t("admin.events.invalidDate"), "error");
            if (values.budget_eur === null || Number.isNaN(values.budget_eur)) {
              return formStatus.show(t("admin.events.invalidBudget"), "error");
            }
            try {
              await whileBusy(submit, t("common.saving"), () => update("events", `id=eq.${event.id}`, values));
              await reload(t("admin.events.saved"));
            } catch (error) {
              formStatus.show(errorText(error), "error");
            }
          },
        },
        h("h2", {}, event.title),
        titleField.element,
        h("div", { class: "field-row" }, dateField.element, budgetField.element),
        deadlineField.element,
        submit,
        h("button", { type: "button", class: "button-link", onclick: () => { showView(); loadProgress(); } }, t("common.cancel")),
        formStatus.element,
      ),
    );
  }
}
