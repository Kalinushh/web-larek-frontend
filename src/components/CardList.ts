import { Component } from './base/Component';

export class CardList extends Component<HTMLElement[]> {
	protected readonly _items: HTMLElement[] = [];

	constructor(container: HTMLElement) {
		super(container);
	}

	set items(elements: HTMLElement[]) {
		this.container.innerHTML = '';
		elements.forEach(el => this.container.appendChild(el));
		this._items.splice(0, this._items.length, ...elements);
	}
}