import { getCartCount } from '../logic/cart';
import { pluralize } from '../logic/format';
import { toHash } from '../logic/route';
import type { Store } from '../state/store';
import type { AppState, Route } from '../types';
import { el } from './dom';
import { icon, star } from './icons';

const NAV_ITEMS: { route: Route; label: string }[] = [
  { route: 'about', label: 'О нас' },
  { route: 'catalog', label: 'Каталог' },
];

export function renderHeader(root: HTMLElement, store: Store<AppState>): void {
  const links = NAV_ITEMS.map(({ route, label }) => ({
    route,
    element: el('a', { class: 'nav__link', text: label, attrs: { href: toHash(route) } }),
  }));

  const nav = el(
    'nav',
    { class: 'nav', attrs: { id: 'site-nav', 'aria-label': 'Основная навигация' } },
    links.map((link) => link.element),
  );

  const burger = el(
    'button',
    {
      class: 'burger',
      attrs: { type: 'button', 'aria-controls': 'site-nav', 'aria-expanded': 'false' },
    },
    [icon('menu', 24), el('span', { class: 'visually-hidden', text: 'Меню' })],
  );

  const setMenuOpen = (open: boolean): void => {
    nav.dataset.open = String(open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => {
    setMenuOpen(nav.dataset.open !== 'true');
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.dataset.open === 'true') {
      setMenuOpen(false);
      burger.focus();
    }
  });

  const logo = el('a', { class: 'logo', attrs: { href: toHash('about') } }, [
    el('span', { class: 'logo__name' }, [star(14), 'Лавка зелий', star(14)]),
    el('span', { class: 'logo__tagline', text: 'алхимия для жизни, полной чудес' }),
  ]);

  const badge = el('span', { class: 'badge', attrs: { 'aria-hidden': 'true' } });
  const cartLabel = el('span', { class: 'visually-hidden' });
  const cartLink = el('a', { class: 'header__cart', attrs: { href: toHash('cart') } }, [
    icon('cart', 20),
    el('span', { class: 'header__cart-text', text: 'Котёл', attrs: { 'aria-hidden': 'true' } }),
    badge,
    cartLabel,
  ]);

  let shownRoute = store.getState().route;

  const update = (state: AppState): void => {
    if (state.route !== shownRoute) {
      shownRoute = state.route;
      setMenuOpen(false);
    }

    const count = getCartCount(state.cart);
    badge.textContent = String(count);
    badge.hidden = count === 0;
    cartLabel.textContent =
      count === 0
        ? 'Котёл пуст'
        : `Котёл: ${count} ${pluralize(count, ['зелье', 'зелья', 'зелий'])}`;

    for (const link of links) {
      if (link.route === state.route) {
        link.element.setAttribute('aria-current', 'page');
      } else {
        link.element.removeAttribute('aria-current');
      }
    }
    if (state.route === 'cart') {
      cartLink.setAttribute('aria-current', 'page');
    } else {
      cartLink.removeAttribute('aria-current');
    }
  };

  root.replaceChildren(
    el('div', { class: 'container header__inner' }, [
      el('div', { class: 'header__left' }, [burger, nav]),
      logo,
      cartLink,
    ]),
  );
  setMenuOpen(false);
  update(store.getState());
  store.subscribe(update);
}
