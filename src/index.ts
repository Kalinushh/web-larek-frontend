import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

import { EventEmitter, IEvents } from './components/base/events';
import { Api } from './components/base/api';

import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { Modal } from './components/base/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { ContactsForm } from './components/ContactsForm';

import type { IProduct, IOrder, IOrderForm, IContactsForm } from './types';


const events = new EventEmitter() as IEvents;

const appState = AppState.init(events);

const api = new Api(API_URL);


const pageEl    = ensureElement<HTMLElement>('.page__wrapper');
const catalogEl = ensureElement<HTMLElement>('.gallery');
const modalEl   = ensureElement<HTMLElement>('#modal-container');
const headerBtn = ensureElement<HTMLButtonElement>('.header__basket');
const counterEl = ensureElement<HTMLElement>('.header__basket-counter');


events.on<{ items: IProduct[] }>('basket:changed', ({ items }) => {
	counterEl.textContent = String(items.length);
});


const modal    = new Modal(modalEl, events);
const order    = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
const contacts = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const basket   = new Basket(cloneTemplate<HTMLElement>('#basket'), {
	onClick: () => {

		modal.setContent(order.render());
		modal.open();
	},
	onAddToBasket:     id => appState.addToBasket(id),
	onRemoveFromBasket: id => appState.removeFromBasket(id),
});
const page = new Page(pageEl, catalogEl, events, basket);


headerBtn.addEventListener('click', () => {
	events.emit('basket:open');
});


page.loadCatalog();

events.on<IOrderForm>('form:submit', ({ payment, address }) => {

	appState.setOrder({ payment, address } as IOrder);

	modal.setContent(contacts.render());
	modal.open();
});


events.on<IContactsForm>('contacts:submit', ({ email, phone }) => {
	const baseOrder = appState.order;
	if (!baseOrder) return;

	// Добавляем контакты и остальные данные
	baseOrder.email = email;
	baseOrder.phone = phone;
	const orderData: IOrder = {
		...baseOrder,
		items: appState.basket,
		total: appState.getTotal(),
	};

	// Сохраняем сумму до очистки корзины
	const spent = orderData.total;

	api.post('/order', orderData)
		.then(() => {
			appState.clearBasket();
			const success = cloneTemplate<HTMLElement>('#success');
			const desc = success.querySelector<HTMLParagraphElement>('.order-success__description')!;
			desc.textContent = `Списано ${spent} синапсов`;
			const closeBtn = success.querySelector<HTMLButtonElement>('.order-success__close')!;
			closeBtn.addEventListener('click', () => {
				modal.close();
			});

			modal.setContent(success);
			modal.open();
		})
		.catch(err => console.error('Ошибка отправки заказа:', err));
});