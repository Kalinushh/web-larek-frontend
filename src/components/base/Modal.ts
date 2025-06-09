import { Component } from './Component';
import type { IEvents } from './events';

export class Modal extends Component<undefined> {
	constructor(
		container: HTMLElement,
		private events: IEvents
	) {
		super(container);

		// Закрытие по кнопке «×» и по кнопке «За новыми покупками!»
		const closeButtons = Array.from(
			container.querySelectorAll<HTMLButtonElement>('.modal__close, .order-success__close')
		);
		closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()));

		// Закрытие по клику на оверлей
		container.addEventListener('click', (e) => {
			if (e.target === container) {
				this.close();
			}
		});
	}

	private get contentContainer(): HTMLElement {
		return this.container.querySelector('.modal__content') as HTMLElement;
	}

	/** Вставить новый контент в окно */
	public setContent(content: HTMLElement): void {
		this.contentContainer.innerHTML = '';
		this.contentContainer.append(content);
	}

	/** Открыть окно */
	public open(): void {
		this.container.classList.add('modal_active');
		document.body.classList.add('no-scroll');
	}

	/** Закрыть окно */
	public close(): void {
		this.container.classList.remove('modal_active');
		document.body.classList.remove('no-scroll');
	}

	override render(): HTMLElement {
		return this.container;
	}
}