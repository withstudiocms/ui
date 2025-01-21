const tabContainers = document.querySelectorAll<HTMLDivElement>('.sui-tabs-container');

for (const tabContainer of tabContainers) {
  const storage = tabContainer.dataset.storageStrategy!;
  const syncKey = tabContainer.dataset.syncKey!;

  const storageLayer = storage === 'session' ? sessionStorage : localStorage;

  const constructCustomEvent = (tabIndex: number, uniqueId: string) => {
    return new CustomEvent(`sui-tab-switch:${syncKey}`, {
      detail: {
        tabIndex,
        uniqueId
      }
    });
  }

  const switchTab = (target: HTMLElement, container: HTMLElement, originatedFromSync = false) => {
    const activeChildren = container.querySelectorAll<HTMLElement>('.active');
    
    for (const child of activeChildren) {
      child.tabIndex = -1;
      child.classList.remove('active');
    }

    const newActiveTab = target as HTMLElement;
    newActiveTab.classList.add('active');
    newActiveTab.tabIndex = 0;

    const newActiveTabContentId = newActiveTab.dataset.tabChild;
    const newActiveTabContent = container.querySelector<HTMLElement>(`sui-tab-item[data-tab-id="${newActiveTabContentId}"]`)!;

    newActiveTabContent.classList.add('active');

    if (syncKey && !originatedFromSync) {
      const tabIndex = Array.prototype.indexOf.call(newActiveTab.parentElement!.children, newActiveTab);
      storageLayer.setItem(syncKey, tabIndex.toString());

      document.dispatchEvent(constructCustomEvent(tabIndex, container.dataset.uniqueId!));
    }

  }
    
  const tabHeaders = tabContainer.querySelectorAll<HTMLElement>('.sui-tab-header');

  for (const tab of tabHeaders) {
    tab.addEventListener('click', (e) => switchTab(e.target as HTMLElement, tabContainer));

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTabIndex = Array.prototype.indexOf.call(tab.parentElement!.children, tab);
        const nextTabIndex = e.key === 'ArrowLeft' ? activeTabIndex - 1 : activeTabIndex + 1;
        

        if (nextTabIndex >= 0 && nextTabIndex < tab.parentElement!.children.length) {
          tab.tabIndex = -1;

          const nextTab = tab.parentElement!.children[nextTabIndex]! as HTMLElement;

          nextTab.tabIndex = 0;
          nextTab.click();
          nextTab.focus();
        } else if (nextTabIndex < 0) {
          tab.tabIndex = -1;

          const lastTab = tab.parentElement!.children[tab.parentElement!.children.length - 1] as HTMLElement;

          lastTab.tabIndex = 0;
          lastTab.click();
          lastTab.focus();
        } else {
          tab.tabIndex = -1;

          const firstTab = tab.parentElement!.children[0] as HTMLElement;

          firstTab.tabIndex = 0;
          firstTab.click();
          firstTab.focus();
        }
      }
    });
  }

  if (syncKey) {
    // Retrieve the sync key value from localstorage, set the tab.
    const activeTabIndex = storageLayer.getItem(syncKey);

    if (activeTabIndex) {
      const activeTab = tabContainer.querySelector<HTMLElement>(`#${syncKey}-${activeTabIndex}`);
      
      if (activeTab) {
        activeTab.click();
      }
    }

    document.addEventListener(`sui-tab-switch:${syncKey}`, (e) => {
      const event = e as CustomEvent<{ tabIndex: number, uniqueId: string }>;
      const { tabIndex, uniqueId } = event.detail;

      if (uniqueId === tabContainer.dataset.uniqueId) return;

      const newTab = tabContainer.querySelector<HTMLElement>(`#${syncKey}-${tabIndex}`)!;

      switchTab(newTab, tabContainer, true);
    });
  }
}
