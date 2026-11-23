import { el } from '../dom';
import { star, tornEdge } from '../icons';

interface PageTitle {
  element: HTMLElement;
  setSubtitle(text: string): void;
}

export function createPageTitle(crumb: string, title: string, subtitle: string): PageTitle {
  const subtitleElement = el('p', { class: 'page-title__subtitle', text: subtitle });

  const element = el('div', { class: 'page-title' }, [
    el('div', { class: 'container page-title__inner' }, [
      el('p', { class: 'page-title__crumb', text: `Главная  /  ${crumb}` }),
      el('h1', { class: 'page-title__heading' }, [title, star(16)]),
      subtitleElement,
    ]),
    tornEdge(),
  ]);

  return {
    element,
    setSubtitle(text) {
      subtitleElement.textContent = text;
    },
  };
}
