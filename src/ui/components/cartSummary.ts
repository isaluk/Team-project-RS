import { formatPrice } from '../../logic/format';
import type { CartTotals, PromoCode } from '../../types';
import { el } from '../dom';
import { star } from '../icons';

interface CartSummaryHandlers {
  onCheckout(): void;
  onRemovePromo(): void;
}

function createLine(label: string, value: string, modifier = ''): HTMLElement {
  return el('div', { class: `summary__line ${modifier}`.trim() }, [
    el('dt', { text: label }),
    el('dd', { text: value }),
  ]);
}

export function createCartSummary(
  totals: CartTotals,
  promo: PromoCode | null,
  handlers: CartSummaryHandlers,
): HTMLElement {
  return el('section', { class: 'summary', attrs: { 'aria-labelledby': 'summary-title' } }, [
    el('h2', { class: 'summary__title', attrs: { id: 'summary-title' } }, ['Итого', star(14)]),
    el('dl', { class: 'summary__lines' }, [
      createLine('Зелий в котле', `${totals.count} шт.`),
      createLine('Сумма', formatPrice(totals.subtotal)),
      promo &&
        createLine(
          `Скидка · ${promo.code}`,
          `−${formatPrice(totals.discount)}`,
          'summary__line--discount',
        ),
    ]),
    promo &&
      el('button', {
        class: 'summary__remove-promo',
        text: 'Убрать промокод',
        attrs: { type: 'button', 'data-focus-key': 'remove-promo' },
        on: { click: handlers.onRemovePromo },
      }),
    el('div', { class: 'summary__total' }, [
      el('span', { class: 'summary__total-label', text: 'К оплате' }),
      el('span', { class: 'summary__total-value', text: formatPrice(totals.total) }),
    ]),
    el('button', {
      class: 'btn btn--block',
      text: 'Оформить заказ  →',
      attrs: { type: 'button', 'data-focus-key': 'checkout' },
      on: { click: handlers.onCheckout },
    }),
    el('p', { class: 'summary__note', text: 'Доставка совой — бесплатно. Сова не кусается.' }),
  ]);
}
