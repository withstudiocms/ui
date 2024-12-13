class ModalHelper {
	private element: HTMLDialogElement;
	private cancelButton: HTMLButtonElement | undefined;
	private confirmButton: HTMLButtonElement | undefined;

	private isForm = false;
	private modalForm: HTMLFormElement;

	/**
	 * A helper to manage modals.
	 * @param id The ID of the modal.
	 * @param triggerID The ID of the element that should trigger the modal.
	 */
	constructor(id: string, triggerID?: string) {
		const element = document.getElementById(id) as HTMLDialogElement;

		if (!element) {
			throw new Error(`No modal with ID ${id} found.`);
		}

		this.element = element as HTMLDialogElement;
		this.modalForm = document.getElementById(`${id}-form-element`) as HTMLFormElement;

		const isDismissable = this.element.dataset.dismissable === 'true';
		const isForm = this.element.dataset.form === 'true';

		if (isDismissable) {
			this.addDismissiveClickListener();
		}

		if (isForm) this.isForm = true;

		this.addButtonListeners(id, isDismissable);

		if (triggerID) {
			this.bindTrigger(triggerID);
		}
	}

	/**
	 * A helper function which adds event listeners to the modal buttons to close the modal when clicked.
	 * @param id The ID of the modal.
	 * @param dismissable Whether the modal is dismissable.
	 */
	private addButtonListeners = (id: string, dismissable: boolean) => {
		if (
			dismissable ||
			(!this.element.dataset.hasCancelButton && !this.element.dataset.hasActionButton)
		) {
			const xMarkButton = document.getElementById(`${id}-btn-x`) as HTMLButtonElement;
			xMarkButton.addEventListener('click', this.hide);
		}

		if (!!this.element.dataset.hasCancelButton && !this.element.dataset.hasActionButton) return;

		if (this.element.dataset.hasCancelButton) {
			this.cancelButton = document.getElementById(`${id}-btn-cancel`) as HTMLButtonElement;
			this.cancelButton.addEventListener('click', this.hide);
		}

		if (this.element.dataset.hasActionButton) {
			this.confirmButton = document.getElementById(`${id}-btn-confirm`) as HTMLButtonElement;
			this.confirmButton.addEventListener('click', this.hide);
		}
	};

	/**
	 * A helper function to close the modal when the user clicks outside of it.
	 */
	private addDismissiveClickListener = () => {
		this.element.addEventListener('click', (e: MouseEvent) => {
			if (!e.target) return;

			const { left, right, top, bottom } = this.element.getBoundingClientRect();

			const clickWithinModalBox =
				e.clientX < right && e.clientX > left && e.clientY < bottom && e.clientY > top;

			if (!clickWithinModalBox) {
				this.element.close();
			}
		});
	};

	/**
	 * A function to show the modal.
	 */
	public show = () => {
		this.element.showModal();
	};

	/**
	 * A function to hide the modal.
	 */
	public hide = () => {
		this.element.close();
	};

	/**
	 * A function to add another trigger to show the modal with.
	 * @param elementID The ID of the element that should trigger the modal when clicked.
	 */
	public bindTrigger = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No element with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.show);
	};

	/**
	 * Registers a callback for the cancel button.
	 * @param func The callback function.
	 */
	public registerCancelCallback = (func: () => void) => {
		if (!this.cancelButton) {
			throw new Error('Unable to register cancel callback without a cancel button.');
		}

		this.cancelButton.removeEventListener('click', this.hide);

		this.cancelButton.addEventListener('click', () => {
			func();
			this.hide();
		});
	};

	/**
	 * Registers a callback for the confirm button.
	 * @param func The callback function. If the modal is a form, the function will be called with 
	 * the form data as the first argument.
	 */
	public registerConfirmCallback = (func: (data?: FormData | undefined) => void) => {
		if (!this.confirmButton) {
			throw new Error('Unable to register cancel callback without a confirmation button.');
		}

		this.confirmButton.removeEventListener('click', this.hide);

		if (this.isForm) {
			this.modalForm.addEventListener('submit', (e) => {
				e.preventDefault();

				const formData = new FormData(this.modalForm);

				func(formData);
				this.hide();

				setTimeout(() => this.modalForm.reset(), 450);
			});
		} else {
			this.confirmButton.addEventListener('click', () => {
				func();
				this.hide();
			});
		}
	};
}

export { ModalHelper };
