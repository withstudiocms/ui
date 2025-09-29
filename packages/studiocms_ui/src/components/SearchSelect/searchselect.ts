type SearchSelectOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

type SearchSelectContainer = HTMLDivElement & {
	input: HTMLInputElement | null;
	dropdown: Element | null;
	select: HTMLSelectElement | null;
};

type SearchSelectState = {
	optionsMap: Record<string, SelectOption[]>;
	isMultipleMap: Record<string, boolean>;
	selectedOptionsMap: Record<string, string[]>;
	placeholderMap: Record<string, string>;
	focusIndex: number;
	isSelectingOption: boolean;
};

function loadSearchSelects() {
	const CONSTANTS = {
		OPTION_HEIGHT: 36,
		BORDER_SIZE: 2,
		MARGIN: 4,
		BADGE_PADDING: 80,
	} as const;

	const getDropdownPosition = (input: HTMLInputElement, optionsCount: number) => {
		const rect = input.getBoundingClientRect();
		const dropdownHeight =
			optionsCount * CONSTANTS.OPTION_HEIGHT + CONSTANTS.BORDER_SIZE + CONSTANTS.MARGIN;

		const customRect = {
			top: rect.bottom + CONSTANTS.MARGIN,
			bottom: rect.bottom + CONSTANTS.MARGIN + dropdownHeight,
			left: rect.left,
			right: rect.right,
			width: rect.width,
			x: rect.x,
			y: rect.y + rect.height + CONSTANTS.MARGIN,
			height: dropdownHeight,
		};

		return {
			isAbove:
				customRect.top >= 0 &&
				customRect.left >= 0 &&
				customRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				customRect.right <= (window.innerWidth || document.documentElement.clientWidth),
			customRect,
		};
	};

	const createSelectBadge = (value: string, label: string): HTMLSpanElement => {
		const badge = document.createElement('span');

		badge.classList.add(
			'sui-badge',
			'primary',
			'sm',
			'outlined',
			'full',
			'sui-search-select-badge'
		);
		badge.setAttribute('data-value', value);
		badge.innerHTML = `${label} <svg style='min-width: 8px' xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' role="button" tabindex="0"><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 18L18 6M6 6l12 12'></path></svg>`;

		return badge;
	};

	const recalculateBadges = (state: SearchSelectState, container: SearchSelectContainer) => {
		const badgeContainer = container.querySelector('.sui-search-select-badge-container');

		if (!badgeContainer || !container.input) return;

		badgeContainer.innerHTML = '';

		const selectedValues = state.selectedOptionsMap[container.dataset.id as string] || [];
		const allOptions = state.optionsMap[container.dataset.id as string] || [];

		if (selectedValues.length === 0) {
			container.input.placeholder = state.placeholderMap[container.dataset.id as string] ?? '';
			return;
		}

		for (const value of selectedValues.sort((a, b) => {
			const numA = Number.parseInt(a.match(/\d+/)?.[0] || '0', 10);
			const numB = Number.parseInt(b.match(/\d+/)?.[0] || '0', 10);
			return numA - numB;
		})) {
			const option = allOptions.find((opt) => opt.value === value);
			if (option) {
				const newBadge = createSelectBadge(value, option.label);
				badgeContainer.appendChild(newBadge);
			}
		}
	};

	const updateLabel = (
		isMultiple: boolean,
		state: SearchSelectState,
		container: SearchSelectContainer
	) => {
		const selectedInput = container?.input;

		if (isMultiple) {
			recalculateBadges(state, container);

			if (selectedInput) {
				selectedInput.placeholder = state.placeholderMap[container.dataset.id as string] ?? '';
			}
		} else {
			const selected = container.querySelector(
				'.sui-search-select-option.selected'
			) as HTMLLIElement;

			if (selected && selectedInput) {
				selectedInput.placeholder = selected.innerText.trim();
			}
		}
	};

	const updateOptionSelection = (
		value: string,
		container: SearchSelectContainer,
		state: SearchSelectState,
		forceState?: boolean
	): boolean => {
		const currentSelected = state.selectedOptionsMap[container.dataset.id as string] || [];
		const isCurrentlySelected = currentSelected.includes(value);
		const max = Number.parseInt(container.dataset.multipleMax as string, 10);

		if (!isCurrentlySelected && !Number.isNaN(max) && currentSelected.length >= max) {
			return false;
		}

		const newSelected = isCurrentlySelected
			? currentSelected.filter((v) => v !== value)
			: [...currentSelected, value];

		state.selectedOptionsMap[container.dataset.id as string] = newSelected;

		const option = container.dropdown?.querySelector(
			`.sui-search-select-option[data-value='${value}']`
		) as HTMLLIElement;

		if (option) {
			option.classList.toggle('selected', forceState ?? !isCurrentlySelected);

			if (container?.select) {
				container.select.value = option.getAttribute('value') as string;
			}
		}

		const selectedCountEl = container.querySelector(
			'.sui-search-select-max-span .sui-search-select-select-count'
		) as HTMLSpanElement;

		if (selectedCountEl) {
			selectedCountEl.innerText = String(newSelected.length);
		}

		return true;
	};

	const toggleMultiOption = (
		id: string,
		container: SearchSelectContainer,
		state: SearchSelectState
	) => {
		const success = updateOptionSelection(id, container, state);

		if (success) {
			recalculateBadges(state, container);
		}
	};

	const recomputeOptions = (state: SearchSelectState, container: SearchSelectContainer): void => {
		const optionElements = container?.dropdown?.querySelectorAll(
			'.sui-search-select-option'
		) as NodeListOf<HTMLLIElement>;

		for (const entry of optionElements) {
			if (Number.parseInt(entry.dataset.optionIndex!, 10) === state.focusIndex) {
				entry.classList.add('focused');
			} else {
				entry.classList.remove('focused');
			}
		}
	};

	const reconstructOptions = (
		filteredOptions: SearchSelectOption[],
		state: SearchSelectState,
		container: SearchSelectContainer
	): void => {
		container.dropdown!.innerHTML = '';

		const selectedValues = state.selectedOptionsMap[container.dataset.id as string] || [];

		if (filteredOptions.length === 0) {
			container.dropdown!.innerHTML = '<li class="empty-search-results">No results found</li>';
			return;
		}

		let i = 0;

		for (const option of filteredOptions) {
			const element = document.createElement('li');
			element.classList.add('sui-search-select-option');
			if (option.disabled) {
				element.classList.add('disabled');
			}
			if (selectedValues.includes(option.value)) {
				element.classList.add('selected');
			}
			element.role = 'option';
			element.dataset.optionIndex = i.toString();
			element.dataset.value = option.value;
			element.textContent = option.label;
			container.dropdown?.appendChild(element);
			i++;
		}
	};

	const getInteractiveOptions = (container: SearchSelectContainer): HTMLLIElement[] => {
		const allOptions = container?.dropdown?.querySelectorAll(
			'.sui-search-select-option'
		) as NodeListOf<HTMLLIElement>;

		return Array.from(allOptions).filter(
			(option) =>
				!option.classList.contains('hidden') &&
				!option.classList.contains('disabled') &&
				!option.hasAttribute('disabled')
		);
	};

	const handleContainerMouseDown = (
		e: MouseEvent,
		state: SearchSelectState,
		container: SearchSelectContainer
	) => {
		const target = e.target as HTMLElement;

		if (!target.closest('input')) {
			e.preventDefault();
		}

		if (container.input?.value.length === 0) {
			reconstructOptions(state.optionsMap[container.dataset.id as string] ?? [], state, container);
		}

		if (target.closest('.sui-search-select-indicator')) {
			if (container.dropdown?.parentElement?.classList.contains('active')) {
				container.dropdown?.parentElement?.classList.remove('active', 'above');
				container.input?.blur();
				container.input!.value = '';
			} else {
				container.dropdown?.parentElement?.classList.add('active');
				container.input?.focus();
				container.input!.value = '';
			}
			return;
		}

		if (target.closest('.sui-search-select-badge-container')) {
			container.dropdown?.parentElement?.classList.remove('active', 'above');
			container.input?.blur();
			container.input!.value = '';
		}

		state.isSelectingOption = true;

		setTimeout(() => {
			state.isSelectingOption = false;
		}, 0);

		if (target.closest('.sui-search-select-badge svg')) {
			const value = target
				.closest('.sui-search-select-badge')
				?.getAttribute('data-value') as string;

			const success = updateOptionSelection(value, container, state);

			if (success) {
				recalculateBadges(state, container);
			}

			return;
		}

		const opt = target.closest('.sui-search-select-option') as HTMLLIElement | null;

		if (!opt?.dataset.value) return;

		if (opt.classList.contains('disabled') || opt.hasAttribute('disabled')) {
			container.input?.focus();
			return;
		}

		const isMultiple = state.isMultipleMap[container.dataset.id as string];

		if (isMultiple) {
			const success = updateOptionSelection(opt.dataset.value, container, state);

			if (success) {
				updateLabel(true, state, container);
				recalculateBadges(state, container);
			}
		} else {
			const currentSelected = state.selectedOptionsMap[container.dataset.id as string] || [];

			for (const value of currentSelected) {
				updateOptionSelection(value, container, state, false);
			}

			updateOptionSelection(opt.dataset.value, container, state, true);
			updateLabel(false, state, container);

			container.dropdown?.parentElement?.classList.remove('active', 'above');
			container.input?.blur();
			container.input!.value = '';
		}
	};

	const handleSelectKeyDown = (
		e: KeyboardEvent,
		state: SearchSelectState,
		container: SearchSelectContainer
	): void => {
		const focusedElement = document.activeElement;

		if (e.key === 'Escape' || e.key === 'Tab') {
			container.input?.blur();
			container.dropdown?.parentElement?.classList.remove('active', 'above');
			return;
		}

		if ((e.key === 'Enter' || e.key === ' ') && focusedElement?.tagName.toLowerCase() === 'svg') {
			const badgeElement = focusedElement?.closest('.sui-search-select-badge');

			if (badgeElement && state.isMultipleMap[container?.dataset.id as string]) {
				const badgeValue = badgeElement.getAttribute('data-value');
				let nextBadge = badgeElement.previousElementSibling as HTMLElement;

				if (!nextBadge) {
					nextBadge = badgeElement.nextElementSibling as HTMLElement;
				}

				const nextBadgeValue = nextBadge?.getAttribute('data-value');

				toggleMultiOption(badgeValue as string, container, state);
				recalculateBadges(state, container);

				setTimeout(() => {
					if (nextBadgeValue) {
						const badgeToFocus = container?.querySelector(
							`.sui-search-select-badge[data-value="${nextBadgeValue}"] svg`
						) as HTMLElement;
						if (badgeToFocus) {
							badgeToFocus.focus();
						}
					}
				}, 0);

				e.preventDefault();
				e.stopImmediatePropagation();

				return;
			}
		}

		const interactiveOptions = getInteractiveOptions(container);
		const currentInteractiveIndex = interactiveOptions.findIndex((option) =>
			option.classList.contains('focused')
		);

		if (e.key === 'ArrowUp' && currentInteractiveIndex > 0) {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex - 1] as Element);

			recomputeOptions(state, container);

			return;
		}

		if (e.key === 'ArrowDown' && currentInteractiveIndex < interactiveOptions.length - 1) {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex + 1] as Element);

			recomputeOptions(state, container);

			return;
		}

		if (e.key === 'PageUp') {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[0] as Element);

			recomputeOptions(state, container);

			return;
		}

		if (e.key === 'PageDown') {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[interactiveOptions.length - 1] as Element);

			recomputeOptions(state, container);

			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopImmediatePropagation();

			const optionElements = container?.dropdown?.querySelectorAll(
				'.sui-search-select-option'
			) as NodeListOf<HTMLLIElement>;

			const focusedOption = Array.from(optionElements).find(
				(entry) => Number.parseInt(entry.dataset.optionIndex!, 10) === state.focusIndex
			);

			if (
				focusedOption &&
				!focusedOption.classList.contains('disabled') &&
				!focusedOption.hasAttribute('disabled')
			) {
				const value = focusedOption.dataset.value;

				if (!value) return;

				const isMultiple = state.isMultipleMap[container.dataset.id as string];

				if (isMultiple) {
					const success = updateOptionSelection(value, container, state);

					if (success) {
						updateLabel(true, state, container);
						recalculateBadges(state, container);
					}
				} else {
					const currentSelected = state.selectedOptionsMap[container.dataset.id as string] || [];

					for (const existingValue of currentSelected) {
						updateOptionSelection(existingValue, container, state, false);
					}

					updateOptionSelection(value, container, state, true);
					updateLabel(false, state, container);

					container.dropdown?.parentElement?.classList.remove('active', 'above');
					container.input!.value = '';
				}
			}

			return;
		}
	};

	const handleInputKeyup = (
		e: KeyboardEvent,
		state: SearchSelectState,
		container: SearchSelectContainer
	): void => {
		if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

		const value = (container.input as HTMLInputElement).value.trim().toLowerCase();
		const allOptions = state.optionsMap[container.dataset.id as string];

		// If input is empty, show all options
		if (value.length === 0) {
			reconstructOptions(allOptions!, state, container);
			return;
		}

		// Otherwise filter options
		const filteredOptions =
			allOptions?.filter((option) => option.label.toLowerCase().includes(value)) ?? [];

		state.focusIndex = 0;

		reconstructOptions(filteredOptions, state, container);
	};

	const handleContainerFocusOut = (state: SearchSelectState, container: SearchSelectContainer) => {
		if (state.isSelectingOption) return;

		container.input!.value = '';
		reconstructOptions(state.optionsMap[container.dataset.id as string] ?? [], state, container);
		container.dropdown?.parentElement?.classList.remove('active', 'above');
	};

	const handleContainerFocusIn = (state: SearchSelectState, container: SearchSelectContainer) => {
		const allDropdowns = document.querySelectorAll('.sui-search-select-dropdown-list');

		for (const dropdown of allDropdowns) {
			if (dropdown !== container.dropdown) {
				dropdown.parentElement?.classList.remove('active', 'above');
			}
		}

		const { isAbove } = getDropdownPosition(
			container.input as HTMLInputElement,
			state.optionsMap[container.dataset.id as string]?.length ?? 0
		);

		container.dropdown?.parentElement?.classList.add('active', ...(isAbove ? [] : ['above']));
	};

	const state: SearchSelectState = {
		optionsMap: {},
		isMultipleMap: {},
		placeholderMap: {},
		selectedOptionsMap: {},
		focusIndex: 0,
		isSelectingOption: false,
	};

	const selects = document.querySelectorAll<HTMLDivElement>('.sui-search-select-label');

	for (const container of selects) {
		if (container.dataset.initialized === 'true') continue;

		const id = container.dataset.id as string;

		const specialContainer = Object.assign(container, {
			input: container.querySelector('input'),
			dropdown: container.querySelector('.sui-search-select-dropdown-list'),
			select: container.querySelector('select'),
		});

		const selectedOptions = Array.from(
			specialContainer.dropdown?.querySelectorAll('.sui-search-select-option.selected') ?? []
		);

		state.placeholderMap[id] = specialContainer.input?.placeholder ?? '';
		state.optionsMap[id] = JSON.parse(container.dataset.options ?? '{}');
		state.isMultipleMap[id] = container.dataset.multiple === 'true';
		state.selectedOptionsMap[id] = selectedOptions.map((x) => x.getAttribute('data-value') ?? '');

		specialContainer.input?.addEventListener('focusin', () =>
			handleContainerFocusIn(state, specialContainer)
		);

		specialContainer.addEventListener('focusout', () =>
			handleContainerFocusOut(state, specialContainer)
		);

		specialContainer.addEventListener('keydown', (e) =>
			handleSelectKeyDown(e, state, specialContainer)
		);

		specialContainer.input?.addEventListener('keyup', (e) =>
			handleInputKeyup(e, state, specialContainer)
		);

		// In order to ensure the blur/focusout event is triggered before the click event, we need to set a timeout
		// to set the isSelectingOption state to false after the click event has been handled
		// If we don't want to do this, we need to set a 100-200ms timeout to ensure the blur/focusout event is triggered
		specialContainer.addEventListener('mousedown', (e) =>
			handleContainerMouseDown(e, state, specialContainer)
		);

		if (state.isMultipleMap[id]) {
			recalculateBadges(state, specialContainer);
		}

		container.dataset.initialized = 'true';
	}
}

document.addEventListener('astro:page-load', loadSearchSelects);
