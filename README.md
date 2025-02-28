# Introduce

fork repository from [shiki-transformer-copy-button](https://github.com/joshnuss/shiki-transformer-copy-button) with filtering options

## Options

| Option           | Description                                                                                                                                                                                                                                                                                                     | Default Value |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **duration**     | **delay time** from **'copied'** state back to normal state                                                                                                                                                                                                                                                     | 3000          |
| **filterFocus**  | **excludes** the contents of **'span' line** that **includes** the **'remove' class** when **copying**, which could be added by [transformerNotationDiff](https://shiki.style/packages/transformers#transformernotationdiff) from [@shikijs/transformers](https://shiki.style/packages/transformers)            | true          |
| **filterRemove** | **excludes** the contents of **'span' line** that **does not include** the **'focused' class** when **copying**, which could be added by [transformerNotationFocus](https://shiki.style/packages/transformers#transformernotationfocus) from [@shikijs/transformers](https://shiki.style/packages/transformers) | true          |

## Example

```ts
// the lines that have [!code --] comment will not be copied when copying
console.log("removed line"); // [!code --] // this line will not be copied
console.log("added line"); // [!code ++]
```

```ts
// the lines that do NOT have [!code focus] comment will not be copied when copying
console.log("not that important informations"); // this line will not be copied
console.log("important information!"); // [!code focus]
```

```ts
// the lines that have [!code --] or
// the lines that are NOT included the range of [!code focus:number] will not be copied when copying(the number includes self line)

// [!code focus:5]
function greet(name: string) {
  console.log(`ByeBye ${name}! 👋`); // [!code --]
  console.log(`Hey ${name}! 👋`); // [!code ++]
}
greet("John Doe"); // this line will not be copied
```

# Install

```shell
pnpm i -D shiki-transformer-filtered-copy-button
```

# Add Transformer

```js
import { addCopyButton } from "shiki-transformer-filtered-copy-button";

// optional
const options = {
  duration: 2000,
  filterRemove: true,
  filterFocus: true,
};

export async function highlight(code, lang) {
  return await codeToHtml(code, {
    lang,
    transformers: [addCopyButton(options)],
  });
}
```

# Style

Add some basic styling:

```css
pre:has(code) {
  position: relative;
}

pre button.copy {
  position: absolute;
  right: 16px;
  top: 16px;
  height: 28px;
  width: 28px;
  padding: 0;
  display: flex;

  & span {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  & .ready {
    background-image: url(/icons/copy.svg);
  }

  & .success {
    display: none;
    background-image: url(/icons/copy-success.svg);
  }

  &.copied {
    & .success {
      display: block;
    }

    & .ready {
      display: none;
    }
  }
}
```

# License

MIT
