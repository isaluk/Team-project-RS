import './styles/index.css';
import { PRODUCTS } from './data/products';
import { DEFAULT_FILTERS } from './logic/filters';
import { parseHash } from './logic/route';
import { getBrowserStorage, loadCart, saveCart } from './state/storage';
import { createStore } from './state/store';
import type { AppState } from './types';
import { renderFooter } from './ui/footer';
import { renderHeader } from './ui/header';
import { initRouter } from './ui/router';
function requireElement(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`В index.html нет элемента ${selector}`);
  }
  return element;
}

const storage = getBrowserStorage();
const knownIds = PRODUCTS.map((product) => product.id);

const store = createStore<AppState>({
  route: parseHash(window.location.hash),
  cart: loadCart(storage, knownIds),
  filters: DEFAULT_FILTERS,
  promo: null,
});

let savedCart = store.getState().cart;
store.subscribe((state) => {
  if (state.cart !== savedCart) {
    savedCart = state.cart;
    saveCart(storage, state.cart);
  }
});

renderHeader(requireElement('#header'), store);
renderFooter(requireElement('#footer'));
initRouter(requireElement('#main'), store);
