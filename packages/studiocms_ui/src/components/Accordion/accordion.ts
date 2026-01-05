/**
 * Finds the owning accordion element for a given accordion item. Used for nested accordions.
 * @param accordionItem The accordion item element to find the owning accordion for.
 * @returns The owning accordion element or null if not found.
 */
const findOwningAccordion = (accordionItem: HTMLDivElement): HTMLDivElement | null => {
	let current = accordionItem.parentElement;
	while (current) {
		if (current.classList.contains('sui-accordion')) {
			return current as HTMLDivElement;
		}
		current = current.parentElement;
	}
	return null;
};

/**
 * Gets the direct accordion items for a given accordion. Supports nested accordions.
 * @param accordion The accordion element to get direct items from.
 * @returns An array of direct accordion item elements that are direct children of the given accordion.
 */
const getDirectAccordionItems = (accordion: HTMLDivElement): HTMLDivElement[] => {
	const allItems = accordion.querySelectorAll<HTMLDivElement>('.sui-accordion-item');
	const directItems: HTMLDivElement[] = [];

	for (let i = 0; i < allItems.length; i++) {
		if (findOwningAccordion(allItems[i]) === accordion) {
			directItems.push(allItems[i]);
		}
	}

	return directItems;
};

/**
 * Updates the ARIA attributes for a given accordion item.
 * @param item The accordion item element to update ARIA attributes for.
 * @param isOpen Whether the accordion item is currently open or closed.
 */
const updateAccordionARIA = (item: HTMLDivElement, isOpen: boolean) => {
	const summary = item.querySelector<HTMLButtonElement>('.sui-accordion-summary');
	const details = item.querySelector<HTMLDivElement>('.sui-accordion-details');

	if (summary) summary.setAttribute('aria-expanded', isOpen.toString());
	if (details) details.setAttribute('aria-hidden', (!isOpen).toString());
};

/**
 * Toggles the open state of a given accordion item.
 * @param accordionItem The accordion item element to toggle.
 * @param accordion The accordion element that contains the item.
 * @returns void
 */
const toggleAccordionItem = (accordionItem: HTMLDivElement, accordion: HTMLDivElement) => {
	const isAlreadyOpen = accordionItem.dataset.open === 'true';
	const newState = !isAlreadyOpen;

	if (accordion.dataset.multiple === 'true') {
		accordionItem.dataset.open = newState.toString();
	} else {
		const directItems = getDirectAccordionItems(accordion);

		for (let i = 0; i < directItems.length; i++) {
			const item = directItems[i];
			const shouldBeOpen = item === accordionItem;
			item.dataset.open = shouldBeOpen.toString();
			updateAccordionARIA(item, shouldBeOpen);
		}
		return;
	}

	updateAccordionARIA(accordionItem, newState);
};

/**
 * Focuses the next or previous accordion item within a given accordion.
 * @param accordion The accordion element to focus an item within.
 * @param direction The direction to focus the item in (next or previous).
 * @param currentItem The currently focused accordion item.
 * @returns void
 */
const focusAccordionItem = (
	accordion: HTMLDivElement,
	direction: 'next' | 'prev',
	currentItem: HTMLDivElement
) => {
	const items = getDirectAccordionItems(accordion);
	const currentIndex = items.indexOf(currentItem);

	if (currentIndex === -1) return;

	const targetIndex =
		direction === 'next'
			? (currentIndex + 1) % items.length
			: (currentIndex - 1 + items.length) % items.length;

	const targetSummary =
		items[targetIndex]?.querySelector<HTMLButtonElement>('.sui-accordion-summary');
	targetSummary?.focus();
};

/**
 * Initializes the ARIA states for all accordion items on page load.
 */
const initializeAccordionStates = () => {
	const allAccordionItems = document.querySelectorAll<HTMLDivElement>('.sui-accordion-item');

	for (let i = 0; i < allAccordionItems.length; i++) {
		const item = allAccordionItems[i];
		const isOpen = item.dataset.open === 'true';
		updateAccordionARIA(item, isOpen);
	}
};

let listenersAdded = false;

/**
 * Toggles the open state of a given accordion item.
 * @param event The event that triggered the interaction (click or keydown).
 * @param isKeyboard Whether the interaction was triggered by a keyboard event.
 * @returns void
 */
const handleAccordionInteraction = (event: Event, isKeyboard = false) => {
	const target = event.target as HTMLElement;
	const accordionSummary = target.closest<HTMLButtonElement>('.sui-accordion-summary');

	if (!accordionSummary) return;

	const accordionItem = accordionSummary.closest<HTMLDivElement>('.sui-accordion-item');
	const accordion = accordionItem && findOwningAccordion(accordionItem);

	if (!accordionItem || !accordion) return;

	if (isKeyboard) {
		const keyEvent = event as KeyboardEvent;
		switch (keyEvent.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				toggleAccordionItem(accordionItem, accordion);
				break;
			case 'ArrowDown':
				event.preventDefault();
				focusAccordionItem(accordion, 'next', accordionItem);
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusAccordionItem(accordion, 'prev', accordionItem);
				break;
		}
	} else {
		event.preventDefault();
		toggleAccordionItem(accordionItem, accordion);
	}
};

const loadAccordions = () => {
	initializeAccordionStates();

	if (!listenersAdded) {
		document.addEventListener('click', handleAccordionInteraction);
		document.addEventListener('keydown', (e) => handleAccordionInteraction(e, true));
		listenersAdded = true;
	}
};

document.addEventListener('astro:page-load', loadAccordions);
