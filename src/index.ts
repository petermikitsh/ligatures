import * as opentype from "opentype.js";

const getLigatures = (font: opentype.Font): string[] => {
  const { glyphIndexMap } = font.tables.cmap;
  const glyphs = Object.entries(glyphIndexMap).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [String(value)]: key,
    };
  }, {});
  const { ligatureSets, coverage } = font.tables.gsub.lookups[0].subtables[0];
  const ligatures = ligatureSets.reduce((acc, set, index) => {
    const firstChar = String.fromCharCode(glyphs[coverage.glyphs[index]]);
    return [
      ...acc,
      ...set.map((ligature) => {
        const name = ligature.components
          .map((component) => String.fromCharCode(glyphs[component]))
          .join("");
        return firstChar + name;
      }),
    ];
  }, []);
  return ligatures;
};

export const getLigaturesFromPath = (
  fontFilePath: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    opentype.load(fontFilePath, (err, font) => {
      if (err) {
        reject(err);
      }
      try {
        resolve(getLigatures(font));
      } catch (e) {
        reject(e);
      }
    });
  });
};

export const getLigaturesFromBuffer = (
  fontFileBuffer: ArrayBuffer
): string[] => {
  const font = opentype.parse(fontFileBuffer);
  return getLigatures(font);
};
