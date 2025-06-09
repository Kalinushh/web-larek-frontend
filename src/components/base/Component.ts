export abstract class Component<T = unknown> {
	protected container: HTMLElement;

	protected constructor(container: HTMLElement) {
		this.container = container;
	}

	toggleClass(name: string, force?: boolean): void {
		this.container.classList.toggle(name, force);
	}

	setImage(src: string, alt: string): void {
		const img = this.container.querySelector('img');
		if (img instanceof HTMLImageElement) {
			img.src = src;
			img.alt = alt;
		}
	}

	setVisible(): void {
		this.container.classList.remove('hidden');
	}

	setHidden(): void {
		this.container.classList.add('hidden');
	}

	setDisabled(flag: boolean): void {
		const button = this.container.querySelector('button');
		if (button instanceof HTMLButtonElement) {
			button.disabled = flag;
		}
	}

	render(): HTMLElement {
		return this.container;
	}
}