interface Option {
	label: string;
	value: string;
	disabled?: boolean;
}

const allSearchSelects = document.querySelectorAll<HTMLDivElement>('.sui-search-select-label');

for (const container of allSearchSelects) {
	const hiddenSelect = container.querySelector<HTMLSelectElement>('select')!;
	const searchWrapper = container.querySelector<HTMLDivElement>('.sui-search-input-wrapper')!;
	const searchInput = searchWrapper.querySelector('input')!;
	const dropdown = container.querySelector('.sui-search-select-dropdown')!;
	let optionElements = container.querySelectorAll('li');

	let active = false;

	const options = JSON.parse(container.dataset.options!) as Option[];
	const id = container.dataset.id!;
	let filteredOptions = options;

	searchWrapper.addEventListener('click', () => {
		const { bottom, left, right, width, x, y, height } = searchWrapper.getBoundingClientRect();

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

		if (active) {
			searchInput.ariaExpanded = 'false';
			dropdown.classList.remove('active', 'above');
			active = false;
			return;
		}

		active = true;
		searchInput.ariaExpanded = 'true';

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
	});

	const handleSelection = (e: MouseEvent, option: HTMLLIElement) => {
		e.stopImmediatePropagation();

		if (option.id === `${id}-selected` || !id) return;

		const currentlySelected = document.getElementById(`${id}-selected`);

		if (currentlySelected) {
			currentlySelected.classList.remove('selected');
			currentlySelected.id = '';
		}

		option.id = `${id}-selected`;
		option.classList.add('selected');

		const index = options.findIndex((x) => x.value === option.dataset.value);
		focusIndex = index;

		const opt = options[index]!;
		hiddenSelect.value = opt.value;

		searchInput.placeholder = opt.label;
		dropdown.classList.remove('active', 'above');
		// searchInput.blur();

		searchInput.value = '';
		filteredOptions = options;
		constructOptionsBasedOnOptions(options);

		active = false;
	};

	for (const option of optionElements) {
		option.addEventListener('click', (e) => handleSelection(e, option));
	}

	window.addEventListener('scroll', () => {
		dropdown.classList.remove('active', 'above');
		active = false;
	});

	hideOnClickOutside(container);

	function hideOnClickOutside(element: HTMLElement) {
		const outsideClickListener = (event: MouseEvent) => {
			if (!element.contains(event.target! as Element) && isVisible(element) && active === true) {
				// or use: event.target.closest(selector) === null
				dropdown.classList.remove('active', 'above');
				active = false;
			}
		};

		document.addEventListener('click', outsideClickListener);
	}

	// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
	const isVisible = (elem: HTMLElement) =>
		!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

	let focusIndex = 0;

	const recomputeOptions = () => {
		for (const entry of optionElements) {
			if (Number.parseInt(entry.dataset.optionIndex!) === focusIndex) {
				entry.classList.add('focused');
			} else {
				entry.classList.remove('focused');
			}
		}
	};

	searchInput.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopImmediatePropagation();

			active = false;
			dropdown.classList.remove('active', 'above');
			searchInput.blur();

			return;
		}

		if (e.key === 'ArrowUp' && focusIndex > 0) {
			e.preventDefault();
			e.stopImmediatePropagation();

			focusIndex--;
			recomputeOptions();

			return;
		}

		if (
			e.key === 'ArrowDown' &&
			focusIndex + 1 < filteredOptions.filter((x) => !x.disabled).length
		) {
			e.preventDefault();
			e.stopImmediatePropagation();

			focusIndex++;
			recomputeOptions();

			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopImmediatePropagation();

			for (const entry of optionElements) {
				if (Number.parseInt(entry.dataset.optionIndex!) === focusIndex) {
					entry.click();
				}
			}

			return;
		}
	});

	searchInput.addEventListener('keyup', (e) => {
		if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

		if (searchInput.value.trim().length === 0) {
			constructOptionsBasedOnOptions(options);
			filteredOptions = options;
			return;
		}

		filteredOptions = options.filter((x) => x.label.includes(searchInput.value));
		focusIndex = 0;

		constructOptionsBasedOnOptions(filteredOptions);
	});

	function constructOptionsBasedOnOptions(options: Option[]) {
		dropdown.innerHTML = '';

		if (options.length === 0) {
			const element = document.createElement('li');
			element.classList.add('empty-search-results');
			element.textContent = 'No results found.';

			dropdown.appendChild(element);
		}

		let i = 0;

		for (const option of options) {
			const element = document.createElement('li');
			element.classList.add(
				...[
					'sui-search-select-option',
					option.disabled && 'disabled',
					focusIndex === i && 'focused',
				].filter((x) => typeof x === 'string')
			);
			element.role = 'option';
			element.value = Number.parseInt(option.value);
			element.id = '';
			element.dataset.optionIndex = i.toString();
			element.dataset.value = option.value;
			element.textContent = option.label;

			element.addEventListener('click', (e) => handleSelection(e, element));

			dropdown.appendChild(element);

			i++;
		}

		optionElements = container.querySelectorAll('li');
	}
}
