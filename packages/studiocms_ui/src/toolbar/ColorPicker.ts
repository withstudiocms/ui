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

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Convert an HSL color to an RGB color.
 * @param hsl - The HSL color to convert.
 */
function hsl2rgb(hsl: number[]): Color {
  const [h, sPercent, lPercent] = hsl as Color;

  // Convert percentages to fractions
  const s = sPercent / 100;
  const l = lPercent / 100;

  let r, g, b;

  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hueFraction = h / 360; // Convert hue from degrees to fractions
    r = hueToRgb(p, q, hueFraction + 1 / 3);
    g = hueToRgb(p, q, hueFraction);
    b = hueToRgb(p, q, hueFraction - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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
		this.input.value = rgb2hex(hsl2rgb(this.dataset.color!.replaceAll('%', '').split(' ').map(Number)));
	}

	getColor() {
		return (([r,g,b]) => `${r} ${g}% ${b}%`)(rgb2hsl(hex2rgb(this.input.value)).map((v: number) => Math.round(v)));
	}

	setColor(color: string) {
		this.input.value = rgb2hex(hsl2rgb(color.replaceAll('%', '').split(' ').map(Number)));
	}
}
