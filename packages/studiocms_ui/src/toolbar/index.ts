import { defineToolbarApp } from "astro/toolbar";
import DevToolbarColorPicker from './ColorPicker';

// components:
// - tabs
// - color picker
// - slider

function createDetails(summaryText: string, variables: string[]) {
  const body = getComputedStyle(document.body)
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  summary.textContent = summaryText
  details.appendChild(summary)
  for (const variable of variables) {
    const row = document.createElement('div')
    row.innerHTML = `<code>${variable}</code> <dev-toolbar-color-picker data-variable=${variable} data-color="${body.getPropertyValue(variable)}"/>`
    details.appendChild(row)
  }
  return details
}

export default defineToolbarApp({
  init(canvas) {
    const myWindow = document.createElement('astro-dev-toolbar-window');
    const firstDetails = createDetails('test', ['--background-base', '--primary-base'])

    // use appendChild directly on `window`, not `myWindow.shadowRoot`
    myWindow.appendChild(firstDetails)

    canvas.appendChild(myWindow)
  },
  // beforeTogglingOff() {
  //   const confirmation = window.confirm('Really exit?');
  //   return confirmation;
  // }
});

customElements.define('dev-toolbar-color-picker', DevToolbarColorPicker)
