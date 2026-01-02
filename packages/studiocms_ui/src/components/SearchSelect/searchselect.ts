import { type SelectOption, SUISelectElement } from 'studiocms:ui/components/select/script';

type SearchSelectOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

interface SearchSelectState {
	options: SelectOption[];
	isMultiple: boolean;
	focusIndex: number;
	placeholder: string;
	selectedOptions: string[];
	isSelectingOption: boolean;
}

class SUIComboboxElement extends SUISelectElement {
	private input: HTMLInputElement | undefined;

	public state: SearchSelectState = {
		options: [],
		isMultiple: false,
		focusIndex: -1,
		placeholder: '',
		selectedOptions: [],
		isSelectingOption: false,
	};

	constructor() {
		super();
	}

	connectedCallback(): void {
		this.input = this.querySelector<HTMLInputElement>('input')!;
		this.dropdown = this.querySelector<HTMLInputElement>('.sui-search-select-dropdown-list')!;

		const selectedOptions = Array.from(
			this.dropdown?.querySelectorAll('.sui-search-select-option.selected') ?? []
		);

		this.state.placeholder = this.input?.placeholder ?? '';
		this.state.options = JSON.parse(this.dataset.options ?? '{}');
		this.state.isMultiple = this.dataset.multiple === 'true';
		this.state.selectedOptions = selectedOptions.map((x) => x.getAttribute('data-value') ?? '');

		this.input?.addEventListener('focusin', () => this.handleContainerFocusIn());

		this.addEventListener('focusout', () => this.handleContainerFocusOut());

		this.addEventListener('keydown', (e) => this.handleSelectKeyDown(e));

		this.input?.addEventListener('keyup', (e) => this.handleInputKeyup(e));

		// In order to ensure the blur/focusout event is triggered before the click event, we need to set a timeout
		// to set the isSelectingOption state to false after the click event has been handled
		// If we don't want to do this, we need to set a 100-200ms timeout to ensure the blur/focusout event is triggered
		this.addEventListener('mousedown', (e) => this.handleContainerMouseDown(e));

		if (this.state.isMultiple) {
			this.recalculateBadges();
		}
	}

	public createSearchSelectBadge = (value: string, label: string): HTMLSpanElement => {
		const badge = this.createSelectBadge(value, label);

		badge.classList.remove('sui-select-badge');
		badge.classList.add('sui-search-select-badge');

		return badge;
	};

	public recalculateBadges = () => {
		const badgeContainer = this.querySelector('.sui-search-select-badge-container');

		if (!badgeContainer || !this.input) return;

		badgeContainer.innerHTML = '';

		const selectedValues = this.state.selectedOptions;
		const allOptions = this.state.options;

		if (selectedValues.length === 0) {
			this.input.placeholder = this.state.placeholder ?? '';
			return;
		}

		for (const value of selectedValues.sort((a, b) => {
			const numA = Number.parseInt(a.match(/\d+/)?.[0] || '0', 10);
			const numB = Number.parseInt(b.match(/\d+/)?.[0] || '0', 10);
			return numA - numB;
		})) {
			const option = allOptions.find((opt) => opt.value === value);
			if (option) {
				const newBadge = this.createSearchSelectBadge(value, option.label);
				badgeContainer.appendChild(newBadge);
			}
		}
	};

	public updateLabel = () => {
		const selectedInput = this.input;

		if (this.state.isMultiple) {
			this.recalculateBadges();

			if (selectedInput) {
				selectedInput.placeholder = this.state.placeholder;
			}
		} else {
			const selected = this.querySelector('.sui-search-select-option.selected') as HTMLLIElement;

			if (selected && selectedInput) {
				selectedInput.placeholder = selected.innerText.trim();
			}
		}
	};

