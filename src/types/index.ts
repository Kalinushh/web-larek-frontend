// Тип категорий товара
export type TProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое'
	| 'кнопка';

// Карта категорий → CSS-классы
export const categoryCssMap: Record<TProductCategory, string> = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	'дополнительное': 'card__category_additional',
	'другое': 'card__category_other',
	'кнопка': 'card__category_button',
};

// Типы оплаты
export type TPayment = 'online' | 'cash';

// Интерфейс товара
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: TProductCategory;
	price: number | null;
}

// Интерфейс заказа (финальный)
export interface IOrder {
	payment: TPayment;
	address: string;
	email?: string;
	phone?: string;
	items: string[];
	total: number;
}

// Данные первой формы (оплата+адрес)
export interface IOrderForm {
	payment: TPayment;
	address: string;
}

// Данные контактной формы
export interface IContactsForm {
	email: string;
	phone: string;
}

// Действия для карточки
export interface ICardActions {
	onClick: (productId: string) => void;
	onAddToBasket: (productId: string) => void;
	onRemoveFromBasket: (productId: string) => void;
}

// Подписи для кнопок в карточке
export const BUTTON_LABELS = {
	add: 'В корзину',
	remove: 'Убрать из корзины',
	disabled: 'Недоступно',
};

// Переэкспорт интерфейса событий
export type IEvents = import('../components/base/events').IEvents;