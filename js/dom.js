// Small helper to build DOM elements safely.
// It never uses innerHTML, so text coming from the database can never inject HTML.

/**
 * Creates an element: h("p", { class: "lead" }, "Hello", otherElement)
 * - attrs: plain attributes; keys starting with "on" become event listeners.
 * - children: strings (inserted as text) or elements; null/false are skipped.
 */
export function h(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (name.startsWith("on") && typeof value === "function") {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else if (value === true) {
      element.setAttribute(name, "");
    } else {
      element.setAttribute(name, String(value));
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    element.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return element;
}
