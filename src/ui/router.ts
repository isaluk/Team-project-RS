import { parseHash } from '../logic/route';
import type { Store } from '../state/store';
import type { AppState, Route } from '../types';
import { createAboutPage } from './pages/about';
import { createCartPage } from './pages/cart';
import { createCatalogPage } from './pages/catalog';

export interface Page {
  element: HTMLElement;
  destroy(): void;
}

type PageFactory = ((store: Store<AppState>) => Page) | (() => void);

const PAGES: Record<Route, PageFactory> = {
  about: createAboutPage,
  catalog: createCatalogPage,
  cart: createCartPage,
};

const TITLES: Record<Route, string> = {
  about: 'Лавка зелий — о нас',
  catalog: 'Каталог — Лавка зелий',
  cart: 'Котёл — Лавка зелий',
};

export function initRouter(root: HTMLElement, store: Store<AppState>): void {
  let currentPage: Page | null = null;
  let currentRoute: Route | null = null;

  const show = (route: Route, isNavigation: boolean): void => {
    if (route === currentRoute) {
      return;
    }
    currentPage?.destroy();
    currentPage = PAGES[route](store) ?? null;
    currentRoute = route;

    if (currentPage) {
      root.replaceChildren(currentPage.element);
    } else {
      root.replaceChildren();
    }

    document.title = TITLES[route];

    if (isNavigation) {
      window.scrollTo(0, 0);
      root.focus({ preventScroll: true });
    }
  };

  window.addEventListener('hashchange', () => {
    const route = parseHash(window.location.hash);
    store.setState((state) => (state.route === route ? state : { ...state, route }));
  });

  store.subscribe((state) => {
    show(state.route, true);
  });
  show(store.getState().route, false);
}
