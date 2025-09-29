export default class DevToolbarColorPicker extends HTMLElement {
	private input: HTMLInputElement;

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		shadowRoot.innerHTML = `<input type="color" />`;

		this.input = shadowRoot.firstElementChild as HTMLInputElement;

		/* v8 ignore start */
		this.input.addEventListener('input', () => {
			this.dataset.color = this.input.value;
		});
		/* v8 ignore stop */
	}

	connectedCallback() {
		this.input.value = this.dataset.color!;
	}

	getColor() {
		return this.input.value;
	}

	setColor(color: string) {
		this.dataset.color = color;
		this.input.value = color;
	}
}
