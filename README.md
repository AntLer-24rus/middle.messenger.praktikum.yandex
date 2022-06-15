![GitHub package.json version](https://img.shields.io/github/package-json/v/AntLer-24rus/middle.messenger.praktikum.yandex) ![Netlify](https://img.shields.io/netlify/cb27d7a7-72f6-4d6d-8818-d43b77b9c9b8) ![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/AntLer-24rus/middle.messenger.praktikum.yandex/dev/parcel)

# AntLer Chats

Учебный проект первого модуля курса Yandex practicum

Макеты доступны на [Figma.com](https://www.figma.com/file/sySPP1pk1sEVnBZWNWClME/AntLer-Chat?node-id=0%3A1)

### Установка

Для запуска приложения необходимо:

1. Склонировать репозиторий к себе

   ```bash
   git clone https://github.com/AntLer-24rus/middle.messenger.praktikum.yandex.git
   ```

1. Перейти в папку проекта и установить зависимости

   ```bash
   cd middle.messenger.praktikum.yandex && npm install
   ```

1. Собрать проект
   ```bash
   npm run build
   ```
1. Запустить собранный проект можно, например при помощи пакета [`http-server`](https://www.npmjs.com/package/http-server)
   ```
   npx http-server dist
   ```
   Сервер будет запущен на http://localhost:8080 по умолчанию

1. Также для запуска можно использовать docker, см. секцию ниже [Docker](#Docker)

Для запуска приложения в режиме разработки:

```bash
npm run dev
```

Также есть команда очистки, которая удаляет папку собранного проекта:

```bash
npm run clean
```

Запуск тестов осуществляется командой:

```bash
npm run test
```

## Docker

Для сборки использовать команду

```bash
docker build --pull --rm -f "build/Dockerfile" -t <image-name> .
```
Где `<image-name>` име будущего образа

Для запуска с удалением после остановки в выводом логов в командную строку:
```bash
docker run --rm -it --env PORT=3000 -p 80:3000/tcp <image-name>
```
В переменной окружения `PORT` указывается какой порт будет слушать nginx внутри контейнера

## В будущих версиях

1. [ ] Адаптировать верстку для мобильных
1. [ ] Добавить асинхронное подключение страниц и компонентов, для настройки lazy-load
1. [ ] Добавить module.hot для работы Webpack HMR
1. [ ] По максимуму избавиться от any типов
1. [ ] Добавить автоматическую типизацию `props` и `data` в определение компонентов
1. [ ] Добавить возможность указывать необязательные `props`\`ы

Текущая версия доступна на [netlify](https://ubiquitous-entremet-7f80bf.netlify.app) на [heroku](https://antler-chats.herokuapp.com/)

## Pull requests

- Первый спринт [sprint_1](https://github.com/AntLer-24rus/middle.messenger.praktikum.yandex/pull/1)
- Второй спринт [sprint_2](https://github.com/AntLer-24rus/middle.messenger.praktikum.yandex/pull/2)
- Третий спринт [sprint_3](https://github.com/AntLer-24rus/middle.messenger.praktikum.yandex/pull/3)
