export type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

type SelectContainer = HTMLDivElement & {
	button: HTMLButtonElement | null;
	dropdown: HTMLUListElement | null;
	select: HTMLSelectElement | null;
};

interface SelectState {
	options: SelectOption[];
	isMultiple: boolean;
	focusIndex: number;
	placeholder: string;
}

type ResizeCallback = (width: number, height: number, element: Element) => void;

export class SUISelectElement extends HTMLElement {
	public readonly CONSTANTS = {
		OPTION_HEIGHT: 36,
		BORDER_SIZE: 2,
		MARGIN: 4,
		BADGE_PADDING: 80,
	};

	public observerMap = new WeakMap<
		Element,
		{
			observer: ResizeObserver;
			callback: ResizeCallback;
		}
	>();

	public state: SelectState = {
		options: [],
		isMultiple: false,
		focusIndex: -1,
		placeholder: '',
	};

	public button: HTMLButtonElement | undefined;
	public dropdown: HTMLDivElement | undefined;
	public select: HTMLSelectElement | undefined;

	// biome-ignore lint/complexity/noUselessConstructor: custom element requirement
	constructor() {
		super();
	}

	connectedCallback() {
		this.button = this.querySelector<HTMLButtonElement>('.sui-select-button')!;
		this.dropdown = this.querySelector<HTMLDivElement>('.sui-select-dropdown')!;
		this.select = this.querySelector<HTMLSelectElement>('select')!;

		// TODO(louisescher): This adds one listener per select at the moment.
		// I'm unsure if this makes sense to keep for the full release, will need testing.
		document.addEventListener('click', ({ target }) => {
			if (this.dropdown?.classList.contains('active') || !target) {
				return;
			}

			if (!this.contains(target as HTMLElement) && this.isVisible(this)) {
				this.closeDropdown();
			}
		});

		this.state.placeholder =
			(this.button?.querySelector('.sui-select-value-span') as HTMLSpanElement)?.innerText ?? '';

		this.state.options = JSON.parse(this.dataset.options as string);
		this.state.isMultiple = this.dataset.multiple === 'true';

		this.addEventListener('click', (e) => this.handleContainerClick(e));

		this.addEventListener('keydown', (e) => this.handleSelectKeyDown(e));

		if (this.state.isMultiple) {
			this.observeResize(this.button!, () => {
				this.handleBadgeOverflow();
			});
			this.handleBadgeOverflow();
		}
	}

