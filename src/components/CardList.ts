import { Component } from './base/Component';
import { IProduct, ICardActions } from '../types';
import { Card } from './Card';

export class CardList extends Component<IProduct[]> {
	protected readonly items: HTMLElement[] = [];

	private actions: ICardActions;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);
		this.actions = actions;
	}

	override render(products?: IProduct[]): HTMLElement {
		if (!products) return this.container;

		this.container.innerHTML = ''; // очищаем перед вставкой

		this.items.length = 0; // очищаем массив ссылок
		this.items.push(
			...products.map(product => {
				const card = new Card(product, this.actions, 'catalog');
				const element = card.render(product);
				this.container.appendChild(element);
				return element;
			})
		);

		return this.container;
	}
}