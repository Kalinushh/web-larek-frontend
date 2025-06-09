import { Form } from './Form'
import type { IEvents } from './base/events'
import type { IContactsForm } from '../types'

export class ContactsForm extends Form<IContactsForm> {
	private readonly emailInput: HTMLInputElement
	private readonly phoneInput: HTMLInputElement
	private touched = { email: false, phone: false }

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events)

		this.emailInput = this.form.querySelector<HTMLInputElement>(
			'input[name="email"]'
		)!
		this.phoneInput = this.form.querySelector<HTMLInputElement>(
			'input[name="phone"]'
		)!

		this.emailInput.addEventListener('input', this.onInputChange.bind(this))
		this.phoneInput.addEventListener('input', this.onInputChange.bind(this))
		this.emailInput.addEventListener('blur', () => {
			this.touched.email = true
			this.onInputChange()
		})
		this.phoneInput.addEventListener('blur', () => {
			this.touched.phone = true
			this.onInputChange()
		})

		this.form.addEventListener('submit', e => {
			e.preventDefault()
			if (this.valid) {
				this.events.emit('contacts:submit', {
					email: this.emailInput.value.trim(),
					phone: this.phoneInput.value.trim(),
				})
			}
		})

		this.valid = false
	}

	protected onInputChange(): void {
		const email = this.emailInput.value.trim()
		const phone = this.phoneInput.value.trim()

		const emailOk = email.includes('@') && email.split('@')[1]?.includes('.')
		const phoneOk = /^\+7\d{10}$/.test(phone)

		this.valid = emailOk && phoneOk
		const errs: string[] = []
		if (this.touched.email && !emailOk) {
			errs.push('Введите корректный Email')
		}
		if (this.touched.phone && !phoneOk) {
			errs.push('Телефон должен быть в формате +7XXXXXXXXXX')
		}
		this.errors = errs
	}
}