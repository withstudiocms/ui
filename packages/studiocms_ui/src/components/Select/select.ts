type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type State = {
  container: SpecialContainer | undefined;
  options: Record<string, SelectOption[]>;
  isMultiple: Record<string, boolean>;
};

type SpecialContainer = HTMLDivElement & {
  button: HTMLButtonElement | null;
  dropdown: HTMLUListElement | null;
  select: HTMLSelectElement | null;
};

function loadSelects() {
  const CONSTANTS = {
    OPTION_HEIGHT: 36,
    BORDER_SIZE: 2,
    MARGIN: 4,
  } as const;

  const isVisible = (elem: HTMLElement) =>
    !!elem &&
    !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

  const updateLabel = (
    button: HTMLButtonElement,
    label: string,
    isMultiple = false,
  ) => {
    const buttonSpan = button.querySelector<HTMLSpanElement>(
      ".sui-select-value-span",
    );
    if (!buttonSpan) return;

    button.setAttribute("aria-label", label);

    if (isMultiple) {
      let badgeContainer = buttonSpan.querySelector<HTMLDivElement>(
        ".sui-select-badge-container",
      ) as HTMLDivElement | null;
			badgeContainer!.innerHTML = "";

      if (badgeContainer && label) {
        const labels = label.split(", ").filter((l) => l);
				for (const badgeLabel of labels) {
					const badge = document.createElement("span");
					badge.classList.add("sui-badge", "sui-select-badge", "primary", "sm", "default", "full");
					badge.textContent = badgeLabel;
					badgeContainer?.appendChild(badge);
				}
				if (isElementOverflowingHorizontally(button, button.querySelector<HTMLElement>(".sui-select-chevron")!)) {
					badgeContainer?.classList.add("below");
				}
      }
    } else {
      buttonSpan.textContent = label;
    }
  };

  const calculateDropdownPosition = (
    button: HTMLButtonElement,
    optionsLength: number,
  ) => {
    const { bottom, left, right, width, x, y, height } =
      button.getBoundingClientRect();
    const dropdownHeight =
      optionsLength * CONSTANTS.OPTION_HEIGHT +
      CONSTANTS.BORDER_SIZE +
      CONSTANTS.MARGIN;

    const customRect = {
      top: bottom + CONSTANTS.MARGIN,
      bottom: bottom + CONSTANTS.MARGIN + dropdownHeight,
      left,
      right,
      width,
      x,
      y: y + height + CONSTANTS.MARGIN,
      height: dropdownHeight,
    };

    return {
      isAbove:
        customRect.top >= 0 &&
        customRect.left >= 0 &&
        customRect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        customRect.right <=
          (window.innerWidth || document.documentElement.clientWidth),
      customRect,
    };
  };

  const closeDropdown = (state: State) => {
    if (!state.container?.button || !state.container?.dropdown) return;
    state.container.dropdown.classList.remove("active", "above");
    state.container.button.ariaExpanded = "false";
    state.container = undefined;
  };

  const openDropdown = (state: State, container: SpecialContainer) => {
    if (!container.button || !container.dropdown) return;
    if (state.container) closeDropdown(state);

    const { isAbove } = calculateDropdownPosition(
      container.button,
      state.options[container.dataset.id as string]?.length ?? 0,
    );

    container.button.ariaExpanded = "true";
    state.container = container;
    container.dropdown.classList.add("active", ...(isAbove ? [] : ["above"]));
  };

  const toggleDropdown = (state: State, container: SpecialContainer) => {
    if (!container.button || !container.dropdown) return;
    container.dropdown.classList.contains("active")
      ? closeDropdown(state)
      : openDropdown(state, container);
  };

  const handleOptionSelection = (state: State, targetElement: HTMLElement) => {
    if (!state.container?.dropdown?.contains(targetElement)) return;

    const option = targetElement.closest("li") as HTMLLIElement;
    if (!option || !state.container.button) return;

    const isMultiple = state.isMultiple[state.container.dataset.id ?? ""];
    const optionElements = state.container.dropdown.querySelectorAll("li");

    if (isMultiple) {
      option.classList.toggle("selected");
      const selectedTexts = Array.from(optionElements)
        .filter((opt) => opt.classList.contains("selected"))
        .map((opt) => opt.textContent ?? "")
        .join(", ");
			updateLabel(state.container.button, selectedTexts, isMultiple);
			closeDropdown(state);
    } else {
      if (!option.classList.contains("selected")) {
        for (const opt of optionElements) {
          opt.classList.remove("selected");
        }
        option.classList.add("selected");
        updateLabel(state.container.button, option.textContent ?? "");
				closeDropdown(state);
      }
    }
  };

	const isElementOverflowingHorizontally = (containerElement: HTMLElement, targetElement: HTMLElement): boolean => {
		const containerRect = containerElement.getBoundingClientRect();
		const iconRect = targetElement.getBoundingClientRect();
		return iconRect.left < containerRect.left || iconRect.right > containerRect.right;
	};	

  const state: State = {
    container: undefined,
    options: {},
    isMultiple: {},
  };

  document.addEventListener("click", (e) => {
    if (!state.container?.dropdown?.classList.contains("active")) return;
    if (
      !state.container.contains(e.target as HTMLElement) &&
      isVisible(state.container)
    ) {
      closeDropdown(state);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (state.container && e.key === "Escape") closeDropdown(state);
  });

  // Setup selects
  const selects =
    document.querySelectorAll<HTMLDivElement>(".sui-select-label");

  for (const container of selects) {
    const _container = container as SpecialContainer;
    _container.button = container.querySelector("button");
    _container.dropdown = container.querySelector(".sui-select-dropdown");
    _container.select = container.querySelector("select");

    const id = _container.dataset.id as string;
    state.options[id] = JSON.parse(_container.dataset.options as string);
    state.isMultiple[id] = _container.dataset.multiple === "true";

    _container.button?.addEventListener("click", () =>
      toggleDropdown(state, _container),
    );
    _container.dropdown?.addEventListener("click", (e) =>
      handleOptionSelection(state, e.target as HTMLElement),
    );

		if (_container.dataset.multiple === "true") {
			const iconElement = _container.querySelector<HTMLElement>(".sui-select-chevron");
			const badgeContainer = _container.querySelector(".sui-select-badge-container")!;
			if (iconElement && isElementOverflowingHorizontally(_container, iconElement)) {
				badgeContainer.classList.add("below");
			} else {
				badgeContainer.classList.remove("below");
			}
		}
  }
}
document.addEventListener("astro:page-load", loadSelects);
