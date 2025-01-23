function loadToggles() {
	const allToggleElements = document.querySelectorAll<HTMLDivElement>('.sui-toggle-container');
	const allToggles = document.querySelectorAll<HTMLInputElement>('.sui-toggle-checkbox');

	for (const element of allToggleElements) {
		if (element.dataset.initialized) continue;

		element.dataset.initialized = 'true';

		element.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter' && e.key !== ' ') return;

			e.preventDefault();

			const checkbox = element.querySelector<HTMLInputElement>('.sui-toggle-checkbox');

			if (!checkbox) return;

			checkbox.click();
		});
	}

	for (const box of allToggles) {
		if (box.dataset.initialized) continue;

		box.dataset.initialized = 'true';

		box.addEventListener('change', (e) => {
			(box.previousSibling as HTMLDivElement).ariaChecked = (e.target as HTMLInputElement).checked
				? 'true'
				: 'false';
		});
	}
}

document.addEventListener('astro:page-load', loadToggles);
