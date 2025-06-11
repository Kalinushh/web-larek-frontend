import { Component } from './base/Component';
import type { IEvents } from './base/events';
import { CardList } from './CardList';

export class Page extends Component<object> {
	private cardList: CardList;

	constructor(
		container: HTMLElement,
		private readonly events: IEvents,
		cardList: CardList
	) {
		super(container);
		this.cardList = cardList;

		this.events.on<HTMLElement[]>('cards:render', (cards) => {
			this.cardList.items = cards;
		});
	}
}

