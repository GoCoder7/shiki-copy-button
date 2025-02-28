import { h } from "hastscript";
import type { CopyButtonOptions } from "./types.js";
import type { Element } from "hast";

const HAS_DIFF_CLASS = "has-diff";
const HAS_FOCUSED_CLASS = "has-focused";
const REMOVE_CLASS = "remove";
const FOCUSED_CLASS = "focused";

export function addCopyButton(options?: CopyButtonOptions) {
  const duration = options?.toggle ?? 3000;
  const filterFocus = options?.filterFocus ?? true;
  const filterRemove = options?.filterRemove ?? true;

  return {
    // handle `pre` element
    pre(preEl: Element) {
      // check if it has a `code` element
      const code = preEl.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code"
      );
      if (!code) return;

      // define predicate variables for pre
      let preClasses = preEl.properties.class as string[] | string;
      if (typeof preClasses === "string") preClasses = preClasses.split(" ");
      const preHasDiff = preClasses.includes(HAS_DIFF_CLASS);
      const preHasFocused = preClasses.includes(HAS_FOCUSED_CLASS);

      // get the contents from lines
      const lines = code.children.filter(
        (line): line is Element =>
          line.type === "element" && line.tagName === "span"
      );
      const contents: string = lines
        .map((line) => {
          // define predicate variables for line
          let lineClasses = line.properties.class as string | string[];
          if (typeof lineClasses === "string")
            lineClasses = lineClasses.split(" ");
          const lineHasRemove = lineClasses.includes(REMOVE_CLASS);
          const lineHasFocused = lineClasses.includes(FOCUSED_CLASS);

          // define conditions
          const pass = !preHasDiff && !preHasFocused;
          const notRemoved = filterRemove && !lineHasRemove && !preHasFocused;
          const focused = filterFocus && lineHasFocused && !preHasDiff;
          const focusedButNotRemoved =
            filterRemove &&
            filterFocus &&
            !lineHasRemove &&
            lineHasFocused &&
            preHasDiff &&
            preHasFocused;

          return pass || notRemoved || focused || focusedButNotRemoved
            ? line.children
                .map((token) => {
                  if (token.type === "element") {
                    const text = token.children[0];
                    if (text && text.type === "text") {
                      return text.value;
                    }
                  }
                })
                .join("") + "\n"
            : "";
        })
        .join("")
        .slice(0, -1); // remove last `\n`

      // create copy button
      const copyButton = h(
        "button",
        {
          class: "copy",
          // set contents to the custom 'code' attribute
          "data-code": contents,
          // copy contents to clipboard
          onclick: `
          navigator.clipboard.writeText(this.dataset.code);
          this.classList.add('copied');
          setTimeout(() => this.classList.remove('copied'), ${duration})
        `,
        },
        [h("span", { class: "ready" }), h("span", { class: "success" })]
      );

      // append button as pre's last child
      preEl.children.push(copyButton);
    },
  };
}
