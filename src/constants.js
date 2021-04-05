const MENU = [
  {
    name: 'Главная',
    link: '/main',
  },
  {
    name: 'Учебник',
    link: '/dictionary',
  },
  {
    name: 'Саванна',
    link: '/savana',
  },
  {
    name: 'Аудиовызов',
    link: '/audiobattle',
  },
  {
    name: 'Спринт',
    link: '/sprint',
  },
  {
    name: 'Своя игра',
    link: '/ourgame',
  },
  {
    name: 'Статистика',
    link: '/statisctics',
    isUsers: true,
  },
  {
    name: 'Профиль',
    link: '/profile',
    isUsers: true,
  },
  {
    name: 'Вход',
    link: '/auth',
    isAuth: true,
  },
  {
    name: 'Регистрация',
    link: '/register',
    isAuth: true,
  },
];

export default MENU;
