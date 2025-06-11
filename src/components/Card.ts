import { Component } from './base/Component';
import type { IProduct, ICardActions } from '../types';
import { BUTTON_LABELS, categoryCssMap } from '../types';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';
import { AppState } from './AppState';

export class Card extends Component<IProduct> {
	private readonly id: string;
	private lastData: IProduct | null = null;
	private readonly button: HTMLButtonElement | null;

	constructor(
		product: IProduct,
		private readonly actions: ICardActions,
		private readonly mode: 'catalog' | 'preview' | 'basket' = 'catalog'
	) {
		const tmpl =
			mode === 'preview'  ? '#card-preview'
				: mode === 'basket' ? '#card-basket'
					:                      '#card-catalog';
		const el = cloneTemplate<HTMLElement>(tmpl);
		super(el);

		this.id     = product.id;
		this.button = el.querySelector<HTMLButtonElement>('.card__button, .basket__item-delete');

		this.container.addEventListener('click', (e) => this.handleClick(e));
	}

	private handleClick(e: MouseEvent) {
		const tgt = (e.target as HTMLElement).closest('button');
		if (!tgt || !this.lastData) return;

		const inBasket = AppState.getInstance().basket.includes(this.id);

		if (tgt.classList.contains('basket__item-delete') || (tgt.classList.contains('card__button') && inBasket)) {
			this.actions.onRemoveFromBasket(this.id);
			this.render(this.lastData);
			return;
		}

		if (tgt.classList.contains('card__button') && !inBasket) {
			this.actions.onAddToBasket(this.id);
			this.render(this.lastData);
			return;
		}

		if (this.mode === 'catalog') {
			this.actions.onClick(this.id);
		}
	}

	override render(data?: IProduct): HTMLElement {
		if (!data) return this.container;
		this.lastData = data;

		this.container.querySelector('.card__title')!.textContent = data.title;
		this.container.querySelector('.card__price')!.textContent = data.price !== null
			? `${data.price} синапсов`
			: 'Бесценно';
		const img = this.container.querySelector('img') as HTMLImageElement;
		img.src = `${CDN_URL}/${data.image.replace(/^\/+/, '')}`;
		img.alt = data.title;
		const catEl = this.container.querySelector('.card__category')!;
		const cls = categoryCssMap[data.category];
		catEl.textContent = data.category;
		catEl.className   = `card__category ${cls}`;
		if (this.mode === 'preview') {
			(this.container.querySelector('.card__text') as HTMLElement).textContent = data.description;
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