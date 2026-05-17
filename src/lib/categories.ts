export interface CategoryDef {
  label: string;
  tone: 'sage' | 'peach' | 'periwinkle' | 'pink' | 'brown';
}

export const CATEGORIES: Record<string, CategoryDef> = {
  imunitet: { label: 'Имунитет', tone: 'sage' },
  hranene: { label: 'Хранене', tone: 'peach' },
  razvitie: { label: 'Развитие', tone: 'periwinkle' },
  psihologia: { label: 'Психология', tone: 'pink' },
  imunizacii: { label: 'Имунизации', tone: 'sage' },
  speshni: { label: 'Спешни ситуации', tone: 'peach' },
  obshto: { label: 'Общо', tone: 'brown' }
};
