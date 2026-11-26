import { PRODUCTS } from '../../data/products';
import { addToCart, getQuantity } from '../../logic/cart';
import { DEFAULT_FILTERS, applyFilters } from '../../logic/filters';
import { pluralize } from '../../logic/format';
import type { Store } from '../../state/store';
import type { AppState, Filters, SortMode } from '../../types';
import { createEmptyState } from '../components/emptyState';
import { createFiltersPanel } from '../components/filtersPanel';
import { createPageTitle } from '../components/pageTitle';
import { createProductCard } from '../components/productCard';
import { el, replaceKeepingFocus } from '../dom';
import type { Page } from '../router';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'default', label: 'по умолчанию' },
  { value: 'price-asc', label: 'сначала дешёвые' },
  { value: 'price-desc', label: 'сначала дорогие' },
];

function isSortMode(value: string): value is SortMode {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function createCatalogPage(store: Store<AppState>): Page {
  const changeFilters = (patch: Partial<Filters>): void => {
    store.setState((state) => ({ ...state, filters: { ...state.filters, ...patch } }));
  };
  const resetFilters = (): void => {
    store.setState((state) => ({ ...state, filters: DEFAULT_FILTERS }));
  };
  const handleAdd = (productId: string): void => {
    store.setState((state) => ({ ...state, cart: addToCart(state.cart, productId) }));
  };

  const panel = createFiltersPanel({ onChange: changeFilters, onReset: resetFilters });

  const found = el('p', { class: 'toolbar__found', attrs: { role: 'status' } });

  const sortSelect = el(
    'select',
    {
      class: 'input select',
      attrs: { id: 'sort' },
      on: {
        change: () => {
          if (isSortMode(sortSelect.value)) {
            changeFilters({ sort: sortSelect.value });
          }
        },
      },
    },
    SORT_OPTIONS.map((option) =>
      el('option', { text: option.label, attrs: { value: option.value } }),
    ),
  );

  const grid = el('div', { class: 'product-grid' });

  const render = (state: AppState): void => {
    const products = applyFilters(PRODUCTS, state.filters);

    panel.sync(state.filters);
    sortSelect.value = state.filters.sort;
    found.textContent =
      products.length === 0
        ? 'Ничего не найдено'
        : `Найдено: ${products.length} ${pluralize(products.length, ['зелье', 'зелья', 'зелий'])}`;

    if (products.length === 0) {
      grid.classList.add('product-grid--empty');
      grid.replaceChildren(
        createEmptyState({
          title: 'Таких зелий мы ещё не варили',
          text: 'Попробуйте изменить запрос или сбросить фильтры.',
          action: { label: 'Сбросить фильтры', onClick: resetFilters },
        }),
      );
      return;
    }

    grid.classList.remove('product-grid--empty');
    replaceKeepingFocus(
      grid,
      products.map((product) =>
        createProductCard(product, getQuantity(state.cart, product.id), handleAdd),
      ),
    );
  };

  const title = createPageTitle(
    'Каталог',
    'Каталог зелий',
    'Восемь зелий на любой случай жизни — от понедельника до любви.',
  );

  const element = el('div', { class: 'page page--catalog' }, [
    title.element,
    el('div', { class: 'container catalog' }, [
      panel.element,
      el('section', { class: 'catalog__content', attrs: { 'aria-label': 'Список зелий' } }, [
        el('div', { class: 'toolbar' }, [
          found,
          el('div', { class: 'toolbar__sort' }, [
            el('label', { text: 'Сортировка:', attrs: { for: 'sort' } }),
            sortSelect,
          ]),
        ]),
        grid,
      ]),
    ]),
  ]);

  render(store.getState());
  const unsubscribe = store.subscribe(render);

  return { element, destroy: unsubscribe };
}
