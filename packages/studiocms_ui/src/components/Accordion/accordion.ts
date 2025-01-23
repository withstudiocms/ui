function loadAccordions() {
	const allAccordions = document.querySelectorAll<HTMLDivElement>('.sui-accordion');

	for (const accordion of allAccordions) {
		const multipleOpen = accordion.dataset.multiple === 'true';

		const items = accordion.querySelectorAll<HTMLDivElement>('.sui-accordion-item');

		for (const item of items) {
			const summary = item.querySelector<HTMLDivElement>('.sui-accordion-summary');
			const content = item.querySelector<HTMLDivElement>('.sui-accordion-details');

			if (!content || !summary) continue;

			const itemWidth = item.getBoundingClientRect().width;
			content.style.width = `${itemWidth - 36}px`;

			let contentBoundingBox = content.getBoundingClientRect();

			content.style.width = 'auto';

			if (content.classList.contains('initial')) {
				content.classList.remove('initial');
				content.classList.add('active');
			}

			const open = item.dataset.open === 'true';
			if (open) {
				item.classList.add('active');
				content.style.maxHeight = `${contentBoundingBox.height}px`;
			}

			const toggleElement = () => {
				if (!multipleOpen) {
					for (const otherItem of items) {
						if (otherItem !== item) {
							otherItem.classList.remove('active');

							const otherContent =
								otherItem.querySelector<HTMLDivElement>('.sui-accordion-details');
							if (otherContent) {
								otherContent.style.maxHeight = '0';
							}
						}
					}
				}

				item.classList.toggle('active');

				if (item.classList.contains('active')) {
					content.style.maxHeight = `${contentBoundingBox.height}px`;
				} else {
					content.style.maxHeight = '0';
					content.classList.remove('open');
				}
			};

			summary.addEventListener('click', toggleElement);
			summary.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					toggleElement();
				}
			});

			let resetting = false;

			window.addEventListener('resize', async () => {
				if (item.classList.contains('active')) {
					content.style.maxHeight = 'none';
					contentBoundingBox = content.getBoundingClientRect();
					content.style.maxHeight = `${contentBoundingBox.height}px`;
				} else if (!resetting) {
					resetting = true;

					content.classList.remove('active');
					content.classList.add('initial');

					const itemWidth = item.getBoundingClientRect().width;

					content.style.width = `${itemWidth - 36}px`;
					content.style.maxHeight = 'none';

					contentBoundingBox = content.getBoundingClientRect();

					content.style.width = 'auto';
					content.style.maxHeight = '0';

					content.classList.add('active');
					content.classList.remove('initial');

					resetting = false;
				}
			});
		}
	}
}

document.addEventListener('astro:page-load', loadAccordions);
