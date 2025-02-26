type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

type SelectContainer = HTMLDivElement & {
	button: HTMLButtonElement | null;
	dropdown: HTMLUListElement | null;
	select: HTMLSelectElement | null;
};

type SelectState = {
	optionsMap: Record<string, SelectOption[]>;
	isMultipleMap: Record<string, boolean>;
	focusIndex: number;
	placeholder: string;
};

type ResizeCallback = (width: number, height: number, element: Element) => void;

function loadSelects() {
	const CONSTANTS = {
		OPTION_HEIGHT: 36,
		BORDER_SIZE: 2,
		MARGIN: 4,
		BADGE_PADDING: 80,
	} as const;

	const observerMap = new WeakMap<
		Element,
		{
			observer: ResizeObserver;
			callback: ResizeCallback;
		}
	>();

	function observeResize(element: Element, callback: ResizeCallback): () => void {
		// Clean up any existing observer for this element
		if (observerMap.has(element)) {
			unobserveResize(element);
		}
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				callback(width, height, entry.target);
			}
		});
		observer.observe(element);
		observerMap.set(element, { observer, callback });
		return () => unobserveResize(element);
	}

	function unobserveResize(element: Element): void {
		const data = observerMap.get(element);
		if (data) {
			data.observer.disconnect();
			observerMap.delete(element);
		}
	}

	const isVisible = (elem: HTMLElement): boolean =>
		elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;

	const getDropdownPosition = (button: HTMLButtonElement, optionsCount: number) => {
		const rect = button.getBoundingClientRect();
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

	const closeDropdown = (container: SelectContainer): void => {
		if (!container?.button || !container?.dropdown) return;
		container.dropdown.classList.remove('active', 'above');
		container.button.ariaExpanded = 'false';
	};

	const openDropdown = (state: SelectState, container: SelectContainer): void => {
		if (!container?.button || !container?.dropdown) return;

		const { isAbove } = getDropdownPosition(
			container.button,
			state.optionsMap[container.dataset.id as string]?.length ?? 0
		);

		container.button.ariaExpanded = 'true';
		container.dropdown.classList.add('active', ...(isAbove ? [] : ['above']));
	};

	const createSelectBadge = (value: string, label: string): HTMLSpanElement => {
		const badge = document.createElement('span');
		badge.classList.add('sui-badge', 'primary', 'sm', 'default', 'full', 'sui-select-badge');
		badge.setAttribute('data-value', value);
		badge.innerHTML = `${label} <svg style='min-width: 8px' xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24'><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 18L18 6M6 6l12 12'></path></svg>`;
		return badge;
	};

	const measureBadgesWidth = (
		activeSelects: NodeListOf<Element>
	): { totalWidth: number; badges: HTMLElement[]; tempContainer: HTMLElement } => {
		// Create temporary container for measurement
		const tempContainer = document.createElement('div');
		tempContainer.classList.add('sui-select-badge-container');
		tempContainer.style.position = 'absolute';
		tempContainer.style.visibility = 'hidden';
		document.body.appendChild(tempContainer);

		const badges = Array.from(activeSelects).map((select) =>
			createSelectBadge(
				select.getAttribute('value') ?? '',
				(select as HTMLLIElement).innerText.trim()
			)
		);

		for (const badge of badges) {
			tempContainer.appendChild(badge);
		}

		// Calculate total width including margins
		const totalWidth = badges.reduce((width, badge) => {
			const badgeStyle = window.getComputedStyle(badge);
			return (
				width +
				badge.offsetWidth +
				(Number.parseFloat(badgeStyle.marginLeft) || 0) +
				(Number.parseFloat(badgeStyle.marginRight) || 0)
			);
		}, 0);

		return { totalWidth, badges, tempContainer };
	};

	const handleBadgeOverflow = (state: SelectState, container: SelectContainer): void => {
		const buttonContainer = container?.button?.parentElement?.parentElement;
		const buttonValueSpan = container?.button?.querySelector(
			'.sui-select-value-span'
		) as HTMLSpanElement;
		const activeSelects = container?.dropdown?.querySelectorAll('.sui-select-option.selected');
		const overflowContainer = container?.querySelector('.sui-select-badge-container-below');

		if (!buttonContainer || !overflowContainer || !container?.button || !activeSelects) return;

		const parentContainer = buttonContainer.parentElement;
		if (!parentContainer) return;

		// Clear existing content
		overflowContainer.innerHTML = '';
		buttonValueSpan!.innerHTML = '';

		if (activeSelects.length === 0) {
			buttonValueSpan.innerText = state.placeholder;
			return;
		}

		// Measure badges
		const { totalWidth, badges, tempContainer } = measureBadgesWidth(activeSelects);

		// Get the maximum available width from the parent container
		const parentStyles = window.getComputedStyle(parentContainer);
		const availableWidth =
			parentContainer.clientWidth -
			(Number.parseFloat(parentStyles.paddingLeft) || 0) -
			(Number.parseFloat(parentStyles.paddingRight) || 0);

		const effectiveAvailableWidth = availableWidth - CONSTANTS.BADGE_PADDING;

		// Clean up temporary container
		document.body.removeChild(tempContainer);

		const finalBadgeContainer = document.createElement('div');
		finalBadgeContainer.classList.add('sui-select-badge-container');
		for (const badge of badges) {
			badge.querySelector('svg')?.setAttribute('tabindex', '0');
			finalBadgeContainer.appendChild(badge.cloneNode(true));
		}

		// Place badges based on available space
		if (totalWidth > effectiveAvailableWidth) {
			overflowContainer.appendChild(finalBadgeContainer);
		} else {
			buttonValueSpan.appendChild(finalBadgeContainer);
		}
	};

	const updateLabel = (state: SelectState, container: SelectContainer): void => {
		const isMultiple = state.isMultipleMap[container?.dataset.id as string];
		if (isMultiple) {
			handleBadgeOverflow(state, container);
		} else {
			const selected = container?.querySelector('.sui-select-option.selected') as HTMLLIElement;
			const selectedButtonSpan = container?.button?.querySelector(
				'.sui-select-value-span'
			) as HTMLSpanElement;
			if (selected && selectedButtonSpan) {
				selectedButtonSpan.innerText = selected.innerText.trim();
			}
		}
	};

	const deselectMultiOption = (
		state: SelectState,
		id: string,
		container: SelectContainer
	): void => {
		const selectOpt = container?.dropdown?.querySelector(
			`.sui-select-option[value='${id}']`
		) as HTMLOptionElement;
		const max = Number.parseInt(container?.dataset.multipleMax as string);
		const selectedCount = container?.querySelectorAll('.sui-select-option.selected').length ?? 0;
		const selectedCountEl = container?.querySelector(
			'.sui-select-max-span .sui-select-select-count'
		) as HTMLSpanElement;
		const isSelected = selectOpt?.classList.contains('selected');

		if (selectOpt && (isSelected || Number.isNaN(max) || selectedCount < max)) {
			selectOpt.classList.toggle('selected');
			const selectOptEl = container?.select?.querySelector(
				`option[value='${selectOpt.getAttribute('value')}']`
			) as HTMLOptionElement;
			if (selectOptEl) {
				selectOptEl.selected = !selectOpt.selected;
			}
			if (selectedCountEl) {
				selectedCountEl.innerText = String(selectedCount + (isSelected ? -1 : 1));
			}
			updateLabel(state, container);
		}
	};

	const recomputeOptions = (state: SelectState, container: SelectContainer): void => {
		const optionElements = container?.dropdown?.querySelectorAll(
			'.sui-select-option'
		) as NodeListOf<HTMLLIElement>;
		for (const entry of optionElements) {
			if (Number.parseInt(entry.dataset.optionIndex!) === state.focusIndex) {
				entry.classList.add('focused');
			} else {
				entry.classList.remove('focused');
			}
		}
	};

	const getInteractiveOptions = (container: SelectContainer): HTMLLIElement[] => {
		const allOptions = container?.dropdown?.querySelectorAll(
			'.sui-select-option'
		) as NodeListOf<HTMLLIElement>;
		return Array.from(allOptions).filter(
			(option) =>
				!option.classList.contains('hidden') &&
				!option.classList.contains('disabled') &&
				!option.hasAttribute('disabled')
		);
	};

	const handleOptionSelect = (
		target: HTMLElement,
		state: SelectState,
		container: SelectContainer
	): void => {
		const option = target.closest('.sui-select-option') as HTMLLIElement | null;
		const lastActive = container?.dropdown?.querySelector('.sui-select-option.selected');
		const isMultiple = state.isMultipleMap[container!.dataset.id as string];
		if (isMultiple) {
			deselectMultiOption(state, option?.getAttribute('value') as string, container);
		} else {
			if (lastActive) {
				lastActive.classList.remove('selected');
				const lastSelectOpt = container?.select?.querySelector(
					`option[value='${lastActive.getAttribute('value')}']`
				) as HTMLOptionElement;
				if (lastSelectOpt) {
					lastSelectOpt.selected = false;
				}
			}
			if (option) {
				option.classList.add('selected');
				const selectOpt = container?.select?.querySelector(
					`option[value='${option.getAttribute('value')}']`
				) as HTMLOptionElement;
				if (selectOpt) {
					selectOpt.selected = true;
				}
				updateLabel(state, container);
			}
			closeDropdown(container);
		}
	};

	const handleContainerClick = (
		e: MouseEvent,
		state: SelectState,
		container: SelectContainer
	): void => {
		const target = e.target as HTMLElement;
		if (target.closest('.sui-select-badge svg')) {
			deselectMultiOption(
				state,
				target.closest('.sui-select-badge')?.getAttribute('data-value') as string,
				container
			);
			handleBadgeOverflow(state, container);
		}
		if (target.closest('.sui-select-button')) {
			const container = target.closest('.sui-select-label') as SelectContainer;
			if (container.dropdown?.classList.contains('active')) {
				closeDropdown(container);
			} else {
				openDropdown(state, container);
			}
		}
		if (target.closest('.sui-select-dropdown.active')) {
			handleOptionSelect(target, state, container);
		}
	};

	const handleSelectKeyDown = (
		e: KeyboardEvent,
		state: SelectState,
		container: SelectContainer
	): void => {
		const active = !!container.dropdown?.classList.contains('active');
		const focusedElement = document.activeElement;

		if (e.key === 'Tab' || e.key === 'Escape') {
			closeDropdown(container);
			return;
		}

		if ((e.key === 'Enter' || e.key === ' ') && focusedElement?.tagName.toLowerCase() === 'svg') {
			const badgeElement = focusedElement?.closest('.sui-select-badge');
			if (badgeElement && state.isMultipleMap[container?.dataset.id as string]) {
				const badgeValue = badgeElement.getAttribute('data-value');
				let nextBadge = badgeElement.previousElementSibling as HTMLElement;
				if (!nextBadge) {
					nextBadge = badgeElement.nextElementSibling as HTMLElement;
				}
				const nextBadgeValue = nextBadge?.getAttribute('data-value');

				deselectMultiOption(state, badgeValue as string, container);
				handleBadgeOverflow(state, container);
				setTimeout(() => {
					if (nextBadgeValue) {
						const badgeToFocus = container?.querySelector(
							`.sui-select-badge[data-value="${nextBadgeValue}"] svg`
						) as HTMLElement;
						if (badgeToFocus) {
							badgeToFocus.focus();
						}
					} else {
						container?.button?.focus();
					}
				}, 0);
				e.preventDefault();
				e.stopImmediatePropagation();
				return;
			}
		}

		if ((e.key === ' ' || e.key === 'Enter') && !active) {
			openDropdown(state, container);
			e.preventDefault();
			e.stopImmediatePropagation();
			return;
		}

		if (e.key === 'Enter' && active) {
			const currentlyFocused = container?.querySelector<HTMLElement>('.sui-select-option.focused');
			if (currentlyFocused) {
				currentlyFocused.click();
				e.preventDefault();
				e.stopImmediatePropagation();
			}
			return;
		}

		e.preventDefault();
		e.stopImmediatePropagation();

		const interactiveOptions = getInteractiveOptions(container);
		const currentInteractiveIndex = interactiveOptions.findIndex((option) =>
			option.classList.contains('focused')
		);

		if (e.key === 'ArrowUp' && currentInteractiveIndex > 0) {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex - 1] as Element);
			recomputeOptions(state, container);
		}

		if (e.key === 'ArrowDown' && currentInteractiveIndex < interactiveOptions.length - 1) {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex + 1] as Element);
			recomputeOptions(state, container);
		}

		if (e.key === 'PageUp') {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[0] as Element);
			recomputeOptions(state, container);
		}

		if (e.key === 'PageDown') {
			state.focusIndex = Array.from(
				container?.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[interactiveOptions.length - 1] as Element);
			recomputeOptions(state, container);
		}
	};

	const state: SelectState = {
		optionsMap: {},
		isMultipleMap: {},
		focusIndex: -1,
		placeholder: '',
	};
	const selects = document.querySelectorAll<HTMLDivElement>('.sui-select-label');

	document.addEventListener('click', ({ target }) => {
		for (const container of selects) {
			if (!(container as SelectContainer).dropdown?.classList.contains('active') || !target)
				continue;
			if (!container.contains(target as HTMLElement) && isVisible(container)) {
				closeDropdown(container as SelectContainer);
			}
		}
	});

	for (const container of selects) {
		const id = container.dataset.id as string;
		const specialContainer = Object.assign(container, {
			button: container.querySelector('button'),
			dropdown: container.querySelector('.sui-select-dropdown') as HTMLUListElement,
			select: container.querySelector('select'),
		});

		state.placeholder =
			(specialContainer.button?.querySelector('.sui-select-value-span') as HTMLSpanElement)
				?.innerText ?? '';
		state.optionsMap[id] = JSON.parse(container.dataset.options as string);
		state.isMultipleMap[id] = container.dataset.multiple === 'true';

		specialContainer.addEventListener('click', (e) =>
			handleContainerClick(e, state, specialContainer)
		);
		specialContainer.addEventListener('keydown', (e) =>
			handleSelectKeyDown(e, state, specialContainer)
		);
		if (state.isMultipleMap[id]) {
			observeResize(specialContainer.button!, () => {
				handleBadgeOverflow(state, specialContainer);
			});
			handleBadgeOverflow(state, specialContainer);
		}
	}
}

document.addEventListener('astro:page-load', loadSelects);