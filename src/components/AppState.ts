import { IProduct, IOrder, IOrderForm, IContactsForm, TPayment } from '../types';
import { IEvents } from './base/events';

export class AppState {
	private static instance: AppState;

	catalog: IProduct[] = [];
	basket: string[] = [];
	preview: string | null = null;
	order: IOrder | null = null;

	private touchedOrderFields: Partial<Record<keyof IOrderForm, boolean>> = {};
	private touchedContactsFields: Partial<Record<keyof IContactsForm, boolean>> = {};

	events: IEvents;

	private constructor(events: IEvents) {
		this.events = events;
	}

	static init(events: IEvents): AppState {
		if (!AppState.instance) {
			AppState.instance = new AppState(events);
		}
		return AppState.instance;
	}

	static getInstance(): AppState {
		if (!AppState.instance) {
			throw new Error('AppState не инициализирован. Сначала вызовите AppState.init(events).');
		}
		return AppState.instance;
	}

	setCatalog(items: IProduct[]): void {
		this.catalog = items;
		this.events.emit('catalog:changed', { items: this.catalog });
	}

	setPreview(productId: string | null): void {
		this.preview = productId;
		this.events.emit('preview:changed', { id: this.preview });
	}

	addToBasket(productId: string): void {
		if (!this.basket.includes(productId)) {
			this.basket.push(productId);
			this.events.emit('basket:changed', { items: this.getBasketItems() });
		}
	}

	removeFromBasket(productId: string): void {
		this.basket = this.basket.filter(id => id !== productId);
		this.events.emit('basket:changed', { items: this.getBasketItems() });
	}

	clearBasket(): void {
		this.basket = [];
		this.events.emit('basket:changed', { items: [] });
	}

	setOrder(order: IOrder): void {
		this.order = order;
		this.events.emit('order:changed', { order: this.order });
	}

	getTotal(): number {
		return this.getBasketItems().reduce((sum, p) => sum + (p.price ?? 0), 0);
	}

	getBasketItems(): IProduct[] {
		return this.catalog.filter(p => this.basket.includes(p.id));
	}

	validateAddress(address: string): boolean {
		return address.trim().length > 5;
	}

	validateContacts(email: string, phone: string): boolean {
		const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const phoneValid = /^\+?[78][\d\s\-()]{10,}$/.test(phone);
		return emailValid && phoneValid;
	}

	updateOrderField(field: keyof IOrderForm, value: string): void {
		if (!this.order) {
			this.order = {
				payment: null as unknown as TPayment,
				address: '',
				items: [],
				total: 0
			};
		}

		this.touchedOrderFields[field] = true;

		if (field === 'payment' && (value === 'online' || value === 'cash')) {
			this.order.payment = value as TPayment;
		} else if (field === 'address') {
			this.order.address = value;
		}

		const paymentValid = this.order.payment === 'online' || this.order.payment === 'cash';
		const addressValid = this.order.address.trim().length > 5;

		const errors: string[] = [];
		if (this.touchedOrderFields['payment'] && !paymentValid) {
			errors.push('Выберите способ оплаты');
		}
		if (this.touchedOrderFields['address'] && !addressValid) {
			errors.push('Введите корректный адрес (мин. 6 символов)');
		}

		const valid = paymentValid && addressValid;
		this.events.emit('orderForm:validation', { valid, errors });
	}

	updateContactsField<K extends keyof IContactsForm>(field: K, value: IContactsForm[K]): void {
		if (!this.order) {
			this.order = {
				payment: null as unknown as TPayment,
				address: '',
				items: [],
				total: 0
			};
		}

		this.order[field] = value;
		this.touchedContactsFields[field] = true;

		const email = this.order.email ?? '';
		const phone = this.order.phone ?? '';

		const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const phoneValid = /^\+7\d{10}$/.test(phone);

		const errors: string[] = [];
		if (this.touchedContactsFields['email'] && !emailValid) {
			errors.push('Введите корректный Email');
		}
		if (this.touchedContactsFields['phone'] && !phoneValid) {
			errors.push('Телефон должен быть в формате +7XXXXXXXXXX');
		}

		const valid = emailValid && phoneValid;
		this.events.emit('contactsForm:validation', { valid, errors });
	}
}

