import { defineToolbarApp } from 'astro/toolbar';
import DevToolbarColorPicker from './ColorPicker.js';

interface TableAndVariables {
	table: HTMLTableElement;
	variables: string[];
}

const map: Record<string, Record<string, string>> = {
	light: {},
	dark: {},
};

function createRows(variables: string[]): HTMLTableRowElement[] {
	const body = getComputedStyle(document.body);

	const rows = variables.map((variable) => {
		const row = document.createElement('tr');
		const cssVariable = document.createElement('td');
		const colorPicker = document.createElement('td');
		const reset = document.createElement('td');

		const colorPickerEl = document.createElement(
			'dev-toolbar-color-picker'
		) as DevToolbarColorPicker;
		colorPickerEl.dataset.variable = variable;
		const initialColor = body.getPropertyValue(variable);
		colorPickerEl.dataset.color = initialColor;

		const resetButton = document.createElement('button');
		resetButton.textContent = 'Reset';
		resetButton.disabled = true;

		const codeEl = document.createElement('code');
		codeEl.textContent = variable;

		cssVariable.appendChild(codeEl);

		colorPicker.appendChild(colorPickerEl);
		reset.appendChild(resetButton);

		row.appendChild(cssVariable);
		row.appendChild(colorPicker);
		row.appendChild(reset);

		colorPickerEl.shadowRoot?.firstElementChild?.addEventListener('input', () => {
			const color = colorPickerEl.getColor();
			const theme = document.documentElement.dataset.theme ?? 'dark';
			document.documentElement.style.setProperty(variable, color);
			map[theme]![variable] = color;
			resetButton.disabled = false;
		});

		resetButton.addEventListener('click', () => {
			const theme = document.documentElement.dataset.theme ?? 'dark';
			document.documentElement.style.setProperty(variable, initialColor);
			colorPickerEl.setColor(initialColor);
			delete map[theme]![variable];
			resetButton.disabled = true;
		});

		return row;
	});

	const observer = new MutationObserver((mutations) => {
		mutations.map((m) => {
			if (m.type !== 'attributes' || m.attributeName !== 'data-theme') return;
			rows.map((row) => {
				const theme = document.documentElement.dataset.theme ?? 'dark';
				const picker = row.children[1]?.firstElementChild as DevToolbarColorPicker;
				const variable = picker.dataset.variable!;
				const value = map[theme]![variable];
				if (!value) document.documentElement.style.removeProperty(variable);
				else document.documentElement.style.setProperty(variable, value);
				const color = body.getPropertyValue(variable);
				picker.dataset.color = color;
				picker.setColor(color);
			});
		});
	});

	observer.observe(document.documentElement, { attributes: true });

	return rows;
}

function createStyles(): HTMLStyleElement {
	const style = document.createElement('style');
	style.textContent = `
    button {
      position: relative;
      gap: 0.5rem;
      outline: none;
      border: none;
      font-weight: 400;
      border-radius: var(--radius-md);
      transition: transform 0.15s, background-color 0.15s, border-color 0.15s, color 0.15s;
      transition-timing-function: ease;
      cursor: pointer;
      background-color: var(--primary-base);
      border-color: var(--primary-base);
      color: var(--text-inverted);
      min-width: fit-content;
      will-change: transform;
      text-decoration: none;
      height: 32px;
      padding: 0.5rem 0.75rem;
      font-size: 0.825em;
      text-align: center !important;
    }

    button:hover {
      background-color: var(--primary-hover);
    }

    button:active {
      background-color: var(--primary-active);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    table {
      border-collapse: collapse;
      margin-top: 1rem;
      width: 100%;
    }

    tr {
      text-align: left;
      color: #fff;
    }

    details {
      margin-bottom: 1rem;
    }
  `;

	return style;
}

function createColorsTable(): TableAndVariables {
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tr = document.createElement('tr');
	const th1 = document.createElement('th');
	const th2 = document.createElement('th');
	const th3 = document.createElement('th');

	th1.textContent = 'CSS Variable';
	th2.textContent = 'Color Picker';
	th3.textContent = 'Reset';

	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	thead.appendChild(tr);
	table.appendChild(thead);

	const tbody = document.createElement('tbody');

	const editableCSSVariables = [
		'--background-base',
		'--background-step-1',
		'--background-step-2',
		'--background-step-3',
		'--text-normal',
		'--text-muted',
		'--text-inverted',
		'--border',
		'--shadow',
		'--default-base',
		'--default-hover',
		'--default-active',
		'--primary-base',
		'--primary-hover',
		'--primary-active',
		'--success-base',
		'--success-hover',
		'--success-active',
		'--warning-base',
		'--warning-hover',
		'--warning-active',
		'--danger-base',
		'--danger-hover',
		'--danger-active',
		'--info-base',
		'--info-hover',
		'--info-active',
		'--mono-base',
		'--mono-hover',
		'--mono-active',
	];

	const rows = createRows(editableCSSVariables);

	for (const row of rows) {
		tbody.appendChild(row);
	}

	table.appendChild(tbody);

	return {
		table: table,
		variables: editableCSSVariables,
	};
}

