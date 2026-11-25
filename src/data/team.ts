export interface TeamMember {
  monogram: string;
  name: string;
  role: string;
  github: string;
  contribution: string[];
}

export const TEAM: TeamMember[] = [
  {
    monogram: 'I',
    name: 'Имя Фамилия',
    role: 'Хранитель котла',
    github: 'username',
    contribution: [],
  },
  {
    monogram: 'II',
    name: 'Имя Фамилия',
    role: 'Хранитель котла',
    github: 'username',
    contribution: [],
  },
];
