import type { Category, Product, Rarity } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'vigor',
    name: 'Эликсир бодрости',
    category: 'healing',
    rarity: 'common',
    price: 1500,
    image: 'vigor',
    description: '+100 к бодрости на три часа. Без кофеина, но с солнцем.',
  },
  {
    id: 'invisibility',
    name: 'Зелье невидимости',
    category: 'magic',
    rarity: 'legendary',
    price: 9000,
    image: 'invisibility',
    description: 'Исчезните с созвона, который мог быть письмом.',
  },
  {
    id: 'monday',
    name: 'Настойка вечного понедельника',
    category: 'cursed',
    rarity: 'common',
    price: 199,
    image: 'monday',
    description: 'Для врагов. Время идёт, а неделя не кончается.',
  },
  {
    id: 'courage',
    name: 'Отвар смелости',
    category: 'magic',
    rarity: 'rare',
    price: 4500,
    image: 'courage',
    description: 'Одна капля перед собеседованием — и вы лев.',
  },
  {
    id: 'love',
    name: 'Эликсир «Роза и жемчуг»',
    category: 'love',
    rarity: 'rare',
    price: 6200,
    image: 'love',
    description: 'Нежный аромат. Взаимность в комплект не входит.',
  },
  {
    id: 'deadline',
    name: 'Зелье «Ещё пять минут»',
    category: 'healing',
    rarity: 'common',
    price: 3300,
    image: 'deadline',
    description: 'Песок течёт вверх, а дедлайн отодвигается.',
  },
  {
    id: 'inspiration',
    name: 'Порошок вдохновения',
    category: 'magic',
    rarity: 'rare',
    price: 2800,
    image: 'inspiration',
    description: 'Щепотка звёздной пыли на чистый лист.',
  },
  {
    id: 'bugfix',
    name: 'Капли от багов',
    category: 'cursed',
    rarity: 'common',
    price: 1990,
    image: 'bugfix',
    description: 'Три капли в код — и жук на спине. Проверено тестами.',
  },
];

/** Products shown in the "Featured potions" block on the home page. */
export const FEATURED_IDS: string[] = ['vigor', 'invisibility', 'courage', 'bugfix'];

export const CATEGORIES: Category[] = ['healing', 'magic', 'cursed', 'love'];

export const CATEGORY_LABELS: Record<Category, string> = {
  healing: 'Лечебные',
  magic: 'Магические',
  cursed: 'Проклятые',
  love: 'Любовные',
};

export const RARITIES: Rarity[] = ['common', 'rare', 'legendary'];

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'обычное',
  rare: 'редкое',
  legendary: 'легендарное',
};
