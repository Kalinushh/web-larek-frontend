import { IProduct, IOrder } from '../types';
import { EventEmitter, IEvents } from './base/events';

export class AppState {
	private static instance: AppState;

	catalog: IProduct[] = [];
	basket: string[] = [];
	preview: string | null = null;
	order: IOrder | null = null;

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
		const phoneValid = /^\+?[78][\\d\\s\\-\\(\\)]{10,}$/.test(phone);
		return emailValid && phoneValid;
	}
}

