# Hexlet Todo


[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6e1f48151587430b907015f9b202d764)](https://app.codacy.com/gh/MarieMiatova/hexlet-todo/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)


Простое fullstack-приложение на Next.js для авторизации пользователя и управления личными задачами.

## Что реализовано

- Авторизация с двумя сценариями:
  - `check` пользователя по логину;
  - вход (`sign-in`) для существующего пользователя;
  - регистрация (`sign-up`) для нового пользователя.
- Проверка совпадения пароля и подтверждения при регистрации.
- Хранение JWT-токена на клиенте и доступ к защищенным роутам задач.
- Таск-трекер:
  - создание задачи;
  - получение списка задач пользователя;
  - завершение задачи одной кнопкой.
- Статусы задач: `PENDING` и `COMPLETED`.
- UI на HeroUI с адаптацией под мобильные устройства.

## Архитектура

Проект организован по FLUX-подходу с разделением слоев:

- `lib/store/api/*` — API-слой (`authApi`, `taskApi`), все HTTP-запросы вынесены сюда;
- `app/*` — UI-слой (страницы и взаимодействие с пользователем);
- `app/api/*` — серверные route handlers (валидация, JWT, работа с БД);
- `lib/db/*` и `lib/db/models/*` — подключение и модели MongoDB.

Данные проходят однонаправленно: UI -> API-метод -> route handler -> БД -> ответ -> обновление UI.


## Быстрый старт

Установка зависимостей:

```bash
yarn
```

Запуск в dev-режиме:

```bash
yarn dev
```

Приложение будет доступно по адресу:

```text
http://localhost:3000
```

## Скрипты

```bash
yarn dev    # запуск разработки
yarn build  # production-сборка
yarn start  # запуск production-сборки
yarn lint   # проверка линтером
```

## Деплой

Деплой доступен по ссылке <a href="https://hexlet-todo-alpha.vercel.app/">https://hexlet-todo-alpha.vercel.app/</a>
