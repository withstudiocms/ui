import { defineToolbarApp } from "astro/toolbar";
import DevToolbarColorPicker from './ColorPicker';

// components:
// - tabs
// - color picker
// - slider

function createRows(variables: string[]): HTMLTableRowElement[] {
  const body = getComputedStyle(document.body);

  return variables.map(variable => {
    const row = document.createElement('tr');
    const cssVariable = document.createElement('td');
    const colorPicker = document.createElement('td');
    const reset = document.createElement('td');

    const colorPickerEl = document.createElement('dev-toolbar-color-picker') as DevToolbarColorPicker;
    colorPickerEl.dataset.variable = variable;
    const initialColor = body.getPropertyValue(variable);
    colorPickerEl.dataset.color = initialColor;

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    
    cssVariable.textContent = variable;

    colorPicker.appendChild(colorPickerEl);
    reset.appendChild(resetButton);

    row.appendChild(cssVariable);
    row.appendChild(colorPicker);
    row.appendChild(reset);

    colorPickerEl.shadowRoot.firstElementChild?.addEventListener('input', () => {
      document.documentElement.style.setProperty(variable, colorPickerEl.getColor());
    });

    resetButton.addEventListener('click', () => {
      document.documentElement.style.setProperty(variable, initialColor);
      colorPickerEl.setColor(initialColor);
    });

    return row;
  });
}

export default defineToolbarApp({
  init(canvas) {
    const myWindow = document.createElement('astro-dev-toolbar-window');
    
    myWindow.style.overflow = 'auto';

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
        background-color: hsl(var(--primary-base));
        border-color: hsl(var(--primary-base));
        color: hsl(var(--text-inverted));
        min-width: fit-content;
        will-change: transform;
        text-decoration: none;
        height: 32px;
        padding: 0.5rem 0.75rem;
        font-size: 0.825em;
        text-align: center !important;
      }

      button:hover {
        background-color: hsl(var(--primary-hover));
      }

      button:active {
        background-color: hsl(var(--primary-active));
      }
    `;

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const th1 = document.createElement('th');
    const th2 = document.createElement('th');
    const th3 = document.createElement('th');

    tr.style.textAlign = 'left';
    tr.style.color = '#fff';

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
      '--background-base', '--background-step-1', '--background-step-2', '--background-step-3',
      '--text-normal', '--text-muted', '--text-inverted', '--border', '--shadow', 
      '--default-base', '--default-hover', '--default-active',
      '--primary-base', '--primary-hover', '--primary-active',
      '--success-base', '--success-hover', '--success-active',
      '--warning-base', '--warning-hover', '--warning-active',
      '--danger-base', '--danger-hover', '--danger-active',
      '--info-base', '--info-hover', '--info-active',
      '--mono-base', '--mono-hover', '--mono-active'
    ];

    const rows = createRows(editableCSSVariables);

    for (const row of rows) {
      tbody.appendChild(row);
    }

    table.appendChild(tbody);

    myWindow.appendChild(table);
    myWindow.appendChild(style);

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Copy to clipboard';

    exportButton.style.marginTop = '1rem';

    exportButton.addEventListener('click', () => {
      const css = editableCSSVariables.map(variable => {
        return `  ${variable}: ${getComputedStyle(document.body).getPropertyValue(variable)};`;
      }).join('\n');

      const string = `:root {\n${css}\n}`;

      navigator.clipboard.writeText(string);
    });

    myWindow.appendChild(exportButton);

    canvas.appendChild(myWindow);
  }
});

customElements.define('dev-toolbar-color-picker', DevToolbarColorPicker)
