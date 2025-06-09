
import { Component } from './base/Component';
import type { IEvents } from './base/events';
import { Api } from './base/api';
import { AppState } from './AppState';
import { Basket } from './Basket';
import { Modal } from './base/Modal';
import { Order } from './Order';
import { ContactsForm } from './ContactsForm';
import { CardList } from './CardList';
import { Card } from './Card';

import type { IProduct, ICardActions } from '../types';
import { API_URL } from '../utils/constants';
import { ensureElement, cloneTemplate } from '../utils/utils';

export class Page extends Component<object> {
	protected cardList: CardList;
	protected api: Api;
	protected appState: AppState;
	protected modal: Modal;
	protected order: Order;
	protected contacts: ContactsForm;
	protected basket: Basket;

	constructor(
		container: HTMLElement,
		catalogContainer: HTMLElement,
		protected events: IEvents,
		basket: Basket
	) {
		super(container);

		// API и AppState
		this.api = new Api(API_URL);
		this.appState = AppState.getInstance();

		// Модалка и формы
		this.modal    = new Modal(ensureElement<HTMLElement>('#modal-container'), this.events);
		this.order    = new Order(cloneTemplate<HTMLFormElement>('#order'), this.events);
		this.contacts = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), this.events);

		// Корзина
		this.basket = basket;

		// Список карточек каталога
		this.cardList = new CardList(catalogContainer, {
			onClick:        id => this.events.emit('preview:open', { id }),
			onAddToBasket:  id => this.appState.addToBasket(id),
			onRemoveFromBasket: id => this.appState.removeFromBasket(id),
		});

		this.setupEventListeners();
		this.loadCatalog();
	}

	createCard(
		product: IProduct,
		mode: 'catalog' | 'preview' | 'basket' = 'catalog'
	): Card {
		const actions: ICardActions = {
			onClick:         id => this.events.emit('preview:open', { id }),
			onAddToBasket:   id => this.appState.addToBasket(id),
			onRemoveFromBasket: id => this.appState.removeFromBasket(id),
		};
		return new Card(product, actions, mode);
	}

	protected setupEventListeners(): void {
		this.events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
			this.cardList.render(items);
		});

		this.events.on<{ id: string }>('preview:open', ({ id }) => {
			const product = this.appState.catalog.find(p => p.id === id);
			if (product) {
				const previewCard = this.createCard(product, 'preview');
				this.modal.setContent(previewCard.render(product));
				this.modal.open();
			}
		});

		this.events.on('basket:open', () => {
			this.modal.setContent(this.basket.render(this.appState.getBasketItems()));
			this.modal.open();
		});

		this.events.on('form:submit', () => {
			this.modal.setContent(this.contacts.render());
			this.modal.open();
		});

		this.events.on<{ email: string; phone: string }>('contacts:submit', ({ email, phone }) => {
			if (!this.appState.order) return;
			this.appState.order.email = email;
			this.appState.order.phone = phone;

			const orderData = {
				...this.appState.order,
				items: this.appState.basket,
				total: this.appState.getTotal(),
			};

			this.api.post('/order', orderData)
				.then(() => {
					this.appState.clearBasket();
					const successTpl = cloneTemplate<HTMLElement>('#success');
					this.modal.setContent(successTpl);
					this.modal.open();
				})
				.catch(err => console.error('Ошибка отправки заказа:', err));
		});
	}

	loadCatalog(): void {
		this.api.get('/product')
			.then((data: { items: IProduct[] }) => {
				this.appState.setCatalog(data.items);
			})
			.catch(err => console.error('Ошибка загрузки каталога:', err));
	}
}