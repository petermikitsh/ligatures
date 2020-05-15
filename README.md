# ligatures

Uses [fontkit] to get an array of ligatures for a font. Useful for icon fonts.

```
npm i ligatures
```

## Example

```js
const ligatures = require('ligatures');
console.log(getLigatures('matIconFont.woff').join(", "));
// [3d_rotation, 360, desktop_access_disabled, domain_verification, ...]
});
```

## API

```ts
export declare const getLigaturesFromPath: (
  fontFilePath: string
) => Promise<string[]>;

export declare const getLigaturesFromBuffer: (
  fontFileBuffer: Buffer
) => string[];
```

## Why?

If you're creating design systems, you may have a component specifically for rendering icons, and that component may depend on a font file that uses ligatures to display icons.

You may want to create a TypeScript interface of the union of all possible ligatures for your font, providing intelliense and a generally superior developer experience to the consumers of your design system.

[fontkit]: https://github.com/foliojs/fontkit
