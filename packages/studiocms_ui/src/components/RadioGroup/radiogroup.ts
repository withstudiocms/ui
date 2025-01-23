function loadRadioGroups() {
	const AllRadioGroupContainers = document.querySelectorAll<HTMLDivElement>('.sui-radio-container');

	for (const element of AllRadioGroupContainers) {
		if (element.dataset.initialized) continue;

		element.dataset.initialized = 'true';

		const radioBoxes = element.querySelectorAll<HTMLDivElement>('.sui-radio-box');

		let i = 0;

		for (const radioBox of radioBoxes) {
			radioBox.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();

					const input = (
						e.target as HTMLDivElement
					).parentElement!.parentElement!.querySelector<HTMLInputElement>('.sui-radio-toggle')!;

					if (input.disabled) return;

					input.checked = true;
				}

				if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
					e.preventDefault();

					let nextRadioBox: HTMLDivElement | undefined;

					radioBoxes.forEach((box, index) => {
						if (box === radioBox) nextRadioBox = radioBoxes[index + 1];
					});

					if (!nextRadioBox) return;

					radioBox.tabIndex = -1;
					nextRadioBox.tabIndex = 0;
					nextRadioBox.focus();
					nextRadioBox.click();
				}

				if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
					e.preventDefault();

					let previousRadioBox: HTMLDivElement | undefined;

					radioBoxes.forEach((box, index) => {
						if (box === radioBox) previousRadioBox = radioBoxes[index - 1];
					});

					if (!previousRadioBox) return;

					radioBox.tabIndex = -1;
					previousRadioBox.tabIndex = 0;
					previousRadioBox.focus();
					previousRadioBox.click();
				}
			});

			i++;
		}
		element.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter') return;

			const checkbox = element.querySelector<HTMLInputElement>('.sui-checkbox');

			if (!checkbox) return;

			checkbox.click();
		});
	}
}

document.addEventListener('astro:page-load', loadRadioGroups);
