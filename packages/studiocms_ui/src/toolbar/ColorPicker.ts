// @ts-expect-error
import hsl2rgb from 'pure-color/convert/hsl2rgb';
// @ts-expect-error
import rgb2hex from 'pure-color/convert/rgb2hex';
// @ts-expect-error
import rgb2hsl from 'pure-color/convert/rgb2hsl';

function hex2rgb(hex: string) {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return [r, g, b];
}

export default class DevToolbarColorPicker extends HTMLElement {
	override shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.shadowRoot = this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
      <input type="color" value="${rgb2hex(hsl2rgb(this.dataset.color?.replaceAll('%', '').split(' ')))}"/>
    `;
    (this.shadowRoot.firstElementChild as HTMLInputElement).addEventListener('input', () => {
      console.log(this.getColor())
      document.documentElement.style[this.dataset.variable] = this.getColor()
    })
	}

	getColor() {
		return rgb2hsl(hex2rgb((this.shadowRoot.firstElementChild as HTMLInputElement).value));
	}
}
