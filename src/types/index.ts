// Категории товаров
export type TProductCategory = 'soft' | 'other';

// Способы оплаты 
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: TProductCategory;
  price: number | null;
}

// Обработчики карточки
export interface ICardActions {
  onClick(productId: string): void;
  onAddToBasket?(productId: string): void;
  onPreview?(productId: string): void;
}

// Данные заказа
export interface IOrder {
  payment: TPayment;
  address: string;
  phone: string;
  email: string;
  items: string[];
}

// События приложения
export type TAppEvents =
  | 'catalog:changed'
  | 'basket:changed'
  | 'preview:open'
  | 'form:submit'
  | 'order:complete';

// Конфигурация API
export interface IApiConfig {
  baseUrl: string;
  options: RequestInit;
}