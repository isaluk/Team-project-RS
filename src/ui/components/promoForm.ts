import { el } from '../dom';

export type PromoMessageKind = 'success' | 'error';

interface PromoForm {
  element: HTMLElement;
  setValue(value: string): void;
  setMessage(kind: PromoMessageKind, text: string): void;
  clearMessage(): void;
}

export function createPromoForm(onApply: (input: string) => void): PromoForm {
  const input = el('input', {
    class: 'input promo__input',
    attrs: {
      type: 'text',
      id: 'promo-code',
      autocomplete: 'off',
      autocapitalize: 'characters',
      spellcheck: 'false',
      'aria-describedby': 'promo-message',
    },
  });

  const message = el('p', {
    class: 'promo__message',
    attrs: { id: 'promo-message', role: 'status' },
  });

  const element = el(
    'form',
    {
      class: 'promo',
      attrs: { novalidate: true },
      on: {
        submit: (event) => {
          event.preventDefault();
          onApply(input.value);
        },
      },
    },
    [
      el('label', { class: 'promo__label', text: 'Промокод', attrs: { for: 'promo-code' } }),
      el('div', { class: 'promo__row' }, [
        input,
        el('button', { class: 'btn', text: 'Применить', attrs: { type: 'submit' } }),
      ]),
      message,
    ],
  );

  return {
    element,
    setValue(value) {
      input.value = value;
    },
    setMessage(kind, text) {
      message.textContent = text;
      message.dataset.kind = kind;
      input.setAttribute('aria-invalid', String(kind === 'error'));
    },
    clearMessage() {
      message.textContent = '';
      delete message.dataset.kind;
      input.removeAttribute('aria-invalid');
    },
  };
}
