type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

type State = {
	container: SpecialContainer | undefined;
	options: Record<string, SelectOption[]>;
}

type SpecialContainer = HTMLDivElement & {
	button: HTMLButtonElement | null;
	dropdown: HTMLUListElement | null;
}

function loadSelects() {
	const OPTION_HEIGHT = 36;
	const BORDER_SIZE = 2;
	const MARGIN = 4;

	const toggleDropdown = (state: State, container: SpecialContainer) => {
		if (!container.button || !container.dropdown) return;
    const isActive = container.dropdown.classList.contains('active');
    if (!isActive) {
			openDropdown(state, container);
    } else {
      closeDropdown(state);
    }
	};

	const isSelectAbove = (state: State, container: SpecialContainer) => {
		if (!container.button) return false;
		const { bottom, left, right, width, x, y, height } = container.button.getBoundingClientRect();
		const optionsLength = state.options[container.dataset.id as string]?.length ?? 0;

		const dropdownHeight = optionsLength * OPTION_HEIGHT + BORDER_SIZE + MARGIN;
		const customRect = {
			top: bottom + MARGIN,
			left,
			right,
			bottom: bottom + MARGIN + dropdownHeight,
			width,
			height: dropdownHeight,
			x,
			y: y + height + MARGIN,
		};

		return (
			customRect.top >= 0 &&
			customRect.left >= 0 &&
			customRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			customRect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	const closeDropdown = (state: State) => {
		if (!state || !state.container?.button || !state.container?.dropdown) return;
		state.container.dropdown.classList.remove('active', 'above');
		state.container.button.ariaExpanded = 'false';
		state.container = undefined;
	};

	const openDropdown = (
		state: State,
		container: SpecialContainer,
	) => {
		if (!container.button || !container.dropdown) return;
		if (state.container) {
			closeDropdown(state);
		}

		const isAbove = isSelectAbove(state, container);
		
		container.button.ariaExpanded = 'true';
		state.container = container;
		
		if (isAbove) {
			container.dropdown.classList.add('active');
		} else {
			container.dropdown.classList.add('active', 'above');
		}

	}

	// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
	const isVisible = (elem: HTMLElement) =>
		!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

	const documentClickHandler = (state: State) => {
		return (event: MouseEvent) => {
			if (!state.container || !state.container.dropdown) return;
			if (
				!state.container?.contains(event.target as HTMLElement) &&
				isVisible(state.container!) &&
				state.container.dropdown.classList.contains('active')
			) {
				closeDropdown(state);
			}
		}
	};

	const documentKeydownHandler = (state: State) => {
		return (event: KeyboardEvent) => {
			if (!state.container) return;
			if (event.key === 'Escape') {
				closeDropdown(state);
			}
		}
	};

	const allSelects = document.querySelectorAll<HTMLDivElement>('.sui-select-label') as NodeListOf<HTMLDivElement>;
	const state: State = {
		container: undefined,
		options: {},
	};

	// Catch and handle all document clicks outside of the active select
	// This performs better than adding and removing event listeners to the document
	// every time a select is opened or closed
	document.addEventListener('click', documentClickHandler(state));
	document.addEventListener('keydown', documentKeydownHandler(state));

	for (const container of allSelects) {
		const _container = container as SpecialContainer;
		_container.button = container.querySelector('button');
		_container.dropdown = container.querySelector('.sui-select-dropdown');

		const options = JSON.parse(_container.dataset.options as string) as SelectOption[];
		const id = _container.dataset.id as string;
		state.options[id] = options;

		_container.button!.addEventListener('click', () => {
			toggleDropdown(state, _container);
		});
	}
}

loadSelects();