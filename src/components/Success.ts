import { Component } from './base/Component';

export class Success extends Component<number> {
	private description: HTMLParagraphElement;
	private closeBtn: HTMLButtonElement;
	private total = 0;

	constructor(container: HTMLElement) {
		super(container);
		this.description = this.container.querySelector('.order-success__description')!;
		this.closeBtn = this.container.querySelector('.order-success__close')!;
	}

	setTotal(total: number): void {
		this.total = total;
	}

	override render(): HTMLElement {
		this.description.textContent = `Списано ${this.total} синапсов`;
		return this.container;
	}

	onClose(handler: () => void): void {
		this.closeBtn.addEventListener('click', handler);
	}
}