	private updateOptionSelection = (value: string, forceState?: boolean): boolean => {
		const currentSelected = this.state.selectedOptions;
		const isCurrentlySelected = currentSelected.includes(value);
		const max = Number.parseInt(this.dataset.multipleMax as string, 10);

		if (!isCurrentlySelected && !Number.isNaN(max) && currentSelected.length >= max) {
			return false;
		}

		const newSelected = isCurrentlySelected
			? currentSelected.filter((v) => v !== value)
			: [...currentSelected, value];

		this.state.selectedOptions = newSelected;

		const option = this.dropdown?.querySelector(
			`.sui-search-select-option[data-value='${value}']`
		) as HTMLLIElement;

		if (option) {
			option.classList.toggle('selected', forceState ?? !isCurrentlySelected);

			if (this.select) {
				this.select.value = option.getAttribute('value') as string;
			}
		}

		const selectedCountEl = this.querySelector(
			'.sui-search-select-max-span .sui-search-select-select-count'
		) as HTMLSpanElement;

		if (selectedCountEl) {
			selectedCountEl.innerText = String(newSelected.length);
		}

		return true;
	};

	private toggleMultiOption = (id: string) => {
		const success = this.updateOptionSelection(id);

		if (success) {
			this.recalculateBadges();
		}
	};

	public recomputeOptions = (): void => {
		const optionElements = this.dropdown?.querySelectorAll(
			'.sui-search-select-option'
		) as NodeListOf<HTMLLIElement>;

		for (const entry of optionElements) {
			if (Number.parseInt(entry.dataset.optionIndex!, 10) === this.state.focusIndex) {
				entry.classList.add('focused');
			} else {
				entry.classList.remove('focused');
			}
		}
	};

	private reconstructOptions = (filteredOptions: SearchSelectOption[]): void => {
		this.dropdown!.innerHTML = '';

		const selectedValues = this.state.selectedOptions;

		if (filteredOptions.length === 0) {
			this.dropdown!.innerHTML = '<li class="empty-search-results">No results found</li>';
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
			this.dropdown?.appendChild(element);
			i++;
		}
	};

	public getInteractiveOptions = (): HTMLLIElement[] => {
		const allOptions = this.dropdown?.querySelectorAll(
			'.sui-search-select-option'
		) as NodeListOf<HTMLLIElement>;

		return Array.from(allOptions).filter(
			(option) =>
				!option.classList.contains('hidden') &&
				!option.classList.contains('disabled') &&
				!option.hasAttribute('disabled')
		);
	};

	private handleContainerMouseDown = (e: MouseEvent) => {
		const target = e.target as HTMLElement;

		if (!target.closest('input')) {
			e.preventDefault();
		}

		if (this.input?.value.length === 0) {
			this.reconstructOptions(this.state.options);
		}

		if (target.closest('.sui-search-select-indicator')) {
			if (this.dropdown?.parentElement?.classList.contains('active')) {
				this.dropdown?.parentElement?.classList.remove('active', 'above');
				this.input?.blur();
				this.input!.value = '';
			} else {
				this.dropdown?.parentElement?.classList.add('active');
				this.input?.focus();
				this.input!.value = '';
			}
			return;
		}

		if (target.closest('.sui-search-select-badge-container')) {
			this.dropdown?.parentElement?.classList.remove('active', 'above');
			this.input?.blur();
			this.input!.value = '';
		}

		this.state.isSelectingOption = true;

		setTimeout(() => {
			this.state.isSelectingOption = false;
		}, 0);

		if (target.closest('.sui-search-select-badge svg')) {
			const value = target
				.closest('.sui-search-select-badge')
				?.getAttribute('data-value') as string;

			const success = this.updateOptionSelection(value);

			if (success) {
				this.recalculateBadges();
			}

			return;
		}

		const opt = target.closest('.sui-search-select-option') as HTMLLIElement | null;

		if (!opt?.dataset.value) return;

		if (opt.classList.contains('disabled') || opt.hasAttribute('disabled')) {
			this.input?.focus();
			return;
		}

		const isMultiple = this.state.isMultiple;

		if (isMultiple) {
			const success = this.updateOptionSelection(opt.dataset.value);

			if (success) {
				this.updateLabel();
				this.recalculateBadges();
			}
		} else {
			const currentSelected = this.state.selectedOptions;

			for (const value of currentSelected) {
				this.updateOptionSelection(value, false);
			}

			this.updateOptionSelection(opt.dataset.value, true);
			this.updateLabel();

			this.dropdown?.parentElement?.classList.remove('active', 'above');
			this.input?.blur();
			this.input!.value = '';
		}
	};

