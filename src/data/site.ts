// Los datos viven en collage.json. Edítalo con la herramienta: npm run curate
import data from './collage.json';

export const site = {
  ...data.meta,
  age: (data.meta.age ?? null) as number | null,
  chapters: data.categories.map((c, i) => ({ num: i + 1, title: c.title, note: c.note, photos: c.photos })),
  captions: data.captions as Record<string, string>,
};
