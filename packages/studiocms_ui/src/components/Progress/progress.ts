function loadProgressBars() {
	const allBars = document.querySelectorAll<HTMLDivElement>('.sui-progress');

	for (const bar of allBars) {
		const value = bar.dataset.value;
		const max = bar.dataset.max;
	
		const progress = bar.firstElementChild as HTMLElement;
	
		if (value && max) {
			const percent = Math.round((Number.parseInt(value, 10) / Number.parseInt(max, 10)) * 100);
			progress.style.width = `${percent}%`;
		}
	}
}

document.addEventListener('astro:page-load', loadProgressBars);
