type Color = [number, number, number];

/**
 * Convert a hex color to an RGB color.
 * @param hex - The hex color to convert.
 */
function hex2rgb(hex: string): Color {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return [r, g, b];
}

/**
 * Convert an HSL color to an RGB color.
 * @param hsl - The HSL color to convert.
 */
function hsl2rgb(hsl: number[]): Color {
	const [h, s, l] = hsl as Color;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs((h / 60) % 2 - 1));
	const m = l - c / 2;
	const [r, g, b] = (() => {
		if (h < 60) return [c, x, 0];
		if (h < 120) return [x, c, 0];
		if (h < 180) return [0, c, x];
		if (h < 240) return [0, x, c];
		if (h < 300) return [x, 0, c];
		return [c, 0, x];
	})();
	return [r, g, b].map(v => Math.round((v + m) * 255)) as Color;
}

/**
 * Convert an RGB color to a hex color.
 * @param rgb - The RGB color to convert.
 */
function rgb2hex(rgb: Color): string {
	const [r, g, b] = rgb;
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert an RGB color to an HSL color.
 * @param rgb - The RGB color to convert.
 */
function rgb2hsl(rgb: Color): Color {
	const [r, g, b] = rgb.map(v => v / 255) as Color;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	const h = (() => {
		if (d === 0) return 0;
		if (max === r) return 60 * (((g - b) / d) % 6);
		if (max === g) return 60 * ((b - r) / d + 2);
		return 60 * ((r - g) / d + 4);
	})();
	return [h, s, l];
}

export default class DevToolbarColorPicker extends HTMLElement {
	override shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.shadowRoot = this.attachShadow({ mode: 'open' });
		
		this.shadowRoot.innerHTML = `<input type="color" />`;

    (this.shadowRoot.firstElementChild as HTMLInputElement).addEventListener('input', () => {
			this.dataset.color = (this.shadowRoot.firstElementChild as HTMLInputElement).value;
    })
	}

	connectedCallback() {
		(this.shadowRoot.firstElementChild as HTMLInputElement).value = rgb2hex(hsl2rgb(this.dataset.color!.replaceAll('%', '').split(' ').map(Number)));
	}

	getColor() {
		return (([r,g,b]) => `${r} ${g}% ${b}%`)(rgb2hsl(hex2rgb((this.shadowRoot.firstElementChild as HTMLInputElement).value)).map((v: number) => Math.round(v)));
	}

	setColor(color: string) {
		(this.shadowRoot.firstElementChild as HTMLInputElement).value = rgb2hex(hsl2rgb(color.replaceAll('%', '').split(' ').map(Number)));
	}
}
