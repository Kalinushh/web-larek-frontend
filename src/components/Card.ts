import { Component } from './base/Component';
import type { IProduct, ICardActions } from '../types';
import { BUTTON_LABELS } from '../types';
import { CDN_URL } from '../utils/constants';
import { categoryCssMap } from '../types';
import { cloneTemplate } from '../utils/utils';
import { AppState } from './AppState';

export class Card extends Component<IProduct> {
	protected readonly title: HTMLElement;
	protected readonly image: HTMLImageElement;
	protected readonly category: HTMLElement;
	protected readonly description?: HTMLElement;
	protected readonly price: HTMLElement;
	protected readonly button: HTMLButtonElement | null;

	private readonly id: string;
	private readonly actions: ICardActions;
	private readonly mode: 'catalog' | 'preview' | 'basket';
	private lastData: IProduct | null = null;

	constructor(
		product: IProduct,
		actions: ICardActions,
		mode: 'catalog' | 'preview' | 'basket' = 'catalog'
	) {
		const templateId =
			mode === 'preview' ? '#card-preview'
				: mode === 'basket'  ? '#card-basket'
					: '#card-catalog';

		const el = cloneTemplate<HTMLElement>(templateId);
		super(el);

		this.mode    = mode;
		this.actions = actions;
		this.id      = product.id;

		this.title    = el.querySelector('.card__title') as HTMLElement;
		this.image    = el.querySelector('.card__image') as HTMLImageElement;
		this.category = el.querySelector('.card__category') as HTMLElement;
		this.price    = el.querySelector('.card__price') as HTMLElement;
		this.button   = el.querySelector<HTMLButtonElement>('.card__button, .basket__item-delete');

		if (mode === 'preview') {
			this.description = el.querySelector('.card__text') as HTMLElement;
		}

		this.container.addEventListener('click', this.handleClick.bind(this));
	}

	private handleClick(e: MouseEvent): void {
		const tgt = e.target as HTMLElement;
		if (this.mode === 'basket' && tgt.closest('.basket__item-delete')) {
			this.actions.onRemoveFromBasket(this.id);
			if (this.lastData) this.render(this.lastData);
			return;
		}


		if (tgt.closest('.card__button')) {
			const inBasket = AppState.getInstance().basket.includes(this.id);
			if (inBasket) {
				this.actions.onRemoveFromBasket(this.id);
			} else {
				this.actions.onAddToBasket(this.id);
			}

			if (this.lastData) this.render(this.lastData);
			return;
		}


		if (this.mode === 'catalog') {
			this.actions.onClick(this.id);
		}
	}

	override render(data?: IProduct): HTMLElement {
		if (!data) {
			return this.container;
		}
		this.lastData = data;
		this.title.textContent = data.title;
		this.price.textContent = data.price !== null
			? `${data.price} синапсов`
			: 'Бесценно';

		const url = `${CDN_URL}/${data.image.replace(/^\/+/, '')}`;
		this.setImage(url, data.title);

		const cls = categoryCssMap[data.category];
		this.category.textContent = data.category;
		this.category.className = `card__category ${cls}`;

		if (this.description) {
			this.description.textContent = data.description;
		}

		if (this.button) {
			const inBasket = AppState.getInstance().basket.includes(this.id);

			if (data.price === null) {
				this.button.disabled    = true;
				this.button.textContent = BUTTON_LABELS.disabled;
			} else {
				this.button.disabled    = false;
				this.button.textContent = inBasket
					? BUTTON_LABELS.remove
					: BUTTON_LABELS.add;
			}
		}

		return this.container;
	}
}