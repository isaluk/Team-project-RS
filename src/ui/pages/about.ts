import { FEATURED_IDS, PRODUCTS } from '../../data/products';
import { TEAM, type TeamMember } from '../../data/team';
import { addToCart, getQuantity } from '../../logic/cart';
import { toHash } from '../../logic/route';
import type { Store } from '../../state/store';
import type { AppState } from '../../types';
import { createProductCard } from '../components/productCard';
import { el, imageUrl, replaceKeepingFocus } from '../dom';
import { star, tornEdge } from '../icons';
import type { Page } from '../router';

const FEATURED = PRODUCTS.filter((product) => FEATURED_IDS.includes(product.id));

function createHero(): HTMLElement {
  return el('section', { class: 'hero' }, [
    el('img', {
      class: 'hero__image',
      attrs: { src: imageUrl('hero'), alt: '', width: 1536, height: 1024 },
    }),
    el('div', { class: 'hero__content' }, [
      el('p', { class: 'eyebrow eyebrow--gold' }, [
        star(),
        'алхимическая лавка · с 1847 года',
        star(),
      ]),
      el('h1', { class: 'hero__title', text: 'Зелья для жизни, полной чудес' }),
      el('p', {
        class: 'hero__lead',
        text: 'Редкости, нелепости и маленькие чудеса, которые вам не нужны, но очень хочется.',
      }),
      el('a', { class: 'btn', text: 'Перейти в каталог  →', attrs: { href: toHash('catalog') } }),
    ]),
    el('p', { class: 'seal', attrs: { 'aria-hidden': 'true' } }, [
      el('span', { text: 'Варим без побочных эффектов*' }),
      el('em', { text: '*почти' }),
    ]),
    tornEdge(),
  ]);
}

function createAboutSection(): HTMLElement {
  return el('section', { class: 'about', attrs: { 'aria-labelledby': 'about-title' } }, [
    el('picture', { class: 'about__picture' }, [
      el('source', {
        attrs: { media: '(max-width: 1100px)', srcset: imageUrl('about-full') },
      }),
      el('img', {
        attrs: { src: imageUrl('about'), alt: '', width: 1536, height: 1024, loading: 'lazy' },
      }),
    ]),
    el('div', { class: 'about__text' }, [
      el('p', { class: 'eyebrow' }, [star(), 'о лавке', star()]),
      el('h2', {
        class: 'about__title',
        text: 'Убежище для собирателей редкостей',
        attrs: { id: 'about-title' },
      }),
      el('p', {
        text: '«Лавка зелий» — учебный проект RS School. Это интернет-магазин на TypeScript и Vite без фреймворков: каталог с поиском, фильтрами и сортировкой, котёл-корзина с промокодами и сохранением в localStorage.',
      }),
      el('p', {
        class: 'about__note',
        text: 'Логика покрыта unit-тестами на Vitest, а каждое изменение прошло через pull request и ревью напарника.',
      }),
      el('a', { class: 'btn', text: 'Выбрать зелье  →', attrs: { href: toHash('catalog') } }),
    ]),
  ]);
}

function createMemberCard(member: TeamMember): HTMLElement {
  return el('article', { class: 'member' }, [
    el('span', {
      class: 'member__avatar',
      text: member.monogram,
      attrs: { 'aria-hidden': 'true' },
    }),
    el('div', { class: 'member__info' }, [
      el('h3', { class: 'member__name', text: member.name }),
      el('p', { class: 'member__role', text: member.role }),
      el(
        'ul',
        { class: 'member__list' },
        member.contribution.map((item) => el('li', {}, [star(9), el('span', { text: item })])),
      ),
      el('a', {
        class: 'member__link',
        text: `github.com/${member.github}`,
        attrs: { href: `https://github.com/${member.github}`, target: '_blank', rel: 'noopener' },
      }),
    ]),
  ]);
}

function createSectionHeading(title: string, subtitle: string, id: string): HTMLElement {
  return el('div', { class: 'section-heading' }, [
    el('h2', { class: 'section-heading__title', attrs: { id } }, [star(16), title, star(16)]),
    el('p', { class: 'section-heading__subtitle', text: subtitle }),
  ]);
}

export function createAboutPage(store: Store<AppState>): Page {
  const featuredGrid = el('div', { class: 'product-grid product-grid--featured' });

  const handleAdd = (productId: string): void => {
    store.setState((state) => ({ ...state, cart: addToCart(state.cart, productId) }));
  };

  const renderFeatured = (state: AppState): void => {
    replaceKeepingFocus(
      featuredGrid,
      FEATURED.map((product) =>
        createProductCard(product, getQuantity(state.cart, product.id), handleAdd),
      ),
    );
  };

  const element = el('div', { class: 'page page--about' }, [
    createHero(),
    el('section', { class: 'section container', attrs: { 'aria-labelledby': 'featured-title' } }, [
      el('div', { class: 'section__top' }, [
        createSectionHeading(
          'Избранные зелья',
          'Самое популярное в этом лунном цикле',
          'featured-title',
        ),
        el('a', {
          class: 'btn btn--outline',
          text: 'Весь каталог  →',
          attrs: { href: toHash('catalog') },
        }),
      ]),
      featuredGrid,
    ]),
    createAboutSection(),
    el('section', { class: 'team', attrs: { 'aria-labelledby': 'team-title' } }, [
      el('div', { class: 'container' }, [
        createSectionHeading('Алхимики лавки', 'Кто что сварил в этом проекте', 'team-title'),
        el('div', { class: 'team__grid' }, TEAM.map(createMemberCard)),
      ]),
    ]),
  ]);

  renderFeatured(store.getState());
  const unsubscribe = store.subscribe(renderFeatured);

  return { element, destroy: unsubscribe };
}
