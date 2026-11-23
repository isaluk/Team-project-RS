import { CATEGORY_LABELS, RARITY_LABELS } from '../../data/products';
import { formatPrice } from '../../logic/format';
import type { Product } from '../../types';
import { el, imageUrl } from '../dom';
import { icon } from '../icons';

export function createProductTag(product: Product): HTMLElement {
  return el('p', { class: 'tag' }, [
    el('span', {
      class: `tag__dot tag__dot--${product.category}`,
      attrs: { 'aria-hidden': 'true' },
    }),
    el('span', { class: 'tag__category', text: CATEGORY_LABELS[product.category] }),
    el('span', { class: 'tag__rarity', text: `· ${RARITY_LABELS[product.rarity]}` }),
  ]);
}

export function createProductCard(
  product: Product,
  quantityInCart: number,
  onAdd: (productId: string) => void,
): HTMLElement {
  const inCart = quantityInCart > 0;

  const button = el(
    'button',
    {
      class: inCart ? 'add-button add-button--active' : 'add-button',
      attrs: {
        type: 'button',
        'data-focus-key': `add-${product.id}`,
        'aria-label': inCart
          ? `${product.name}: в котле ${quantityInCart}, добавить ещё`
          : `Добавить в котёл: ${product.name}`,
      },
      on: {
        click: () => {
          onAdd(product.id);
        },
      },
    },
    [icon('cart', 16), el('span', { text: inCart ? `В котле · ${quantityInCart}` : 'В котёл' })],
  );

  return el('article', { class: 'card' }, [
    el('img', {
      class: 'card__image',
      attrs: {
        src: imageUrl(product.image),
        alt: '',
        width: 800,
        height: 800,
        loading: 'lazy',
        decoding: 'async',
      },
    }),
    el('div', { class: 'card__body' }, [
      createProductTag(product),
      el('h3', { class: 'card__name', text: product.name }),
      el('p', { class: 'card__description', text: product.description }),
      el('div', { class: 'card__footer' }, [
        el('span', { class: 'card__price', text: formatPrice(product.price) }),
        button,
      ]),
    ]),
  ]);
}
