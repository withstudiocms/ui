function loadCheckboxes() {
	const allElements = document.querySelectorAll<HTMLDivElement>('.sui-checkmark-container');
	const allCheckbox = document.querySelectorAll<HTMLInputElement>('.sui-checkbox');

	for (const element of allElements) {
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

	for (const box of allCheckbox) {
		if (box.dataset.initialized) continue;

		box.dataset.initialized = 'true';

		box.addEventListener('change', (e) => {
			box.parentElement!.ariaChecked = (e.target as HTMLInputElement).checked ? 'true' : 'false';
		});
	}
}

document.addEventListener('astro:page-load', loadCheckboxes);
