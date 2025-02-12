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

  const handleBadgeOverflow = (container: State["activeContainer"]): void => {
    const buttonContainer = container?.button?.parentElement;
    const overflowContainer = container?.querySelector(".sui-select-badge-container-below");
    const badges = [...container?.querySelectorAll(".sui-select-badge") ?? []];
    
    if (!buttonContainer || !overflowContainer || !container?.button) return;

    const availableWidth = buttonContainer.clientWidth;
    
    for (const badge of badges) {
      container.button.appendChild(badge);
    }

    const totalWidth = [...buttonContainer.children].reduce((width, badge) => {
      const { marginLeft, marginRight } = window.getComputedStyle(badge as HTMLElement);
      return width + (badge as HTMLElement).offsetWidth + 
        (Number.parseInt(marginLeft) || 0) + (Number.parseInt(marginRight) || 0);
    }, 0);

    if (totalWidth > availableWidth) {
      for (const badge of badges) {
        overflowContainer.appendChild(badge);
      }
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