export default class DevToolbarColorPicker extends HTMLElement {
	private input: HTMLInputElement;

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		shadowRoot.innerHTML = `<input type="color" />`;

		this.input = shadowRoot.firstElementChild as HTMLInputElement;

		this.input.addEventListener('input', () => {
			this.dataset.color = this.input.value;
		});
	}

	connectedCallback() {
		this.input.value = this.dataset.color!;
	}

	getColor() {
		return this.input.value;
	}

	setColor(color: string) {
		this.input.value = color;
	}
}
