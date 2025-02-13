type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type State = {
  activeContainer: HTMLDivElement & {
    button: HTMLButtonElement | null;
    dropdown: HTMLUListElement | null;
    select: HTMLSelectElement | null;
  } | null;
  optionsMap: Record<string, SelectOption[]>;
  isMultipleMap: Record<string, boolean>;
};

function loadSelects() {
  const CONSTANTS = {
    OPTION_HEIGHT: 36,
    BORDER_SIZE: 2,
    MARGIN: 4,
    BADGE_PADDING: 40,
  } as const;

  const isVisible = (elem: HTMLElement): boolean => (
    elem.offsetWidth > 0 || 
    elem.offsetHeight > 0 || 
    elem.getClientRects().length > 0
  );

  const getDropdownPosition = (button: HTMLButtonElement, optionsCount: number) => {
    const rect = button.getBoundingClientRect();
    const dropdownHeight = optionsCount * CONSTANTS.OPTION_HEIGHT + 
      CONSTANTS.BORDER_SIZE + CONSTANTS.MARGIN;

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
      isAbove: customRect.top >= 0 && customRect.left >= 0 &&
        customRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        customRect.right <= (window.innerWidth || document.documentElement.clientWidth),
      customRect,
    };
  };

  const closeDropdown = ({ activeContainer }: State): void => {
    if (!activeContainer?.button || !activeContainer?.dropdown) return;
    activeContainer.dropdown.classList.remove("active", "above");
    activeContainer.button.ariaExpanded = "false";
    state.activeContainer = null;
  };

  const openDropdown = (state: State, container: State["activeContainer"]): void => {
    if (!container?.button || !container?.dropdown) return;
    
    if (state.activeContainer) closeDropdown(state);

    const { isAbove } = getDropdownPosition(
      container.button,
      state.optionsMap[container.dataset.id as string]?.length ?? 0
    );

    container.button.ariaExpanded = "true";
    state.activeContainer = container;
    container.dropdown.classList.add("active", ...(isAbove ? [] : ["above"]));
  };

  const createSelectBadge = (value: string, label: string): HTMLSpanElement => {
    const badge = document.createElement("span");
    badge.classList.add("sui-badge", "primary", "sm", "default", "full", "sui-select-badge");
    badge.setAttribute("data-value", value);
    badge.innerHTML = `${label} <svg style="min-width: 8px" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    return badge;
  };

  const measureBadgesWidth = (
    activeSelects: NodeListOf<Element>
  ): { totalWidth: number; badges: HTMLElement[]; tempContainer: HTMLElement } => {
    // Create temporary container for measurement
    const tempContainer = document.createElement("div");
    tempContainer.classList.add("sui-select-badge-container");
    tempContainer.style.position = "absolute";
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    const badges = Array.from(activeSelects).map(select => 
      createSelectBadge(select.getAttribute("value") ?? "", (select as HTMLLIElement).innerText.trim())
    );

    for (const badge of badges) {
      tempContainer.appendChild(badge);
    }

    // Calculate total width including margins
    const totalWidth = badges.reduce((width, badge) => {
      const badgeStyle = window.getComputedStyle(badge);
      return width + badge.offsetWidth + 
        (Number.parseFloat(badgeStyle.marginLeft) || 0) + 
        (Number.parseFloat(badgeStyle.marginRight) || 0);
    }, 0);
  
    return { totalWidth, badges, tempContainer };
  };
  
  const handleBadgeOverflow = (container: State["activeContainer"]): void => {
    const buttonContainer = container?.button?.parentElement;
    const buttonValueSpan = container?.button?.querySelector(".sui-select-value-span") as HTMLSpanElement;
    const activeSelects = container?.dropdown?.querySelectorAll(".sui-select-option.selected");
    const overflowContainer = container?.querySelector(".sui-select-badge-container-below");
    
    if (!buttonContainer || !overflowContainer || !container?.button || !activeSelects) return;
  
    const parentContainer = buttonContainer.parentElement;
    if (!parentContainer) return;
  
    // Clear existing content
    overflowContainer.innerHTML = "";
    buttonValueSpan!.innerHTML = "";
  
    // Measure badges
    const { totalWidth, badges, tempContainer } = measureBadgesWidth(activeSelects);
  
    // Get the maximum available width from the parent container
    const parentStyles = window.getComputedStyle(parentContainer);
    const availableWidth = parentContainer.clientWidth - 
      (Number.parseFloat(parentStyles.paddingLeft) || 0) - 
      (Number.parseFloat(parentStyles.paddingRight) || 0);
  
    const effectiveAvailableWidth = availableWidth - CONSTANTS.BADGE_PADDING;
  
    // Clean up temporary container
    document.body.removeChild(tempContainer);
  
    const finalBadgeContainer = document.createElement("div");
    finalBadgeContainer.classList.add("sui-select-badge-container");
    for (const badge of badges) {
      finalBadgeContainer.appendChild(badge.cloneNode(true));
    }
  
    // Place badges based on available space
    if (totalWidth > effectiveAvailableWidth) {
      overflowContainer.appendChild(finalBadgeContainer);
    } else {
      buttonValueSpan.appendChild(finalBadgeContainer);
    }
  };

  const updateLabel = (state: State, container: State["activeContainer"]): void => {
    const isMultiple = state.isMultipleMap[container?.dataset.id as string];
    if (isMultiple) {
      handleBadgeOverflow(container);
    } else {
      const selected = container?.querySelector(".sui-select-option.selected") as HTMLLIElement;
      const selectedButtonSpan = container?.button?.querySelector(".sui-select-value-span") as HTMLSpanElement;
      if (selected && selectedButtonSpan) {
        selectedButtonSpan.innerText = selected.innerText.trim();
      }
    }
  };

  const deselectMultiOption = (id: string, container: State["activeContainer"]): void => {
    const selectOpt = container?.dropdown?.querySelector(`.sui-select-option[value="${id}"]`) as HTMLOptionElement;
    if (selectOpt) {
      selectOpt.selected = false;
      selectOpt.classList.remove("selected");
    }
  };

  const handleOptionSelect = (target: HTMLElement, state: State, container: State["activeContainer"]): void => {
    const option = target.closest(".sui-select-option") as HTMLLIElement;
    const lastActive = container?.dropdown?.querySelector(".sui-select-option.selected");
    const isMultiple = state.isMultipleMap[container?.dataset.id as string];
    if (isMultiple) {
      option.classList.toggle("selected");
      const selectOpt = container?.select?.querySelector(`option[value="${option.getAttribute("value")}"]`) as HTMLOptionElement;
      if (selectOpt) {
        selectOpt.selected = !selectOpt.selected;
      }
      updateLabel(state, container);
    } else {
      if (lastActive) {
        lastActive.classList.remove("selected");
        const lastSelectOpt = container?.select?.querySelector(`option[value="${lastActive.getAttribute("value")}"]`) as HTMLOptionElement;
        if (lastSelectOpt) {
          lastSelectOpt.selected = false;
        }
      }
      if (option) {
        option.classList.add("selected");
        const selectOpt = container?.select?.querySelector(`option[value="${option.getAttribute("value")}"]`) as HTMLOptionElement;
        if (selectOpt) {
          selectOpt.selected = true;
        }
        updateLabel(state, container);
      }
    }

    closeDropdown(state);
  };

  const handleContainerClick = (e: MouseEvent, state: State, container: State["activeContainer"]): void => {
    const target = e.target as HTMLElement;
    if (target.closest(".sui-select-badge svg")) {
      deselectMultiOption(target.closest(".sui-select-badge")?.getAttribute("data-value") as string, container);
      handleBadgeOverflow(container);
    }
    if (target.closest(".sui-select-button")) {
      if (state.activeContainer) {
        closeDropdown(state);
      } else {
        openDropdown(state, container);
      }
    }
    if (target.closest(".sui-select-dropdown.active")) {
      handleOptionSelect(target, state, container);
    }
  };

  const state: State = {
    activeContainer: null,
    optionsMap: {},
    isMultipleMap: {},
  };
  const selects = document.querySelectorAll<HTMLDivElement>(".sui-select-label");

  document.addEventListener("click", ({ target }) => {
    if (!state.activeContainer?.dropdown?.classList.contains("active") || !target) return;
    if (!state.activeContainer.contains(target as HTMLElement) && isVisible(state.activeContainer)) {
      closeDropdown(state);
    }
  });
  document.addEventListener("keydown", ({ key }) => {
    if (state.activeContainer && key === "Escape") closeDropdown(state);
  });
  
  for (const container of selects) {
    const id = container.dataset.id as string;
    const specialContainer = Object.assign(container, {
      button: container.querySelector("button"),
      dropdown: container.querySelector(".sui-select-dropdown") as HTMLUListElement,
      select: container.querySelector("select"),
    });

    state.optionsMap[id] = JSON.parse(container.dataset.options as string);
    state.isMultipleMap[id] = container.dataset.multiple === "true";

    specialContainer.addEventListener("click", (e) => handleContainerClick(e, state, specialContainer));

    handleBadgeOverflow(specialContainer);
  }
}

document.addEventListener("astro:page-load", loadSelects);