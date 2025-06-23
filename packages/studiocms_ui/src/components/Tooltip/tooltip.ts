type Position = 'auto' | 'top' | 'bottom' | 'left' | 'right';

type Point = {
	x: number;
	y: number;
};

interface TooltipOptions {
	position: Position;
	defaultOpen?: boolean;
	gap?: number;
	enterDelay?: number;
	exitDelay?: number;
	hoverOnly?: boolean;
	animate?: boolean;
	pointer?: boolean;
}

class Tooltip {
	container: HTMLElement;
	anchor: HTMLElement;
	tooltip: HTMLElement;
	options: TooltipOptions;
	resizeObserver: ResizeObserver | null = null;
	throttleUpdate: () => void;
	rafId: number | null = null;
	offset: number;
	isSticky = false;
	edgePadding = 8;

	constructor(container: HTMLElement | null) {
		if (!container) {
			throw new Error('Tooltip: Container element is required.');
		}
		this.container = container;
		this.anchor = container.querySelector<HTMLElement>('[data-sui-tooltip-anchor]')!;
		this.tooltip = container.querySelector<HTMLElement>('[data-sui-tooltip-popup]')!;

		this.options = this.processOptionsFromAttributes();
		this.offset = this.options.gap ?? 8;
		this.throttleUpdate = this.throttle(() => this.update(), 16);
		this.#init();
	}

	processOptionsFromAttributes(): TooltipOptions {
		const jsonOptions = this.container.getAttribute('data-sui-tooltip-options');
		let options: TooltipOptions = {
			position: 'auto',
			enterDelay: 0,
			exitDelay: 0,
			hoverOnly: false,
			animate: true,
			pointer: true,
		};

		try {
			const parsedOptions = jsonOptions ? (JSON.parse(jsonOptions) as Record<string, string>) : {};
			options = { ...options, ...parsedOptions };
		} catch {}

		return options;
	}

