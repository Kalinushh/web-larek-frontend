
import { Form } from './Form';
import type { IEvents } from './base/events';
import type { IOrderForm, TPayment } from '../types';
import { AppState } from './AppState';

export class Order extends Form<IOrderForm> {
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;
	private selectedPayment: TPayment | null = null;
	private appState = AppState.getInstance();

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.paymentButtons = Array.from(
			this.form.querySelectorAll<HTMLButtonElement>('.order__buttons .button')
		);
		this.addressInput = this.form.querySelector<HTMLInputElement>('input[name="address"]')!;
		this.paymentButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				this.selectPaymentMethod(btn.getAttribute('name') as TPayment);
			});
		});

		this.form.addEventListener('submit', e => {
			e.preventDefault();
			if (this.valid && this.selectedPayment) {
				this.events.emit('form:submit', {
					payment: this.selectedPayment,
					address: this.addressInput.value.trim(),
				});
			}
		});

		this.valid = false;
	}

	selectPaymentMethod(method: TPayment): void {
		this.selectedPayment = method;
		this.paymentButtons.forEach(btn => {
			const name = btn.getAttribute('name');
			btn.classList.toggle('button_alt-active', name === method);
		});

		this.validate();
	}

	protected onInputChange(): void {
		this.validate();
	}

	private validate(): void {
		const address = this.addressInput.value.trim();
		const addressOk = this.appState.validateAddress(address);
		const paymentOk = this.selectedPayment !== null;

		this.valid = paymentOk && addressOk;

		// Показ ошибок под полем
		const errors: string[] = [];
		if (!paymentOk) errors.push('Выберите способ оплаты');
		if (!addressOk) errors.push('Введите корректный адрес');
		this.errors = errors;
	}

	override render(): HTMLElement {
		this.valid = this._valid;
		this.errors = this._errors;
		return super.render();
	}
}