	private observeResize = (element: Element, callback: ResizeCallback): (() => void) => {
		// Clean up any existing observer for this element
		if (this.observerMap.has(element)) {
			this.unobserveResize(element);
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				callback(width, height, entry.target);
			}
		});

		observer.observe(element);
		this.observerMap.set(element, { observer, callback });

		return () => this.unobserveResize(element);
	};

	private unobserveResize = (element: Element): void => {
		const data = this.observerMap.get(element);

		if (data) {
			data.observer.disconnect();
			this.observerMap.delete(element);
		}
	};

	private isVisible = (elem: HTMLElement): boolean =>
		elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;

	public getDropdownPosition = (element: HTMLElement) => {
		const rect = element.getBoundingClientRect();
		const optionsCount = this.state.options?.length ?? 0;

		const { OPTION_HEIGHT, BORDER_SIZE, MARGIN } = this.CONSTANTS;

		const dropdownHeight = optionsCount * OPTION_HEIGHT + BORDER_SIZE + MARGIN;

		const customRect = {
			top: rect.bottom + MARGIN,
			bottom: rect.bottom + MARGIN + dropdownHeight,
			left: rect.left,
			right: rect.right,
			width: rect.width,
			x: rect.x,
			y: rect.y + rect.height + this.CONSTANTS.MARGIN,
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

	private closeDropdown = (): void => {
		if (!this?.button || !this?.dropdown) return;

		this.dropdown.classList.remove('active', 'above');
		this.button.ariaExpanded = 'false';
	};

	private openDropdown = (): void => {
		if (!this.button || !this.dropdown) return;

		const { isAbove } = this.getDropdownPosition(this.button);

		this.button.ariaExpanded = 'true';
		this.dropdown.classList.add('active', ...(isAbove ? [] : ['above']));
	};

	public createSelectBadge = (value: string, label: string): HTMLSpanElement => {
		const badge = document.createElement('span');

		badge.classList.add('sui-badge', 'primary', 'sm', 'outlined', 'full', 'sui-select-badge');
		badge.setAttribute('data-value', value);
		badge.innerHTML = `${label} <svg style='min-width: 8px' xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24'><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 18L18 6M6 6l12 12'></path></svg>`;

		return badge;
	};

	private measureBadgesWidth = (
		activeSelects: NodeListOf<Element>
	): { totalWidth: number; badges: HTMLElement[]; tempContainer: HTMLElement } => {
		// Create temporary container for measurement
		const tempContainer = document.createElement('div');

		tempContainer.classList.add('sui-select-badge-container');
		tempContainer.style.position = 'absolute';
		tempContainer.style.visibility = 'hidden';

		document.body.appendChild(tempContainer);

		const badges = Array.from(activeSelects).map((select) =>
			this.createSelectBadge(
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

	private handleBadgeOverflow = (): void => {
		const buttonContainer = this.button?.parentElement?.parentElement;
		const buttonValueSpan = this.button?.querySelector('.sui-select-value-span') as HTMLSpanElement;
		const activeSelects = this.dropdown?.querySelectorAll('.sui-select-option.selected');
		const overflowContainer = this.querySelector('.sui-select-badge-container-below');

		if (!buttonContainer || !overflowContainer || !this.button || !activeSelects) return;

		const parentContainer = buttonContainer.parentElement;

		if (!parentContainer) return;

		// Clear existing content
		overflowContainer.innerHTML = '';
		buttonValueSpan!.innerHTML = '';

		if (activeSelects.length === 0) {
			buttonValueSpan.innerText = this.state.placeholder;
			return;
		}

		// Measure badges
		const { totalWidth, badges, tempContainer } = this.measureBadgesWidth(activeSelects);

		// Get the maximum available width from the parent container
		const parentStyles = window.getComputedStyle(parentContainer);
		const availableWidth =
			parentContainer.clientWidth -
			(Number.parseFloat(parentStyles.paddingLeft) || 0) -
			(Number.parseFloat(parentStyles.paddingRight) || 0);

		const effectiveAvailableWidth = availableWidth - this.CONSTANTS.BADGE_PADDING;

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

	public updateLabel = (): void => {
		if (this.state.isMultiple) {
			this.handleBadgeOverflow();
		} else {
			const selected = this.querySelector('.sui-select-option.selected') as HTMLLIElement;

			const selectedButtonSpan = this.button?.querySelector(
				'.sui-select-value-span'
			) as HTMLSpanElement;

			if (selected && selectedButtonSpan) {
				selectedButtonSpan.innerText = selected.innerText.trim();
			}
		}
	};

	private deselectMultiOption = (id: string): void => {
		const selectOpt = this.dropdown?.querySelector(
			`.sui-select-option[value='${id}']`
		) as HTMLOptionElement;

		const max = Number.parseInt(this.dataset.multipleMax as string, 10);
		const selectedCount = this.querySelectorAll('.sui-select-option.selected').length ?? 0;

		const selectedCountEl = this.querySelector(
			'.sui-select-max-span .sui-select-select-count'
		) as HTMLSpanElement;

		const isSelected = selectOpt?.classList.contains('selected');

		if (selectOpt && (isSelected || Number.isNaN(max) || selectedCount < max)) {
			selectOpt.classList.toggle('selected');

			const selectOptEl = this.select?.querySelector(
				`option[value='${selectOpt.getAttribute('value')}']`
			) as HTMLOptionElement;

			if (selectOptEl) {
				selectOptEl.selected = !selectOpt.selected;
			}

			if (selectedCountEl) {
				selectedCountEl.innerText = String(selectedCount + (isSelected ? -1 : 1));
			}

			this.updateLabel();
		}
	};

	public recomputeOptions = (): void => {
		const optionElements = this.dropdown?.querySelectorAll(
			'.sui-select-option'
		) as NodeListOf<HTMLLIElement>;

		for (const entry of optionElements) {
			if (Number.parseInt(entry.dataset.optionIndex!, 10) === this.state.focusIndex) {
				entry.classList.add('focused');
			} else {
				entry.classList.remove('focused');
			}
		}
	};

	public getInteractiveOptions = (): HTMLLIElement[] => {
		const allOptions = this.dropdown?.querySelectorAll(
			'.sui-select-option'
		) as NodeListOf<HTMLLIElement>;

		return Array.from(allOptions).filter(
			(option) =>
				!option.classList.contains('hidden') &&
				!option.classList.contains('disabled') &&
				!option.hasAttribute('disabled')
		);
	};

	private handleOptionSelect = (target: HTMLElement): void => {
		const option = target.closest('.sui-select-option') as HTMLLIElement | null;
		const lastActive = this.dropdown?.querySelector('.sui-select-option.selected');
		const isMultiple = this.state.isMultiple;

		if (isMultiple) {
			this.deselectMultiOption(option?.getAttribute('value') as string);
		} else {
			if (lastActive) {
				lastActive.classList.remove('selected');
			}

			if (option) {
				option.classList.add('selected');

				if (this.select) {
					this.select.value = option.getAttribute('value') as string;
				}

				this.updateLabel();
			}

			this.closeDropdown();
		}
	};

	private handleContainerClick = (e: MouseEvent): void => {
		const target = e.target as HTMLElement;

		if (target.closest('.sui-select-badge svg')) {
			this.deselectMultiOption(
				target.closest('.sui-select-badge')?.getAttribute('data-value') as string
			);
			this.handleBadgeOverflow();
		}

		if (target.closest('.sui-select-button')) {
			const container = target.closest('.sui-select-label') as SelectContainer;
			if (container.dropdown?.classList.contains('active')) {
				this.closeDropdown();
			} else {
				this.openDropdown();
			}
		}

		if (target.closest('.sui-select-dropdown.active')) {
			this.handleOptionSelect(target);
		}
	};

	public handleSelectKeyDown = (e: KeyboardEvent): void => {
		const active = !!this.dropdown?.classList.contains('active');
		const focusedElement = document.activeElement;

		if (e.key === 'Tab' || e.key === 'Escape') {
			this.closeDropdown();
			return;
		}

		if ((e.key === 'Enter' || e.key === ' ') && focusedElement?.tagName.toLowerCase() === 'svg') {
			const badgeElement = focusedElement?.closest('.sui-select-badge');

			if (badgeElement && this.state.isMultiple) {
				const badgeValue = badgeElement.getAttribute('data-value');

				let nextBadge = badgeElement.previousElementSibling as HTMLElement;

				if (!nextBadge) {
					nextBadge = badgeElement.nextElementSibling as HTMLElement;
				}

				const nextBadgeValue = nextBadge?.getAttribute('data-value');

				this.deselectMultiOption(badgeValue as string);
				this.handleBadgeOverflow();

				setTimeout(() => {
					if (nextBadgeValue) {
						const badgeToFocus = this.querySelector(
							`.sui-select-badge[data-value="${nextBadgeValue}"] svg`
						) as HTMLElement;
						if (badgeToFocus) {
							badgeToFocus.focus();
						}
					} else {
						this.button?.focus();
					}
				}, 0);

				e.preventDefault();
				e.stopImmediatePropagation();

				return;
			}
		}

		if ((e.key === ' ' || e.key === 'Enter') && !active) {
			this.openDropdown();
			e.preventDefault();
			e.stopImmediatePropagation();
			return;
		}

		if (e.key === 'Enter' && active) {
			const currentlyFocused = this.querySelector<HTMLElement>('.sui-select-option.focused');

			if (currentlyFocused) {
				currentlyFocused.click();
				e.preventDefault();
				e.stopImmediatePropagation();
			}

			return;
		}

		e.preventDefault();
		e.stopImmediatePropagation();

		const interactiveOptions = this.getInteractiveOptions();
		const currentInteractiveIndex = interactiveOptions.findIndex((option) =>
			option.classList.contains('focused')
		);

		if (e.key === 'ArrowUp' && currentInteractiveIndex > 0) {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex - 1] as Element);

			this.recomputeOptions();
		}

		if (e.key === 'ArrowDown' && currentInteractiveIndex < interactiveOptions.length - 1) {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex + 1] as Element);

			this.recomputeOptions();
		}

		if (e.key === 'PageUp') {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[0] as Element);

			this.recomputeOptions();
		}

		if (e.key === 'PageDown') {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-select-option') || []
			).indexOf(interactiveOptions[interactiveOptions.length - 1] as Element);

			this.recomputeOptions();
		}
	};
}

customElements.define('sui-select', SUISelectElement);
