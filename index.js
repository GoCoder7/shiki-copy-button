import { h } from "hastscript";

export function addCopyButton(options = {}) {
  const duration = options.toggle || 3000;
  const filterFocus = options.filterFocus || true;
  const filterRemove = options.filterRemove || true;

  return {
    pre(node) {
      let preClasses = node.properties.class;
      if (typeof preClasses === "string") preClasses = preClasses.split(" ");
      const preHasDiff = preClasses.includes("has-diff");
      const preHasFocused = preClasses.includes("has-focused");
      const code = node.children.find((child) => child.tagName === "code");
      const lines = code.children;
      const contents = lines
        .map((line) => {
          if (line.tagName === "span") {
            let lineClasses = line.properties.class;
            return (!preHasFocused && !preHasDiff) ||
              (filterRemove &&
                filterFocus &&
                preHasDiff &&
                preHasFocused &&
                !lineClasses.includes("remove") &&
                lineClasses.includes("focused")) ||
              (filterRemove &&
                preHasDiff &&
                !preHasFocused &&
                !lineClasses.includes("remove")) ||
              (filterFocus &&
                preHasFocused &&
                !preHasDiff &&
                lineClasses.includes("focused"))
              ? line.children
                  .map((token) => {
                    return token.children[0].value;
                  })
                  .join("") + "\n"
              : "";
          }
        })
        .join("")
        .slice(0, -1); // remove last newline

      const button = h(
        "button",
        {
          class: "copy",
          "data-code": contents,
          // "data-code": this.source,
          onclick: `
          navigator.clipboard.writeText(this.dataset.code);
          this.classList.add('copied');
          setTimeout(() => this.classList.remove('copied'), ${duration})
        `,
        },
        [h("span", { class: "ready" }), h("span", { class: "success" })]
      );
      node.children.push(button);
    },
  };
}
