import { Component } from './base/Component';
import { IEvents } from '../types';

export abstract class Form<T = object> extends Component<T> {
	protected form: HTMLFormElement;
	protected events: IEvents;
	protected _valid = false;
	protected _errors: string[] = [];
	protected errorContainer: HTMLElement | null;
	protected constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.form = container;
		this.events = events;
		this.errorContainer = this.form.querySelector('.form__errors');
		this.form.addEventListener('input', this.onInputChange.bind(this));
	}

	get valid(): boolean {
		return this._valid;
	}

	set valid(value: boolean) {
		this._valid = value;
		const submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
		if (submitButton) {
			submitButton.disabled = !value;
		}
	}

	set errors(errors: string[]) {
		this._errors = errors;

		if (this.errorContainer) {
			this.errorContainer.innerHTML = '';
			errors.forEach(err => {
				const el = document.createElement('div');
				el.textContent = err;
				this.errorContainer.appendChild(el);
			});
		}
	}

	protected onInputChange(_event: Event): void { //точка расширения (hook) для всех форм, унаследованных от Form.

	}

	override render(): HTMLElement {
		this.valid = this._valid;
		this.errors = this._errors;
		return this.container;
	}
}