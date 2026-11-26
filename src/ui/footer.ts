import { TEAM } from '../data/team';
import { toHash } from '../logic/route';
import { el } from './dom';

export function renderFooter(root: HTMLElement): void {
  const links = el(
    'nav',
    { class: 'footer__links', attrs: { 'aria-label': 'Навигация в подвале' } },
    [
      el('a', { text: 'О нас', attrs: { href: toHash('about') } }),
      el('a', { text: 'Каталог', attrs: { href: toHash('catalog') } }),
      el('a', { text: 'Котёл', attrs: { href: toHash('cart') } }),
    ],
  );

  const brand = el('div', { class: 'footer__brand' }, [
    el('span', { class: 'footer__name', text: 'Лавка зелий' }),
    el('span', { class: 'footer__tagline', text: 'варим чудеса с 1847 года' }),
  ]);

  const team = el(
    'div',
    { class: 'footer__team' },
    TEAM.map((member) =>
      el('a', {
        text: `GitHub: ${member.github}`,
        attrs: { href: `https://github.com/${member.github}`, target: '_blank', rel: 'noopener' },
      }),
    ),
  );

  root.replaceChildren(
    el('div', { class: 'container footer__inner' }, [
      el('div', { class: 'footer__row' }, [links, brand, team]),
      el('p', {
        class: 'footer__copy',
        text: '© 2026 Лавка зелий · учебный проект RS School · TypeScript + Vite',
      }),
    ]),
  );
}
