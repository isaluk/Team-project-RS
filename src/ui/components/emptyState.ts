import { el } from '../dom';

interface EmptyStateOptions {
  title: string;
  text: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function createEmptyState({ title, text, action }: EmptyStateOptions): HTMLElement {
  let actionElement: HTMLElement | null = null;
  if (action?.href) {
    actionElement = el('a', { class: 'btn', text: action.label, attrs: { href: action.href } });
  } else if (action?.onClick) {
    actionElement = el('button', {
      class: 'btn btn--outline',
      text: action.label,
      attrs: { type: 'button' },
      on: { click: action.onClick },
    });
  }

  return el('div', { class: 'empty-state' }, [
    el('p', { class: 'empty-state__title', text: title }),
    el('p', { class: 'empty-state__text', text }),
    actionElement,
  ]);
}
