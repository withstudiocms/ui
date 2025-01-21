const elements = document.querySelectorAll<HTMLDivElement>('.sui-checkmark-container');
const checkbox = document.querySelectorAll<HTMLInputElement>('.sui-checkbox');

for (const element of elements) {
  if (element.dataset.initialized) continue;
  
  element.dataset.initialized = 'true';

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    e.preventDefault();

    const checkbox = element.querySelector<HTMLInputElement>('.sui-checkbox');
      
    if (!checkbox) return;

    checkbox.click();
  });
}

for (const box of checkbox) {
  if (box.dataset.initialized) continue;

  box.dataset.initialized = 'true';

  box.addEventListener('change', (e) => {
    box.parentElement!.ariaChecked = (e.target as HTMLInputElement).checked ? 'true' : 'false';
  });
}
