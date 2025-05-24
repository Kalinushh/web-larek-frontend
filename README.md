# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

API

Конструктор:

baseUrl: string — базовый URL API
options: RequestInit — настройки запросов

Методы:

get<T>(endpoint: string): Promise<T> — GET-запрос
post<TRequest, TResponse>(endpoint: string, data: TRequest): Promise<TResponse> — POST-запрос
handleResponse<T>(response: Response): Promise<T> — обработка ответа и ошибок

EventEmitter
Конструктор:

Инициализирует хранилище подписчиков.
Методы:
on(event: string, handler: (data?: unknown) => void): void
Регистрирует обработчик handler для события с именем event. Обработчик может получать необязательные данные любого типа.

off(event: string, handler: (data?: unknown) => void): void
Убирает ранее зарегистрированный обработчик handler для события event, чтобы он больше не вызывался.

onAll(handler: (event: string, data?: unknown) => void): void
Регистрирует обработчик, который вызывается при возникновении любого события. Получает имя события и опциональные данные.

offAll(): void
Удаляет все зарегистрированные обработчики всех событий.

emit(event: string, data?: unknown): void
Генерирует событие с именем event, вызывая все зарегистрированные обработчики и передавая им опциональные данные data.

trigger(event: string, callback: () => void): void
Устанавливает триггер для события event, вызывая переданный callback при его возникновении (может использоваться для отложенного или условного срабатывания).

Model
Управление данными и генерация событий об изменениях.
Конструктор:

data: Partial<T> — данные модели
events: EventEmitter — экземпляр класса EventEmitter, обеспечивающий связь модели с другими частями приложения через события.
Методы:
emitChanges<K extends keyof T>(event: string, data?: T[K]): void — оповещение об изменениях

AppState
Центральный класс состояния приложения (singleton).
Методы:
setCatalog(data: IProduct[]): void — обновление каталога
setPreview(productId: string | null): void — установка товара предпросмотра
addToBasket(productId: string): void — добавление товара в корзину
removeFromBasket(productId: string): void — удаление товара из корзины
clearBasket(): void — очистка корзины
validateAddress(data: string): boolean — проверка адреса доставки
validateContacts(data: string): boolean — проверка контактных данных
getTotal(): number — подсчет итоговой суммы заказа

Component
Базовый UI-компонент.
Конструктор:
container: HTMLElement — контейнер для отрисовки компонента
Методы:
toggleClass(name: string, force?: boolean): void — добавление/удаление класса
setImage(src: string, alt: string): void — установка изображения
setVisible(): void — показать элемент
setHidden(): void — скрыть элемент
setDisabled(flag: boolean): void — включить/выключить элемент
render<T>(data?: T): void — отрисовка компонента

 Card (наследует Component)

Карточка товара.
Конструктор:
container: HTMLElement
actions?: ICardActions — обработчики событий (например, нажатие кнопок)
Свойства:
id: string
title: string
category: TProductCategory
image: string
description: string
price: number | null
button: HTMLElement
index: number

Form (наследует Component)
Обработка форм и валидация.
Конструктор:
container: HTMLFormElement
events: EventEmitter
Методы:
onInputChange(event: Event): void — обработка изменений в полях формы
set valid(value: boolean): void — установка валидности формы
set errors(errors: string[]): void — отображение ошибок валидации
render(): void — перерисовка формы
Order (наследует Form)

Форма заказа с полями оплаты и контактной информации.
Конструктор:
container: HTMLElement
events: EventEmitter

Методы:
select paymentMethod(value: TPayment): void — выбор способа оплаты
set address(value: string): void
set phone(value: string): void
set email(value: string): void

Basket (наследует Component)
Отображение корзины.
Конструктор:
container: HTMLElement
events: EventEmitter
Свойства:
item: IProduct[] — элементы корзины
selected: boolean — управление видимостью корзины
total: number — отображение итоговой суммы

Page (наследует Component)
Главная страница — управление каталогом и корзиной.
Конструктор:
container: HTMLElement
events: EventEmitter
Свойства:

catalog: IProduct[] — отрисовка каталога товаров
counter: number — счетчик товаров в корзине
locked: boolean — блокировка прокрутки страницы

Modal (наследует Component)
Модальное окно.
Конструктор:
container: HTMLElement
events: EventEmitter
Методы:

open(): void — открыть модальное окно
close(): void — закрыть модальное окно
set content(value: HTMLElement | string): void — установить содержимое
render(): void — отрисовка модального окна


## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
