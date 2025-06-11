import { Form } from './Form';
import type { IEvents } from './base/events';
import type { IContactsForm } from '../types';

export class ContactsForm extends Form<IContactsForm> {
	private readonly emailInput: HTMLInputElement;
	private readonly phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = this.form.querySelector<HTMLInputElement>('input[name="email"]')!;
		this.phoneInput = this.form.querySelector<HTMLInputElement>('input[name="phone"]')!;

		this.emailInput.addEventListener('input', () => {
			this.events.emit('contacts:change', { field: 'email', value: this.emailInput.value.trim() });
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('contacts:change', { field: 'phone', value: this.phoneInput.value.trim() });
		});

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('contacts:submit', {
				email: this.emailInput.value.trim(),
				phone: this.phoneInput.value.trim(),
			});
		});

		this.events.on<{ valid: boolean; errors: string[] }>('contactsForm:validation', ({ valid, errors }) => {
			this.valid = valid;
			this.errors = errors;
		});

		this.valid = false;
	}

	override render(): HTMLElement {
		this.errors = this._errors;
		return super.render();
	}
}
