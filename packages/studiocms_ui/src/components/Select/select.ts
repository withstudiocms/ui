function loadSelects() {
	const allSelects = document.querySelectorAll<HTMLDivElement>('.sui-select-label');

	for (const container of allSelects) {
		const hiddenSelect = container.querySelector('select')!;
		const button = container.querySelector('button')!;
		const valueSpan = container.querySelector('.sui-select-value-span')!;
		const dropdown = container.querySelector('.sui-select-dropdown')!;
		const optionElements = container.querySelectorAll<HTMLLIElement>('.sui-select-option');

		const options = JSON.parse(container.dataset.options!);
		const id = container.dataset.id!;
		let active = false;

		const closeDropdown = () => {
			dropdown.classList.remove('active', 'above');
			active = false;
			button.ariaExpanded = 'false';
			focusIndex = -1;

			for (const entry of optionElements) {
				entry.classList.remove('focused');
			}
		};

		const openDropdown = (toggle: boolean) => {
			const { bottom, left, right, width, x, y, height } = button.getBoundingClientRect();

			const optionHeight = 36;
			const totalBorderSize = 2;
			const margin = 4;

			const dropdownHeight = options.length * optionHeight + totalBorderSize + margin;

			const CustomRect = {
				top: bottom + margin,
				left,
				right,
				bottom: bottom + margin + dropdownHeight,
				width,
				height: dropdownHeight,
				x,
				y: y + height + margin,
			};

			if (active && toggle) {
				closeDropdown();
				return;
			}

			active = true;
			button.ariaExpanded = 'true';

			// Set focusIndex to currently selected option
			focusIndex = Array.from(optionElements).findIndex((x) => x.classList.contains('selected'));

			if (
				CustomRect.top >= 0 &&
				CustomRect.left >= 0 &&
				CustomRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				CustomRect.right <= (window.innerWidth || document.documentElement.clientWidth)
			) {
				dropdown.classList.add('active');
			} else {
				dropdown.classList.add('active', 'above');
			}
		};

		button.addEventListener('click', () => openDropdown(true));

		let focusIndex = -1;

		const recomputeOptions = () => {
			for (const entry of optionElements) {
				if (Number.parseInt(entry.dataset.optionIndex!) === focusIndex) {
					entry.classList.add('focused');
				} else {
					entry.classList.remove('focused');
				}
			}
		};

		button.addEventListener('keydown', (e) => {
			if (e.key === 'Tab' || e.key === 'Escape') {
				closeDropdown();
				return;
			}

			if (e.key === ' ' && !active) openDropdown(false);

			if (e.key === 'Enter') {
				const currentlyFocused = container.querySelector<HTMLElement>('.focused');
				if (currentlyFocused) {
					currentlyFocused.classList.remove('focused');
					currentlyFocused.click();

					// Stop dropdown from immediately reopening
					e.preventDefault();
					e.stopImmediatePropagation();
				}

				return;
			}

			e.preventDefault();
			e.stopImmediatePropagation();

			const neighbor = (offset: number) => {
				return optionElements.item(
					(Array.from(optionElements).findIndex((x) => x.classList.contains('selected')) ?? -1) +
						offset
				);
			};

			if (e.key === 'ArrowUp' && (focusIndex > 0 || !active)) {
				if (!active) return neighbor(-1)?.click();
				focusIndex--;
				recomputeOptions();
			}

			if (e.key === 'ArrowDown' && focusIndex + 1 < optionElements.length) {
				if (!active) return neighbor(1)?.click();
				focusIndex++;
				recomputeOptions();
			}

			if (e.key === 'PageUp') {
				focusIndex = 0;
				if (!active) return optionElements.item(focusIndex)?.click();
				recomputeOptions();
			}
			if (e.key === 'PageDown') {
				focusIndex = optionElements.length - 1;
				if (!active) return optionElements.item(focusIndex)?.click();
				recomputeOptions();
			}
		});

		const handleSelection = (e: MouseEvent, option: HTMLElement) => {
			e.stopImmediatePropagation();
			if (option.id === `${id}-selected` || !id) return;
			const currentlySelected = document.getElementById(`${id}-selected`);
			if (currentlySelected) {
				currentlySelected.classList.remove('selected');
				currentlySelected.id = '';
			}
			option.id = `${id}-selected`;
			option.classList.add('selected');
			const opt = options[Number.parseInt(option.dataset.optionIndex!)];
			hiddenSelect.value = opt.value;
			valueSpan.textContent = opt.label;
			closeDropdown();
		};

		for (const option of optionElements) {
			const handleSelectionForOption = (e: MouseEvent) => handleSelection(e, option);

			option.addEventListener('click', handleSelectionForOption);
		}

		window.addEventListener('scroll', closeDropdown);

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && dropdown.classList.contains('active')) {
				closeDropdown();
			}
		});

		hideOnClickOutside(container);

		function hideOnClickOutside(element: HTMLElement) {
			const outsideClickListener = (event: MouseEvent) => {
				if (
					!element.contains(event.target as HTMLElement) &&
					isVisible(element) &&
					active === true
				) {
					// or use: event.target.closest(selector) === null
					closeDropdown();
				}
			};

			document.addEventListener('click', outsideClickListener);
		}

		// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
		const isVisible = (elem: HTMLElement) =>
			!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	}
}

document.addEventListener('astro:page-load', loadSelects);
