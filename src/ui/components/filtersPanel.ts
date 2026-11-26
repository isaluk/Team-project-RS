import {
  CATEGORIES,
  CATEGORY_LABELS,
  PRODUCTS,
  RARITIES,
  RARITY_LABELS,
} from '../../data/products';
import { countByCategory } from '../../logic/filters';
import { parseDollars } from '../../logic/format';
import type { Category, Filters, Rarity } from '../../types';
import { el } from '../dom';
import { icon } from '../icons';

interface FiltersPanel {
  element: HTMLElement;
  sync(filters: Filters): void;
}

interface FiltersPanelHandlers {
  onChange(patch: Partial<Filters>): void;
  onReset(): void;
}

export function createFiltersPanel({ onChange, onReset }: FiltersPanelHandlers): FiltersPanel {
  const counts = countByCategory(PRODUCTS);

  const searchInput = el('input', {
    class: 'input',
    attrs: {
      type: 'search',
      id: 'filter-search',
      placeholder: 'Найти зелье…',
      autocomplete: 'off',
    },
    on: {
      input: () => {
        onChange({ search: searchInput.value });
      },
    },
  });

  const categoryOptions: { value: Category | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'Все зелья', count: PRODUCTS.length },
    ...CATEGORIES.map((category) => ({
      value: category,
      label: CATEGORY_LABELS[category],
      count: counts[category],
    })),
  ];

  const categoryInputs = categoryOptions.map((option) => {
    const input = el('input', {
      attrs: { type: 'radio', name: 'category', value: option.value },
      on: {
        change: () => {
          onChange({ category: option.value });
        },
      },
    });
    return { option, input };
  });

  const minInput = el('input', {
    class: 'input',
    attrs: {
      type: 'number',
      id: 'filter-min',
      min: 0,
      step: 1,
      placeholder: '0',
      inputmode: 'decimal',
    },
    on: {
      input: () => {
        onChange({ minPrice: parseDollars(minInput.value) });
      },
    },
  });
  const maxInput = el('input', {
    class: 'input',
    attrs: {
      type: 'number',
      id: 'filter-max',
      min: 0,
      step: 1,
      placeholder: '100',
      inputmode: 'decimal',
    },
    on: {
      input: () => {
        onChange({ maxPrice: parseDollars(maxInput.value) });
      },
    },
  });

  let currentRarity: Rarity | 'all' = 'all';
  const rarityButtons = RARITIES.map((rarity) => {
    const button = el('button', {
      class: 'chip',
      text: RARITY_LABELS[rarity],
      attrs: { type: 'button', 'aria-pressed': 'false' },
      on: {
        click: () => {
          onChange({ rarity: currentRarity === rarity ? 'all' : rarity });
        },
      },
    });
    return { rarity, button };
  });

  const body = el('div', { class: 'filters__body', attrs: { id: 'filters-body' } }, [
    el('fieldset', { class: 'filters__group' }, [
      el('legend', { class: 'filters__legend', text: 'Категория' }),
      ...categoryInputs.map(({ option, input }) =>
        el('label', { class: 'radio' }, [
          input,
          option.value !== 'all' &&
            el('span', {
              class: `tag__dot tag__dot--${option.value}`,
              attrs: { 'aria-hidden': 'true' },
            }),
          el('span', { class: 'radio__label', text: option.label }),
          el('span', { class: 'radio__count', text: String(option.count) }),
        ]),
      ),
    ]),
    el('fieldset', { class: 'filters__group' }, [
      el('legend', { class: 'filters__legend', text: 'Цена, $' }),
      el('div', { class: 'price-range' }, [
        el('label', { class: 'price-range__field' }, [el('span', { text: 'от' }), minInput]),
        el('span', { text: '—', attrs: { 'aria-hidden': 'true' } }),
        el('label', { class: 'price-range__field' }, [el('span', { text: 'до' }), maxInput]),
      ]),
    ]),
    el(
      'div',
      { class: 'filters__group', attrs: { role: 'group', 'aria-labelledby': 'rarity-legend' } },
      [
        el('p', { class: 'filters__legend', text: 'Редкость', attrs: { id: 'rarity-legend' } }),
        el(
          'div',
          { class: 'chips' },
          rarityButtons.map(({ button }) => button),
        ),
      ],
    ),
    el('button', {
      class: 'btn btn--outline btn--block',
      text: 'Сбросить фильтры',
      attrs: { type: 'button' },
      on: { click: onReset },
    }),
  ]);

  const toggle = el(
    'button',
    {
      class: 'btn btn--outline btn--block filters__toggle',
      attrs: { type: 'button', 'aria-controls': 'filters-body', 'aria-expanded': 'false' },
      on: {
        click: () => {
          const open = body.dataset.open !== 'true';
          body.dataset.open = String(open);
          toggle.setAttribute('aria-expanded', String(open));
        },
      },
    },
    [icon('filter', 16), el('span', { text: 'Фильтры' })],
  );

  const element = el('aside', { class: 'filters', attrs: { 'aria-label': 'Фильтры каталога' } }, [
    el('div', { class: 'search-field' }, [
      el('label', {
        class: 'visually-hidden',
        text: 'Поиск по названию',
        attrs: { for: 'filter-search' },
      }),
      icon('search', 18),
      searchInput,
    ]),
    toggle,
    body,
    el('div', { class: 'promo-hint' }, [
      el('p', { class: 'promo-hint__label', text: 'Тайный промокод' }),
      el('p', { class: 'promo-hint__code', text: 'ALCHEMY10' }),
      el('p', { class: 'promo-hint__text', text: 'Скидка 10% на весь котёл. Дважды не варится.' }),
    ]),
  ]);

  const syncPrice = (input: HTMLInputElement, value: number | null): void => {
    if (parseDollars(input.value) !== value) {
      input.value = value === null ? '' : String(value / 100);
    }
  };

  return {
    element,
    sync(filters) {
      if (searchInput.value !== filters.search) {
        searchInput.value = filters.search;
      }
      for (const { option, input } of categoryInputs) {
        input.checked = option.value === filters.category;
      }
      syncPrice(minInput, filters.minPrice);
      syncPrice(maxInput, filters.maxPrice);

      currentRarity = filters.rarity;
      for (const { rarity, button } of rarityButtons) {
        button.setAttribute('aria-pressed', String(rarity === filters.rarity));
      }
    },
  };
}