	public handleSelectKeyDown = (e: KeyboardEvent): void => {
		const focusedElement = document.activeElement;

		if (e.key === 'Escape' || e.key === 'Tab') {
			this.input?.blur();
			this.dropdown?.parentElement?.classList.remove('active', 'above');
			return;
		}

		if ((e.key === 'Enter' || e.key === ' ') && focusedElement?.tagName.toLowerCase() === 'svg') {
			const badgeElement = focusedElement?.closest('.sui-search-select-badge');

			if (badgeElement && this.state.isMultiple) {
				const badgeValue = badgeElement.getAttribute('data-value');
				let nextBadge = badgeElement.previousElementSibling as HTMLElement;

				if (!nextBadge) {
					nextBadge = badgeElement.nextElementSibling as HTMLElement;
				}

				const nextBadgeValue = nextBadge?.getAttribute('data-value');

				this.toggleMultiOption(badgeValue as string);
				this.recalculateBadges();

				setTimeout(() => {
					if (nextBadgeValue) {
						const badgeToFocus = this.querySelector(
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

		const interactiveOptions = this.getInteractiveOptions();
		const currentInteractiveIndex = interactiveOptions.findIndex((option) =>
			option.classList.contains('focused')
		);

		if (e.key === 'ArrowUp' && currentInteractiveIndex > 0) {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex - 1] as Element);

			this.recomputeOptions();

			return;
		}

		if (e.key === 'ArrowDown' && currentInteractiveIndex < interactiveOptions.length - 1) {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[currentInteractiveIndex + 1] as Element);

			this.recomputeOptions();

			return;
		}

		if (e.key === 'PageUp') {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[0] as Element);

			this.recomputeOptions();

			return;
		}

		if (e.key === 'PageDown') {
			this.state.focusIndex = Array.from(
				this.dropdown?.querySelectorAll('.sui-search-select-option') || []
			).indexOf(interactiveOptions[interactiveOptions.length - 1] as Element);

			this.recomputeOptions();

			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopImmediatePropagation();

			const optionElements = this.dropdown?.querySelectorAll(
				'.sui-search-select-option'
			) as NodeListOf<HTMLLIElement>;

			const focusedOption = Array.from(optionElements).find(
				(entry) => Number.parseInt(entry.dataset.optionIndex!, 10) === this.state.focusIndex
			);

			if (
				focusedOption &&
				!focusedOption.classList.contains('disabled') &&
				!focusedOption.hasAttribute('disabled')
			) {
				const value = focusedOption.dataset.value;

				if (!value) return;

				const isMultiple = this.state.isMultiple;

				if (isMultiple) {
					const success = this.updateOptionSelection(value);

					if (success) {
						this.updateLabel();
						this.recalculateBadges();
					}
				} else {
					const currentSelected = this.state.selectedOptions;

					for (const existingValue of currentSelected) {
						this.updateOptionSelection(existingValue, false);
					}

					this.updateOptionSelection(value, true);
					this.updateLabel();

					this.dropdown?.parentElement?.classList.remove('active', 'above');
					this.input!.value = '';
				}
			}

			return;
		}
	};

	private handleInputKeyup = (e: KeyboardEvent): void => {
		if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

		const value = (this.input as HTMLInputElement).value.trim().toLowerCase();
		const allOptions = this.state.options;

		// If input is empty, show all options
		if (value.length === 0) {
			this.reconstructOptions(allOptions);
			return;
		}

		// Otherwise filter options
		const filteredOptions =
			allOptions.filter((option) => option.label.toLowerCase().includes(value)) ?? [];

		this.state.focusIndex = 0;

		this.reconstructOptions(filteredOptions);
	};

	private handleContainerFocusOut = () => {
		if (this.state.isSelectingOption) return;

		this.input!.value = '';
		this.reconstructOptions(this.state.options);
		this.dropdown?.parentElement?.classList.remove('active', 'above');
	};

	private handleContainerFocusIn = () => {
		const allDropdowns = document.querySelectorAll('.sui-search-select-dropdown-list');

		for (const dropdown of allDropdowns) {
			if (dropdown !== this.dropdown) {
				dropdown.parentElement?.classList.remove('active', 'above');
			}
		}

		const { isAbove } = this.getDropdownPosition(this.input as HTMLInputElement);

		this.dropdown?.parentElement?.classList.add('active', ...(isAbove ? [] : ['above']));
	};
}

customElements.define('sui-combobox', SUIComboboxElement);