function createDetails(title: string, table: HTMLTableElement): HTMLDetailsElement {
	const details = document.createElement('details');
	const summary = document.createElement('summary');

	summary.textContent = title;
	details.appendChild(summary);
	details.appendChild(table);

	return details;
}

function createRadiiTable(): TableAndVariables {
	const radiiTable = document.createElement('table');
	const radiiThead = document.createElement('thead');
	const radiiTr = document.createElement('tr');
	const radiiTh1 = document.createElement('th');
	const radiiTh2 = document.createElement('th');
	const radiiTh3 = document.createElement('th');

	radiiTh1.textContent = 'CSS Variable';
	radiiTh2.textContent = 'Value (px)';
	radiiTh3.textContent = 'Reset';

	radiiTr.appendChild(radiiTh1);
	radiiTr.appendChild(radiiTh2);
	radiiTr.appendChild(radiiTh3);
	radiiThead.appendChild(radiiTr);
	radiiTable.appendChild(radiiThead);

	const radiiTbody = document.createElement('tbody');

	const editableRadiiCSSVariables = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-full'];

	for (const variable of editableRadiiCSSVariables) {
		const row = document.createElement('tr');
		const cssVariable = document.createElement('td');
		const value = document.createElement('td');
		const reset = document.createElement('td');

		const initialValue = getComputedStyle(document.body).getPropertyValue(variable);

		const codeEl = document.createElement('code');
		codeEl.textContent = variable;

		cssVariable.appendChild(codeEl);

		const resetButton = document.createElement('button');
		resetButton.textContent = 'Reset';
		resetButton.disabled = true;

		resetButton.addEventListener('click', () => {
			document.documentElement.style.setProperty(variable, initialValue);
			numberInput.value = (
				initialValue.includes('rem')
					? Number.parseFloat(initialValue.split('rem')[0]!) * 16
					: Number.parseInt(initialValue.split('px')[0]!)
			).toString();
			delete map.dark![variable];
			resetButton.disabled = true;
		});

		reset.appendChild(resetButton);

		const numberInput = document.createElement('input');
		numberInput.type = 'number';
		numberInput.min = '0';
		numberInput.step = '1';
		numberInput.value = (
			initialValue.includes('rem')
				? Number.parseFloat(initialValue.split('rem')[0]!) * 16
				: Number.parseInt(initialValue.split('px')[0]!)
		).toString();

		numberInput.addEventListener('input', () => {
			const size = `${numberInput.value}px`;
			document.documentElement.style.setProperty(variable, `${numberInput.value}px`);
			map.dark![variable] = size;
			resetButton.disabled = false;
		});

		value.appendChild(numberInput);

		row.appendChild(cssVariable);
		row.appendChild(value);
		row.appendChild(reset);

		radiiTbody.appendChild(row);
	}

	radiiTable.appendChild(radiiTbody);

	return {
		table: radiiTable,
		variables: editableRadiiCSSVariables,
	};
}

export default defineToolbarApp({
	init(canvas) {
		const myWindow = document.createElement('astro-dev-toolbar-window');
		myWindow.style.overflow = 'auto';

		const header = document.createElement('h1');
		header.textContent = 'StudioCMS UI Theme Editor';
		header.style.marginBottom = '1rem';
		header.style.marginTop = '0';
		myWindow.appendChild(header);

		const style = createStyles();

		const { table: colorsTable } = createColorsTable();
		const colorDetails = createDetails('Colors', colorsTable);

		const { table: radiiTable } = createRadiiTable();
		const radiiDetails = createDetails('Border Radii', radiiTable);

		myWindow.appendChild(header);
		myWindow.appendChild(colorDetails);
		myWindow.appendChild(radiiDetails);
		myWindow.appendChild(style);

		const exportButton = document.createElement('button');
		exportButton.textContent = 'Copy to clipboard';

		exportButton.style.marginTop = '1rem';

		exportButton.addEventListener('click', () => {
			function getVariables(theme: 'light' | 'dark') {
				return Object.entries(map[theme]!)
					.map(([variable, value]) => {
						return `  ${variable}: ${value};`;
					})
					.join('\n');
			}

			const darkVariables = getVariables('dark');
			const lightVariables = getVariables('light');

			const string = `${darkVariables ? `:root {\n${darkVariables}\n}\n` : ''}${lightVariables ? `\n[data-theme="light"] {\n${lightVariables}\n}` : ''}`;

			navigator.clipboard.writeText(string || '/* No changes made */');
		});

		myWindow.appendChild(exportButton);

		canvas.appendChild(myWindow);
	},
});

customElements.define('dev-toolbar-color-picker', DevToolbarColorPicker);