	#init() {
		this.update();
		this.bindEvents();
		this.container.dataset.initialized = 'true';
	}

	update() {
		if (this.rafId) cancelAnimationFrame(this.rafId);
		this.rafId = requestAnimationFrame(() => this.updatePosition());
	}

	bindEvents() {
		window.addEventListener('resize', this.throttleUpdate);
		if (window.ResizeObserver) {
			this.resizeObserver = new ResizeObserver(() => this.update());
			this.resizeObserver.observe(this.tooltip);
			this.resizeObserver.observe(this.anchor);
		}
	}

	updatePosition() {
		const anchorRect = this.anchor.getBoundingClientRect();
		const tooltipWidth = this.tooltip.offsetWidth;
		const tooltipHeight = this.tooltip.offsetHeight;
		const position = this.determinePosition(anchorRect, tooltipWidth, tooltipHeight);
		for (const p of ['top', 'bottom', 'left', 'right', 'overlap']) {
			this.tooltip.classList.toggle(p, p === position);
		}

		let x: number | null = null;
		let y: number | null = null;
		const anchorCenter = {
			x: anchorRect.left + window.scrollX + anchorRect.width / 2,
			y: anchorRect.top + window.scrollY + anchorRect.height / 2,
		};

		switch (position) {
			case 'top': {
				x = anchorCenter.x - tooltipWidth / 2;
				y = anchorRect.top + window.scrollY - tooltipHeight - this.offset;
				break;
			}
			case 'bottom': {
				x = anchorCenter.x - tooltipWidth / 2;
				y = anchorRect.bottom + window.scrollY + this.offset;
				break;
			}
			case 'left': {
				x = anchorRect.left + window.scrollX - tooltipWidth - 12;
				y = anchorCenter.y - tooltipHeight / 2;
				break;
			}
			case 'right': {
				x = anchorRect.right + window.scrollX + 12;
				y = anchorCenter.y - tooltipHeight / 2;
				break;
			}
			default: {
				x = anchorCenter.x - tooltipWidth / 2;
				y = anchorRect.top + window.scrollY - tooltipHeight - this.offset;
				break;
			}
		}

		let finalPosition: Point;
		const anchorIsVisible = this.isAnchorInViewport(anchorRect);

		if (anchorIsVisible) {
			finalPosition = this.applyViewportConstraints(x, y, tooltipWidth, tooltipHeight);
		} else {
			finalPosition = { x, y };
		}

		this.tooltip.style.left = `${finalPosition.x}px`;
		this.tooltip.style.top = `${finalPosition.y}px`;

		if (this.options.pointer) {
			this.updatePointer(position, anchorCenter, finalPosition, tooltipWidth, tooltipHeight);
		}
	}

	updatePointer(
		position: Position | 'overlap',
		anchorCenter: Point,
		tooltipPosition: Point,
		tooltipWidth: number,
		tooltipHeight: number
	) {
		const arrow = this.tooltip.querySelector<HTMLElement>('.sui-tooltip-pointer');
		if (!arrow) return;
		arrow.style.left = '';
		arrow.style.top = '';
		const arrowSize = 8;

		if (position === 'top' || position === 'bottom') {
			const arrowLeft = anchorCenter.x - tooltipPosition.x - arrowSize;
			const min = arrowSize;
			const max = tooltipWidth - arrowSize * 2;
			arrow.style.left = `${Math.max(min, Math.min(arrowLeft, max))}px`;
		} else if (position === 'left' || position === 'right') {
			const arrowTop = anchorCenter.y - tooltipPosition.y - arrowSize;
			const min = arrowSize;
			const max = tooltipHeight - arrowSize * 2;
			arrow.style.top = `${Math.max(min, Math.min(arrowTop, max))}px`;
		}
	}

	determinePosition(
		anchorRect: DOMRect,
		tooltipWidth: number,
		tooltipHeight: number
	): Position | 'overlap' {
		const position = this.options.position;
		const anchor = anchorRect;
		const space = {
			top: anchor.top - this.offset - this.edgePadding,
			bottom: window.innerHeight - anchor.bottom - this.offset - this.edgePadding,
			left: anchor.left - this.offset - this.edgePadding,
			right: window.innerWidth - anchor.right - this.offset - this.edgePadding,
		};
		const canFit = {
			top: space.top >= tooltipHeight,
			bottom: space.bottom >= tooltipHeight,
			left: space.left >= tooltipWidth,
			right: space.right >= tooltipWidth,
		};
		const positionHierarchy: {
			[K in Position]: Exclude<Position, 'auto'>[];
		} = {
			top: ['top', 'bottom', 'right', 'left'],
			bottom: ['bottom', 'top', 'right', 'left'],
			left: ['left', 'right', 'top', 'bottom'],
			right: ['right', 'left', 'top', 'bottom'],
			auto: ['top', 'bottom', 'right', 'left'],
		};
		const priority = positionHierarchy[position] || positionHierarchy.auto;
		for (const pos of priority) {
			if (canFit[pos]) {
				return pos;
			}
		}
		return 'overlap';
	}

	isAnchorInViewport(anchorRect: DOMRect): boolean {
		return (
			anchorRect.top < window.innerHeight &&
			anchorRect.bottom > 0 &&
			anchorRect.left < window.innerWidth &&
			anchorRect.right > 0
		);
	}

	applyViewportConstraints(x: number, y: number, width: number, height: number): Point {
		const minX = this.edgePadding + window.scrollX;
		const maxX = window.innerWidth - width - this.edgePadding + window.scrollX;
		const finalX = Math.max(minX, Math.min(x, maxX));

		const minY = this.edgePadding + window.scrollY;
		const maxY = window.innerHeight - height - this.edgePadding + window.scrollY;
		const finalY = Math.max(minY, Math.min(y, maxY));

		return {
			x: finalX,
			y: finalY,
		};
	}

	throttle(fn: (...args: unknown[]) => void, delay: number): () => void {
		let timeoutId = 0;
		let lastExecTime = 0;
		return (...args: unknown[]) => {
			const currentTime = Date.now();
			const timeSinceLastExec = currentTime - lastExecTime;
			clearTimeout(timeoutId);
			if (timeSinceLastExec >= delay) {
				fn.apply(this, args);
				lastExecTime = currentTime;
			} else {
				timeoutId = window.setTimeout(() => {
					fn.apply(this, args);
					lastExecTime = Date.now();
				}, delay - timeSinceLastExec);
			}
		};
	}

	show() {
		this.tooltip.setAttribute('data-visible', 'true');
		this.anchor.setAttribute('aria-describedby', this.tooltip.id);
		this.update();
	}

	hide() {
		this.tooltip.removeAttribute('data-visible');
		this.anchor.removeAttribute('aria-describedby');
	}

	getAnchor() {
		return this.anchor;
	}

	isHoverOnly() {
		return this.options.hoverOnly ?? false;
	}

	setSticky(sticky: boolean) {
		this.isSticky = sticky;
	}

	isDefaultOpen() {
		return this.options.defaultOpen ?? false;
	}

	destroy() {
		window.removeEventListener('resize', this.throttleUpdate);
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
		this.anchor.removeAttribute('aria-describedby');
	}
}

