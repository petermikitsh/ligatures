import * as fontkit from "fontkit";

const getLigatures = (font: fontkit.Font): string[] => {
  // @ts-ignore
  if (!font.GSUB) {
    return [];
  }

  // @ts-ignore
  const lookupLists = font.GSUB.lookupList.toArray();

  return lookupLists.reduce((acc0, lookupList) => {
    // Table Type 4 is ligature substitutions:
    // https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#lookuptype-4-ligature-substitution-subtable
    if (lookupList.lookupType != 4) {
      return acc0;
    }

    const {
      coverage: { glyphs, rangeRecords },
      ligatureSets,
    } = lookupList.subTables[0];

    const leadingChars: string[] = rangeRecords
      ? rangeRecords.reduce(
          (acc1, { start, end }) => [
            ...acc1,
            ...Array.from(Array(end - start + 1), (_, x) => x + start).map(
              (i) => font.stringsForGlyph(i)[0]
            ),
          ],
          []
        )
      : glyphs.map((glyph) => {
          const result = font.stringsForGlyph(glyph);
          return result.join("");
        });

    return [
      ...acc0,
      ...ligatureSets.toArray().reduce(
        (acc2, ligatureSet, index) => [
          ...acc2,
          ...ligatureSet.reduce((acc3, ligature) => {
            const fullLigature =
              leadingChars[index] +
              ligature.components
                .map((x) => font.stringsForGlyph(x)[0])
                .join("");
            return [...acc3, fullLigature].filter(Boolean);
          }, []),
        ],
        []
      ),
    ];
  }, []);
};

export const getLigaturesFromPath = (
  fontFilePath: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fontkit.default.open(fontFilePath, null, (err, font) => {
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

export const getLigaturesFromBuffer = (fontFileBuffer: Buffer): string[] => {
  const font = fontkit.default.create(fontFileBuffer);
  return getLigatures(font);
};
