import { PRODUCTS } from '../../data/products';
import { decrementQuantity, incrementQuantity, removeFromCart } from '../../logic/cart';
import { pluralize } from '../../logic/format';
import { validatePromo } from '../../logic/promo';
import { toHash } from '../../logic/route';
import { calculateTotals } from '../../logic/totals';
import type { Store } from '../../state/store';
import type { AppState, CartItem } from '../../types';
import { createCartRow } from '../components/cartRow';
import { createCartSummary } from '../components/cartSummary';
import { createEmptyState } from '../components/emptyState';
import { createPageTitle } from '../components/pageTitle';
import { createPromoForm } from '../components/promoForm';
import { el, replaceKeepingFocus } from '../dom';
import type { Page } from '../router';

const productById = new Map(PRODUCTS.map((product) => [product.id, product]));

function describeCount(count: number): string {
  if (count === 0) {
    return 'В котле пока пусто';
  }
  const noun = pluralize(count, ['зелье', 'зелья', 'зелий']);
  const verb = pluralize(count, ['ждёт', 'ждут', 'ждут']);
  return `${count} ${noun} ${verb} своего часа`;
}

export function createCartPage(store: Store<AppState>): Page {
  let isOrdered = false;

  const updateCart = (change: (cart: CartItem[]) => CartItem[]): void => {
    store.setState((state) => ({ ...state, cart: change(state.cart) }));
  };

  const promoForm = createPromoForm((input) => {
    const result = validatePromo(input);

    if (!result.ok) {
      promoForm.setMessage(
        'error',
        result.error === 'empty'
          ? 'Введите промокод.'
          : `«${input.trim()}» — такого заклинания мы не знаем.`,
      );
      return;
    }

    const { promo } = result;
    if (store.getState().promo?.code === promo.code) {
      promoForm.setMessage(
        'success',
        `Промокод ${promo.code} уже применён. Скидка не суммируется.`,
      );
      return;
    }

    store.setState((state) => ({ ...state, promo }));
    promoForm.setValue(promo.code);
    promoForm.setMessage('success', `Скидка ${promo.percent}% применена. Повторно не суммируется.`);
  });

  const removePromo = (): void => {
    store.setState((state) => ({ ...state, promo: null }));
    promoForm.setValue('');
    promoForm.clearMessage();
  };

  const checkout = (): void => {
    isOrdered = true;
    store.setState((state) => ({ ...state, cart: [], promo: null }));
  };

  const title = createPageTitle('Котёл', 'Ваш котёл', '');
  const list = el('ul', { class: 'cart-list' });
  const summarySlot = el('div', { class: 'cart__aside' });
  const emptySlot = el('div', { class: 'container cart-empty' });

  const layout = el('div', { class: 'container cart' }, [
    el('div', { class: 'cart__main' }, [
      el('div', { class: 'cart-table' }, [
        el('div', { class: 'cart-table__head', attrs: { 'aria-hidden': 'true' } }, [
          el('span', { text: 'Зелье' }),
          el('span', { text: 'Цена' }),
          el('span', { text: 'Количество' }),
          el('span', { text: 'Сумма' }),
          el('span'),
        ]),
        list,
      ]),
      promoForm.element,
      el('a', {
        class: 'back-link',
        text: '←  Продолжить покупки',
        attrs: { href: toHash('catalog') },
      }),
    ]),
    summarySlot,
  ]);

  const render = (state: AppState): void => {
    const totals = calculateTotals(state.cart, PRODUCTS, state.promo);
    title.setSubtitle(describeCount(totals.count));

    const isEmpty = state.cart.length === 0;
    layout.hidden = isEmpty;
    emptySlot.hidden = !isEmpty;

    if (isEmpty) {
      emptySlot.replaceChildren(
        createEmptyState(
          isOrdered
            ? {
                title: 'Заказ отправлен совой',
                text: 'Спасибо! Зелья уже летят к вам. Сова не кусается, но угощение любит.',
                action: { label: 'Вернуться в каталог  →', href: toHash('catalog') },
              }
            : {
                title: 'Котёл пуст, как у ленивого алхимика',
                text: 'Загляните в каталог: там найдётся зелье на любой случай жизни.',
                action: { label: 'Перейти в каталог  →', href: toHash('catalog') },
              },
        ),
      );
      return;
    }

    const rows: HTMLElement[] = [];
    for (const item of state.cart) {
      const product = productById.get(item.productId);
      if (!product) {
        continue;
      }
      rows.push(
        createCartRow(item, product, {
          onIncrement: (id) => {
            updateCart((cart) => incrementQuantity(cart, id));
          },
          onDecrement: (id) => {
            updateCart((cart) => decrementQuantity(cart, id));
          },
          onRemove: (id) => {
            updateCart((cart) => removeFromCart(cart, id));
          },
        }),
      );
    }
    replaceKeepingFocus(list, rows);

    replaceKeepingFocus(summarySlot, [
      createCartSummary(totals, state.promo, { onCheckout: checkout, onRemovePromo: removePromo }),
    ]);
  };

  const initialPromo = store.getState().promo;
  if (initialPromo) {
    promoForm.setValue(initialPromo.code);
    promoForm.setMessage('success', `Скидка ${initialPromo.percent}% применена.`);
  }

  const element = el('div', { class: 'page page--cart' }, [title.element, layout, emptySlot]);

  render(store.getState());
  const unsubscribe = store.subscribe(render);

  return { element, destroy: unsubscribe };
}
