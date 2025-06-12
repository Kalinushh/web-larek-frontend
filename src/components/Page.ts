import { Component } from './base/Component';
import type { IEvents } from './base/events';


export class Page extends Component<object> {
	private gallery: HTMLElement;
	private basketCounter: HTMLElement;

	constructor(
		container: HTMLElement,
		private readonly events: IEvents,

	) {
		super(container);


		this.gallery = container.querySelector('.gallery')!;
		this.basketCounter = container.querySelector('.header__basket-counter')!;


	}

	updateBasketCounter(count: number): void {
		this.basketCounter.textContent = String(count);
		this.basketCounter.classList.toggle('hidden', count === 0);
	}

	renderCards(cards: HTMLElement[]): void {
		this.gallery.replaceChildren(...cards);
	}
}