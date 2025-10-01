import type { ToastProps } from '../../types/index.js';
import { generateID } from '../../utils/generateID.js';
import { getIconString, type ValidIconString } from '../../utils/iconStrings.js';

let activeToasts: string[] = [];

let lastActiveElement: HTMLElement | null = null;

const revertFocusBackToLastActiveElement = () => {
	if (lastActiveElement) {
		lastActiveElement.focus();
		lastActiveElement = null;
	}
};

/**
 * Callback wrapper that allows for pausing, continuing and clearing a timer. Based on https://stackoverflow.com/a/20745721.
 * @param callback The callback to be called.
 * @param delay The delay in milliseconds.
 */
class Timer {
	private id: NodeJS.Timeout | null;
	private started: Date | null;
	private remaining: number;
	private running: boolean;
	private callback: () => unknown;

	constructor(callback: () => unknown, delay: number) {
		this.id = null;
		this.started = null;
		this.remaining = delay;
		this.running = false;
		this.callback = callback;

		this.start();
	}

	start = () => {
		this.running = true;
		this.started = new Date();
		this.id = setTimeout(this.callback, this.remaining);
	};

	pause = () => {
		if (!this.id || !this.started || !this.running) return;

		this.running = false;
		clearTimeout(this.id);
		this.remaining -= Date.now() - this.started.getTime();
	};

	getTimeLeft = () => {
		if (this.running) {
			this.pause();
			this.start();
		}

		return this.remaining;
	};

	getStateRunning = () => {
		return this.running;
	};
}

function removeToast(toastID: string) {
	const toastEl = document.getElementById(toastID);

	if (!toastEl) return;

	activeToasts = activeToasts.filter((x) => x !== toastID);

	toastEl.classList.add('closing');

	setTimeout(() => toastEl.remove(), 400);
}

function createToast(props: ToastProps) {
	const toastParent = document.getElementById('sui-toast-drawer')! as HTMLDivElement;

	const toastContainer = document.createElement('div');
	const toastID = generateID('toast');
	toastContainer.tabIndex = 0;
	toastContainer.ariaLive = 'polite';
	toastContainer.role = 'alert';
	toastContainer.id = toastID;
	toastContainer.ariaLabel = `${props.title} (F8)`;
	toastContainer.classList.add(
		'sui-toast-container',
		`${props.closeButton || (props.persistent && 'closeable')}`,
		`${props.persistent && 'persistent'}`
	);

	const toastHeader = document.createElement('div');
	toastHeader.classList.add('sui-toast-header');

	const toastHeaderLeftSide = document.createElement('div');
	toastHeaderLeftSide.classList.add('sui-toast-header-left-side');

	const toastTitle = document.createElement('span');
	toastTitle.textContent = props.title;
	toastTitle.classList.add('sui-toast-title');

	let iconString: ValidIconString;

	if (props.type === 'success') {
		iconString = 'check-circle';
		toastContainer.classList.add('success');
	} else if (props.type === 'danger') {
		iconString = 'exclamation-circle';
		toastContainer.classList.add('danger');
	} else if (props.type === 'warning') {
		iconString = 'exclamation-triangle';
		toastContainer.classList.add('warning');
	} else {
		iconString = 'information-circle';
		toastContainer.classList.add('info');
	}

	const toastIcon = getIconString(iconString, 'toast-icon', 24, 24);
	toastHeaderLeftSide.innerHTML = toastIcon;

	toastHeaderLeftSide.appendChild(toastTitle);
	toastHeader.appendChild(toastHeaderLeftSide);

	if (props.closeButton || props.persistent) {
		const closeIconContainer = document.createElement('button');
		closeIconContainer.classList.add('close-icon-container');
		closeIconContainer.addEventListener('click', () => removeToast(toastID));
		closeIconContainer.innerHTML = getIconString('x-mark', 'close-icon', 24, 24);
		closeIconContainer.tabIndex = 0;
		closeIconContainer.ariaLabel = 'Close toast';

		toastHeader.appendChild(closeIconContainer);
	}

	toastContainer.appendChild(toastHeader);

	if (props.description) {
		const toastDesc = document.createElement('span');
		toastDesc.innerHTML = props.description;
		toastDesc.classList.add('sui-toast-desc');

		toastContainer.appendChild(toastDesc);
	}

	if (!props.persistent) {
		const toastProgressBar = document.createElement('div');
		toastProgressBar.classList.add('sui-toast-progress-bar');
		toastProgressBar.style.animationDuration = props.duration
			? `${props.duration}ms`
			: `${toastParent.dataset.duration || 4000}ms`;

		toastContainer.appendChild(toastProgressBar);
	}

	toastParent.appendChild(toastContainer);

	activeToasts.push(toastID);

	if (!props.persistent) {
		const timer = new Timer(
			() => removeToast(toastID),
			props.duration ||
				(toastParent.dataset.duration ? Number.parseInt(toastParent.dataset.duration, 10) : 4000)
		);

		const timerPauseWrapper = () => {
			toastContainer.classList.add('paused');
			timer.pause();
		};

		const timerStartWrapper = () => {
			toastContainer.classList.remove('paused');
			timer.start();
		};

		toastContainer.addEventListener('mouseenter', timerPauseWrapper);
		toastContainer.addEventListener('focusin', timerPauseWrapper);

		toastContainer.addEventListener('mouseleave', timerStartWrapper);
		toastContainer.addEventListener('focusout', () => {
			const focusedOrHasFocused = toastContainer.matches(':focus-within');

			if (!focusedOrHasFocused) {
				revertFocusBackToLastActiveElement();
			}

			timerStartWrapper();
		});
	}

	toastContainer.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			removeToast(toastID);
			revertFocusBackToLastActiveElement();
		}
	});
}

document.addEventListener('createtoast', (e) => {
	e.stopImmediatePropagation();

	const event = e as CustomEvent<ToastProps>;

	createToast(event.detail);
});

window.addEventListener('keydown', (e) => {
	if (e.key === 'F8') {
		e.preventDefault();

		const oldestToast = activeToasts[0];

		if (oldestToast) {
			lastActiveElement = document.activeElement as HTMLElement;

			const toastEl = document.getElementById(oldestToast);
			if (toastEl) toastEl?.focus();
		}
	}
});
