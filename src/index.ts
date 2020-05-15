import fontkit, { Font } from "fontkit";

const getLigatures = (font: Font): string[] => {
  const {
    coverage: { rangeRecords },
    ligatureSets,
    // @ts-ignore
  } = font.GSUB.lookupList.toArray()[0].subTables[0];

  const leadingChars: string[] = rangeRecords.reduce(
    (acc, { start, end }) => [
      ...acc,
      ...Array.from(Array(end - start + 1), (_, x) => x + start).map(
        (i) => font.stringsForGlyph(i)[0]
      ),
    ],
    []
  );

  return ligatureSets.toArray().reduce(
    (acc, ligatureSet, index) => [
      ...acc,
      ...ligatureSet.reduce((acc, ligature) => {
        return [
          ...acc,
          leadingChars[index] +
            ligature.components.map((x) => font.stringsForGlyph(x)[0]).join(""),
        ];
      }, []),
    ],
    []
  );
};

export const getLigaturesFromPath = (
  fontFilePath: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fontkit.open(fontFilePath, null, (err, font) => {
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
  const font = fontkit.create(fontFileBuffer);
  return getLigatures(font);
};
