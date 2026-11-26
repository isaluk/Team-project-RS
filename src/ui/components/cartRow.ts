import { MAX_QUANTITY, MIN_QUANTITY } from '../../logic/cart';
import { formatPrice } from '../../logic/format';
import type { CartItem, Product } from '../../types';
import { el, imageUrl } from '../dom';
import { icon } from '../icons';
import { createProductTag } from './productCard';

interface CartRowHandlers {
  onIncrement(productId: string): void;
  onDecrement(productId: string): void;
  onRemove(productId: string): void;
}

export function createCartRow(
  item: CartItem,
  product: Product,
  handlers: CartRowHandlers,
): HTMLElement {
  const stepButton = (
    label: string,
    symbol: string,
    key: string,
    disabled: boolean,
    onClick: () => void,
  ): HTMLButtonElement =>
    el('button', {
      class: 'stepper__button',
      text: symbol,
      attrs: {
        type: 'button',
        'aria-label': `${label}: ${product.name}`,
        'data-focus-key': `${key}-${product.id}`,
        disabled,
      },
      on: { click: onClick },
    });

  return el('li', { class: 'cart-row' }, [
    el('div', { class: 'cart-row__product' }, [
      el('img', {
        class: 'cart-row__image',
        attrs: { src: imageUrl(product.image), alt: '', width: 96, height: 96, loading: 'lazy' },
      }),
      el('div', {}, [
        createProductTag(product),
        el('h3', { class: 'cart-row__name', text: product.name }),
      ]),
    ]),
    el('p', { class: 'cart-row__price' }, [
      el('span', { class: 'cart-row__label', text: 'Цена: ' }),
      formatPrice(product.price),
    ]),
    el('div', { class: 'stepper' }, [
      stepButton('Уменьшить количество', '−', 'dec', item.quantity <= MIN_QUANTITY, () => {
        handlers.onDecrement(product.id);
      }),
      el('span', {
        class: 'stepper__value',
        text: String(item.quantity),
        attrs: { 'aria-label': `Количество: ${item.quantity}` },
      }),
      stepButton('Увеличить количество', '+', 'inc', item.quantity >= MAX_QUANTITY, () => {
        handlers.onIncrement(product.id);
      }),
    ]),
    el('p', { class: 'cart-row__sum', text: formatPrice(product.price * item.quantity) }),
    el(
      'button',
      {
        class: 'cart-row__remove',
        attrs: {
          type: 'button',
          'aria-label': `Убрать из котла: ${product.name}`,
          'data-focus-key': `remove-${product.id}`,
        },
        on: {
          click: () => {
            handlers.onRemove(product.id);
          },
        },
      },
      [icon('trash', 18)],
    ),
  ]);
}