function loadTooltips() {
	const allTooltipElements = document.querySelectorAll<HTMLDivElement>(
		'.sui-tooltip-container[data-sui-tooltip]'
	);
	let activeTooltip: Tooltip | null = null;
	let enterTimeout: number;
	let exitTimeout: number;

	const show = (tooltipInstance: Tooltip, immediate = false) => {
		clearTimeout(exitTimeout);
		const delay = immediate ? 0 : tooltipInstance.options.enterDelay;
		enterTimeout = window.setTimeout(() => {
			if (activeTooltip && activeTooltip !== tooltipInstance) {
				activeTooltip.hide();
				activeTooltip.setSticky(false);
			}
			tooltipInstance.show();
			activeTooltip = tooltipInstance;
		}, delay);
	};

	const hide = (tooltipInstance: Tooltip) => {
		clearTimeout(enterTimeout);
		exitTimeout = window.setTimeout(() => {
			tooltipInstance.hide();
			tooltipInstance.setSticky(false);
			if (activeTooltip === tooltipInstance) {
				activeTooltip = null;
			}
		}, tooltipInstance.options.exitDelay);
	};

	for (const element of allTooltipElements) {
		if (element.dataset.initialized) continue;
		const tooltipInstance: Tooltip = new Tooltip(element);
		const anchor = tooltipInstance.getAnchor();
		const popup = tooltipInstance.tooltip;

		// @ts-expect-error
		window.sui.tooltips.instances.set(tooltipInstance.container.id, tooltipInstance);

		anchor.addEventListener('mouseenter', () => {
			if (!tooltipInstance.isSticky) {
				show(tooltipInstance);
			}
		});

		anchor.addEventListener('focus', () => {
			if (!tooltipInstance.isSticky) {
				show(tooltipInstance);
			}
		});

		anchor.addEventListener('mouseleave', () => {
			if (!tooltipInstance.isSticky) {
				hide(tooltipInstance);
			}
		});

		anchor.addEventListener('blur', () => {
			if (!tooltipInstance.isSticky) {
				hide(tooltipInstance);
			}
		});

		anchor.addEventListener('click', (e) => {
			e.stopPropagation();
			if (tooltipInstance.isSticky) {
				hide(tooltipInstance);
			} else {
				show(tooltipInstance);
				tooltipInstance.setSticky(true);
			}
		});

		popup.addEventListener('mouseenter', () => clearTimeout(exitTimeout));
		popup.addEventListener('mouseleave', () => {
			if (!tooltipInstance.isSticky) {
				hide(tooltipInstance);
			}
		});

		if (tooltipInstance.isDefaultOpen()) {
			show(tooltipInstance, true);
			tooltipInstance.setSticky(true);
		}
	}

	document.addEventListener('click', (e) => {
		if (
			activeTooltip?.isSticky &&
			!activeTooltip.getAnchor().contains(e.target as Node) &&
			!activeTooltip.tooltip.contains(e.target as Node)
		) {
			hide(activeTooltip);
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && activeTooltip) {
			hide(activeTooltip);
		}
	});
}

// TODO: Investigate why global type definitions are not being recognized
// @ts-expect-error
window.sui = window.sui ?? {};

// @ts-expect-error
window.sui.tooltips = {
	instances: new Map<string, Tooltip>(),

	get: function (id: string) {
		return this.instances.get(id);
	},

	show: function (id: string) {
		const instance = this.get(id);
		if (instance) {
			instance.show();
			instance.setSticky(true);
		}
	},

	hide: function (id: string) {
		this.get(id)?.hide();
	},
};

document.addEventListener('astro:page-load', loadTooltips);
