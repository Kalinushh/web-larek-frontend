import { Form } from './Form';
import type { IEvents } from './base/events';
import type { IOrderForm, TPayment } from '../types';

export class Order extends Form<IOrderForm> {
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.paymentButtons = Array.from(
			this.form.querySelectorAll<HTMLButtonElement>('.order__buttons .button')
		);
		this.addressInput = this.form.querySelector<HTMLInputElement>('input[name="address"]')!;

		this.paymentButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const name = btn.getAttribute('name');
				const method: TPayment = name === 'card' ? 'online' : 'cash';

				this.paymentButtons.forEach(b =>
					b.classList.toggle('button_alt-active', b === btn)
				);


				this.events.emit('order:change', {
					field: 'payment',
					value: method
				});
			});
		});

		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:change', {
				field: 'address',
				value: this.addressInput.value.trim()
			});
		});

		this.form.addEventListener('submit', e => {
			e.preventDefault();

			if (this.valid) {
				const selected = this.paymentButtons.find(btn =>
					btn.classList.contains('button_alt-active')
				);

				const name = selected?.getAttribute('name');
				const payment: TPayment = name === 'card' ? 'online' : 'cash';

				this.events.emit('form:submit', {
					payment,
					address: this.addressInput.value.trim()
				});
			}
		});

		this.events.on<{ valid: boolean; errors: string[] }>(
			'orderForm:validation',
			({ valid, errors }) => {
				this.valid = valid;
				this.errors = errors;
			}
		);

		this.valid = false;
	}

	override render(): HTMLElement {
		this.errors = this._errors;
		return super.render();
	}
}