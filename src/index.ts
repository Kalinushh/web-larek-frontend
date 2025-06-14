import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

import { EventEmitter, IEvents } from './components/base/events';
import { Api } from './components/base/api';

import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { CardList } from './components/CardList';
import { Card } from './components/Card';
import { Modal } from './components/base/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';


import type { IProduct, ICardActions, IContactsForm, IOrder, IOrderForm } from './types';


const events: IEvents = new EventEmitter();
const appState = AppState.init(events);
const api = new Api(API_URL);


const modalEl = ensureElement<HTMLElement>('#modal-container');
const pageEl = ensureElement<HTMLElement>('.page__wrapper');
const catalogEl = ensureElement<HTMLElement>('.gallery');
const basketBtn = ensureElement<HTMLButtonElement>('.header__basket');
const success = new Success(cloneTemplate<HTMLElement>('#success'));


const modal = new Modal(modalEl, events);
const cardList = new CardList(catalogEl);
const page = new Page(pageEl, events);

const basket = new Basket(
	cloneTemplate<HTMLElement>('#basket'),
	{
		onClick: () => events.emit('order:open'),

		onRemoveFromBasket: id => {
			appState.removeFromBasket(id);
			events.emit('basket:changed');
		},
	}
);

const order = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
const contacts = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);


const actions: ICardActions = {
	onClick: id => events.emit('preview:open', { id }),
	onAddToBasket: id => {
		appState.addToBasket(id);
		events.emit('basket:changed');
	},
	onRemoveFromBasket: id => {  //Вызывается только при клике на кнопку удаления у конкретного товара
		appState.removeFromBasket(id);
		events.emit('basket:changed');
	},
};


basketBtn.addEventListener('click', () => events.emit('basket:open'));


function renderCatalog(): void {
	const cards = appState.catalog.map((p: IProduct) =>
		new Card(p, { onClick: id => events.emit('preview:open', { id }) }, 'catalog').render(p)
	);
	cardList.items = cards;
}


function updateBasketCounter(): void {
	const count = appState.getBasketItems().length;
	page.updateBasketCounter(count);
}


api.get('/product')
	.then(res => {
		const { items } = res as { items: IProduct[] };
		appState.setCatalog(items);
		renderCatalog();
	})
	.catch(err => console.error(err));


events.on<{ id: string }>('preview:open', ({ id }) => {
	const p = appState.catalog.find(x => x.id === id);
	if (!p) return;
	const el = new Card(p, actions, 'preview').render(p);
	modal.setContent(el);
	modal.open();
});


events.on('basket:open', () => {
	modal.setContent(basket.render(appState.getBasketItems()));
	modal.open();
});


events.on('order:open', () => {
	modal.setContent(order.render());
	modal.open();
});


events.on('form:submit',() => {

	modal.setContent(contacts.render());
	modal.open();
});


events.on('contacts:submit', () => {
	const order = appState.order;
	if (!order) return;



	const finalOrder: IOrder = {
		...order,
		items: appState.basket,
		total: appState.getTotal(),
	};

	api.post('/order', finalOrder)
		.then(() => {
			appState.clearBasket();
			success.setTotal(finalOrder.total);
			modal.setContent(success.render());
			success.onClose(() => modal.close());
			modal.open();
		})
		.catch(err => console.error('Ошибка отправки заказа:', err));
});



events.on<{ field: keyof IOrderForm; value: string }>('order:change', ({ field, value }) => {
	appState.updateOrderField(field, value);
});

events.on<{ field: keyof IContactsForm; value: string }>('contacts:change', ({ field, value }) => {
	appState.updateContactsField(field, value);
});


events.on<{ valid: boolean; errors: string[] }>('orderForm:validation', ({ valid, errors }) => {
	order.valid = valid;
	order.errors = errors;
});

events.on<{ valid: boolean; errors: string[] }>('contactsForm:validation', ({ valid, errors }) => {
	contacts.valid = valid;
	contacts.errors = errors;
});


events.on('basket:changed', () => {
	basket.render(appState.getBasketItems());
	updateBasketCounter();
});


updateBasketCounter();
