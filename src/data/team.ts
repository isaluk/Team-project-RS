export const REPO_URL = 'https://github.com/isaluk/Team-project-RS';

export interface Contribution {
  text: string;
  issue?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  github: string;
  contribution: Contribution[];
}

export const TEAM: TeamMember[] = [
  {
    name: 'Irina S.',
    role: 'Главный алхимик',
    github: 'isaluk',
    contribution: [
      { text: 'Разметка страницы и точка входа', issue: 2 },
      { text: 'Проверки в pull request', issue: 4 },
      { text: 'Деплой на GitHub Pages', issue: 6 },
      { text: 'Типы и данные товаров', issue: 10 },
      { text: 'Промокод и подсчёт итогов', issue: 12 },
      { text: 'Формат цены, склонение и адреса', issue: 16 },
      { text: 'Набор для интерфейса', issue: 19 },
      { text: 'Страница «О нас»', issue: 23 },
      { text: 'Страница корзины', issue: 28 },
      { text: 'Данные команды', issue: 32 },
    ],
  },
  {
    name: 'Arseniy M.',
    role: 'Хранитель котла',
    github: 'Maslovars',
    contribution: [
      { text: 'Настройка проекта: Vite, TypeScript, ESLint, Prettier, Husky' },
      { text: 'README и шаблон pull request', issue: 8 },
      { text: 'Логика корзины', issue: 13 },
      { text: 'Поиск, фильтры и сортировка', issue: 17 },
      { text: 'Хранилище и localStorage', issue: 21 },
      { text: 'Шапка, подвал и роутер', issue: 25 },
      { text: 'Страница каталога', issue: 27 },
    ],
  },
];
