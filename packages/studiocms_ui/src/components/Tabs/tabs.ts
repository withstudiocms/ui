/**
 * Handles the logic of switching tabs, updating ARIA attributes, and syncing state.
 * @param tabContainer The main container of the tab system.
 * @param newActiveHeader The header element of the tab to be activated.
 * @param originatedFromSync A flag to prevent cyclic updates with synced tabs.
 */
const switchTab = (
	tabContainer: HTMLDivElement,
	newActiveHeader: HTMLElement,
	originatedFromSync = false
) => {
	const tabHeaders = Array.from(
		tabContainer.querySelectorAll<HTMLElement>(':scope > .sui-tabs-list > .sui-tab-header')
	);
	const tabPanels = Array.from(
		tabContainer.querySelectorAll<HTMLElement>(':scope > .sui-tabs-content > sui-tab-item')
	);

	if (!newActiveHeader || !tabHeaders.includes(newActiveHeader)) return;

	for (const header of tabHeaders) {
		header.classList.remove('active');
		header.tabIndex = -1;
		header.setAttribute('aria-selected', 'false');
	}

	for (const panel of tabPanels) {
		panel.classList.remove('active');
	}

	newActiveHeader.classList.add('active');
	newActiveHeader.tabIndex = 0;
	newActiveHeader.setAttribute('aria-selected', 'true');

	const activePanel = tabPanels.find((p) => p.id === newActiveHeader.getAttribute('aria-controls'));
	if (activePanel) {
		activePanel.classList.add('active');
	}

	const syncKey = tabContainer.dataset.syncKey;
	if (syncKey && !originatedFromSync) {
		const storage = tabContainer.dataset.storageStrategy ?? 'session';
		const storageLayer = storage === 'session' ? sessionStorage : localStorage;
		const tabIndex = tabHeaders.indexOf(newActiveHeader);
		storageLayer.setItem(syncKey, tabIndex.toString());

		document.dispatchEvent(
			new CustomEvent(`sui-tab-switch:${syncKey}`, {
				detail: {
					tabIndex,
					uniqueId: tabContainer.dataset.uniqueId,
				},
			})
		);
	}
};

/**
 * Sets up a single tab container, wiring up ARIA attributes and event listeners.
 * @param tabContainer The main container element of a tab system to set up.
 */
const setupTabContainer = (tabContainer: HTMLDivElement) => {
	const tabHeaders = Array.from(
		tabContainer.querySelectorAll<HTMLElement>(':scope > .sui-tabs-list > .sui-tab-header')
	);
	const tabPanels = Array.from(
		tabContainer.querySelectorAll<HTMLElement>(':scope > .sui-tabs-content > sui-tab-item')
	);
	const tabList = tabContainer.querySelector<HTMLElement>(':scope > .sui-tabs-list');

	if (!tabHeaders.length || !tabPanels.length || !tabList) return;

	tabHeaders.forEach((header, index) => {
		const panel = tabPanels[index];
		if (!panel) return;

		const panelId = panel.dataset.tabId ?? `sui-panel-${crypto.randomUUID()}`;
		const headerId = header.id || `sui-header-${crypto.randomUUID()}`;

		header.id = headerId;
		panel.id = panelId;
		panel.setAttribute('role', 'tabpanel');
		panel.setAttribute('aria-labelledby', headerId);
		header.setAttribute('aria-controls', panelId);
	});

	tabList.addEventListener('click', (e) => {
		const header = (e.target as HTMLElement).closest<HTMLElement>('.sui-tab-header');
		if (header && tabHeaders.includes(header)) {
			switchTab(tabContainer, header);
		}
	});

	tabList.addEventListener('keydown', (e) => {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		const currentHeader = (e.target as HTMLElement).closest<HTMLElement>('.sui-tab-header');
		if (!currentHeader || !tabHeaders.includes(currentHeader)) return;

		e.preventDefault();
		const currentIndex = tabHeaders.indexOf(currentHeader);
		const newIndex =
			e.key === 'ArrowLeft'
				? (currentIndex - 1 + tabHeaders.length) % tabHeaders.length
				: (currentIndex + 1) % tabHeaders.length;

		const nextTab = tabHeaders[newIndex]!;
		nextTab.focus();
		switchTab(tabContainer, nextTab);
	});

	const syncKey = tabContainer.dataset.syncKey;
	const initiallyActiveTab =
		tabHeaders.find((h) => h.classList.contains('active')) ?? tabHeaders[0]!;

	if (syncKey) {
		const storage = tabContainer.dataset.storageStrategy ?? 'session';
		const storageLayer = storage === 'session' ? sessionStorage : localStorage;
		const activeTabIndex = storageLayer.getItem(syncKey);

		if (activeTabIndex) {
			const activeTab = tabHeaders[Number.parseInt(activeTabIndex, 10)];
			if (activeTab) {
				switchTab(tabContainer, activeTab);
			}
		} else {
			switchTab(tabContainer, initiallyActiveTab);
		}

		document.addEventListener(`sui-tab-switch:${syncKey}`, (e) => {
			const { tabIndex, uniqueId } = (e as CustomEvent).detail;
			if (uniqueId === tabContainer.dataset.uniqueId) return;

			const newTab = tabHeaders[tabIndex];
			if (newTab) {
				switchTab(tabContainer, newTab, true);
			}
		});
	} else {
		switchTab(tabContainer, initiallyActiveTab);
	}
};

/**
 * Initializes all tab systems on the page.
 * Finds all tab containers and applies the setup logic to each.
 */
const loadTabs = () => {
	for (const tabContainer of document.querySelectorAll<HTMLDivElement>('.sui-tabs-container')) {
		setupTabContainer(tabContainer);
	}
};

document.addEventListener('astro:page-load', loadTabs);
