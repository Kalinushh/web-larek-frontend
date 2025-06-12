import { Component } from './base/Component';
import type { IProduct, ICardActions } from '../types';
import { cloneTemplate } from '../utils/utils';

export class Basket extends Component<IProduct[]> {
	protected readonly list: HTMLElement;
	protected readonly total: HTMLElement;
	protected readonly orderButton: HTMLButtonElement;
	protected items: HTMLElement[] = [];

	private readonly actions: ICardActions;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);
		this.actions = actions;

		this.list = this.container.querySelector('.basket__list') as HTMLElement;
		this.total = this.container.querySelector('.basket__price') as HTMLElement;
		this.orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;

		this.orderButton.addEventListener('click', () => {
			this.actions.onClick('');
		});
	}

	override render(products: IProduct[] = []): HTMLElement {
		this.list.innerHTML = '';
		this.items = [];

		products.forEach((product, index) => {
			const itemEl = cloneTemplate<HTMLElement>('#card-basket');
			const titleEl = itemEl.querySelector('.card__title') as HTMLElement;
			const priceEl = itemEl.querySelector('.card__price') as HTMLElement;
			const indexEl = itemEl.querySelector('.basket__item-index') as HTMLElement;
			const removeBtn = itemEl.querySelector('.basket__item-delete') as HTMLButtonElement;

			titleEl.textContent = product.title;
			priceEl.textContent = product.price !== null
				? `${product.price} синапсов`
				: 'Бесценно';
			indexEl.textContent = String(index + 1);

			removeBtn.addEventListener('click', () => { //removeBtn — кнопка "удалить" внутри карточки товара. При клике вызывается удаление только по id этого продукта.
				this.actions.onRemoveFromBasket(product.id);
			});

			this.list.appendChild(itemEl);
			this.items.push(itemEl);
		});

		this.updateTotal(products);
		return this.container;
	}

	updateTotal(products: IProduct[]): void {
		const sum = products.reduce((acc, p) => acc + (p.price ?? 0), 0);
		this.total.textContent = `${sum} синапсов`;
		this.orderButton.disabled = products.length === 0;
	}
}
