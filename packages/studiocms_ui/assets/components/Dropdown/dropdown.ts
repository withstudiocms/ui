class DropdownHelper {
	private container: HTMLDivElement;
	private toggleEl: HTMLDivElement;
	private dropdown: HTMLUListElement;

	private alignment: 'start' | 'center' | 'end';
	private triggerOn: 'left' | 'right' | 'both';
	private fullWidth = false;
	private focusIndex = -1;

	active = false;

	/**
	 * A helper function to interact with dropdowns.
	 * @param id The ID of the dropdown.
	 * @param fullWidth Whether the dropdown should be full width. Not needed normally.
	 */
	constructor(id: string, fullWidth?: boolean) {
		this.container = document.getElementById(`${id}-container`) as HTMLDivElement;

		if (!this.container) {
			throw new Error(`Unable to find dropdown with ID ${id}.`);
		}

		this.alignment = this.container.dataset.align as 'start' | 'center' | 'end';
		this.triggerOn = this.container.dataset.trigger as 'left' | 'right' | 'both';

		this.toggleEl = document.getElementById(`${id}-toggle-btn`) as HTMLDivElement;
		this.dropdown = document.getElementById(`${id}-dropdown`) as HTMLUListElement;

		if (fullWidth) this.fullWidth = true;

		this.hideOnClickOutside(this.container);

		this.initialBehaviorRegistration();
		this.initialOptClickRegistration();
	}

	/**
	 * Registers a click callback for the dropdown options. Whenever one of the options
	 * is clicked, the callback will be called with the value of the option.
	 * @param func The callback function.
	 */
	public registerClickCallback = (func: (value: string) => void) => {
		const dropdownOpts = this.dropdown.querySelectorAll('li');

		for (const opt of dropdownOpts) {
			opt.removeEventListener('click', this.hide);

			opt.addEventListener('click', () => {
				func(opt.dataset.value || '');
				this.hide();
			});
		}
	};

	/**
	 * Sets up all listeners for the dropdown.
	 */
	private initialBehaviorRegistration = () => {
		window.addEventListener('scroll', this.hide);
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') this.hide();
		});
		document.addEventListener('astro:before-preparation', () => {
			this.dropdown.classList.remove('initialized');
		});

		if (this.triggerOn === 'left') {
			this.toggleEl.addEventListener('click', this.toggle);
		} else if (this.triggerOn === 'both') {
			this.toggleEl.addEventListener('click', this.toggle);
			this.toggleEl.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				this.toggle();
			});
		} else {
			this.toggleEl.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				this.toggle();
			});
		}

		this.toggleEl.addEventListener('keydown', (e) => {
			if (!this.active) return;

			if (e.key === 'Enter') {
				e.preventDefault();

				const focused = this.dropdown.querySelector('li.focused') as HTMLLIElement;

				if (!focused) {
					this.hide();
					return;
				}

				focused.click();
			}

			if (e.key === 'ArrowDown') {
				e.preventDefault();

				this.focusIndex =
					this.focusIndex === this.dropdown.children.length - 1 ? 0 : this.focusIndex + 1;
			}

			if (e.key === 'ArrowUp') {
				e.preventDefault();

				this.focusIndex =
					this.focusIndex === 0 ? this.dropdown.children.length - 1 : this.focusIndex - 1;
			}

			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				if (this.focusIndex > this.dropdown.children.length - 1) {
					this.focusIndex = 0;
				}

				this.dropdown.querySelector('li.focused')?.classList.remove('focused');

				const newFocus = this.dropdown.children[this.focusIndex] as HTMLLIElement;

				if (!newFocus) return;

				newFocus.classList.add('focused');
				newFocus.focus();
			}
		});
	};

	/**
	 * Registers callbacks to hide the dropdown when an option is clicked.
	 */
	private initialOptClickRegistration = () => {
		const dropdownOpts = this.dropdown.querySelectorAll('li');

		for (const opt of dropdownOpts) {
			opt.addEventListener('click', this.hide);
		}
	};

	/**
	 * A function to toggle the dropdown.
	 */
	public toggle = () => {
		if (this.active) {
			this.hide();
			return;
		}

		this.show();
	};

	/**
	 * A function to hide the dropdown.
	 */
	public hide = () => {
		this.dropdown.classList.remove('active');
		this.active = false;
		this.focusIndex = -1;

		this.dropdown.querySelector('li.focused')?.classList.remove('focused');

		setTimeout(() => this.dropdown.classList.remove('above', 'below'), 200);
	};

	/**
	 * A function to show the dropdown.
	 */
	public show = () => {
		const isMobile = window.matchMedia('screen and (max-width: 840px)').matches;

		const {
			bottom,
			left,
			right,
			width: parentWidth,
			x,
			y,
			height,
		} = this.toggleEl.getBoundingClientRect();
		const { width: dropdownWidth } = this.dropdown.getBoundingClientRect();

		const optionHeight = 43.28;
		const totalBorderSize = 2;
		const margin = 4;

		const dropdownHeight = this.dropdown.children.length * optionHeight + totalBorderSize + margin;

		const CustomRect = {
			top: bottom + margin,
			left,
			right,
			bottom: bottom + margin + dropdownHeight,
			width: isMobile || this.fullWidth ? parentWidth : dropdownWidth, // Account for scaling of animation
			height: dropdownHeight,
			x,
			y: y + height + margin,
		};

		this.active = true;

		if (isMobile || this.fullWidth) {
			this.dropdown.style.maxWidth = `${parentWidth}px`;
			this.dropdown.style.minWidth = 'unset';
			this.dropdown.style.width = `${parentWidth}px`;
			this.dropdown.style.left = `calc(${parentWidth / 2}px - ${CustomRect.width / 2}px)`;
		} else {
			if (this.alignment === 'end') {
				this.dropdown.style.left = `calc(${parentWidth}px - ${CustomRect.width}px)`;
			}

			if (this.alignment === 'center') {
				this.dropdown.style.left = `calc(${parentWidth / 2}px - ${CustomRect.width / 2}px)`;
			}
		}

		if (!this.dropdown.classList.contains('initialized')) {
			this.dropdown.classList.add('initialized');
		}

		if (
			CustomRect.top >= 0 &&
			CustomRect.left >= 0 &&
			CustomRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			CustomRect.right <= (window.innerWidth || document.documentElement.clientWidth)
		) {
			this.dropdown.classList.add('active', 'below');
			this.focusIndex = -1;
		} else {
			this.dropdown.classList.add('active', 'above');
			this.focusIndex = this.dropdown.children.length;
		}
	};

	/**
	 * A jQuery-like function to hide the dropdown when clicking outside of it.
	 * @param element The element to hide when clicking outside of it.
	 */
	private hideOnClickOutside = (element: HTMLElement) => {
		const outsideClickListener = (event: MouseEvent) => {
			if (!event.target) return;

			if (!element.contains(event.target as Node) && isVisible(element) && this.active === true) {
				// or use: event.target.closest(selector) === null
				this.hide();
			}
		};

		document.addEventListener('click', outsideClickListener);
	};
}

export { DropdownHelper };

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
const isVisible = (elem: HTMLElement) =>
	!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
