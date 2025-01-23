class SingleSidebarHelper {
	private sidebar: HTMLElement;
	private sidebarToggle?: HTMLElement | undefined;

	/**
	 * A helper to manage the sidebar with.
	 * @param toggleID The ID of the element that should toggle the sidebar.
	 */
	constructor(toggleID?: string) {
		const sidebarContainer = document.getElementById('sui-sidebar');

		if (!sidebarContainer) {
			throw new Error(
				`No item with ID 'sui-sidebar' found. Please add the <Sidebar> component to this page.`
			);
		}

		this.sidebar = sidebarContainer;

		if (toggleID) {
			this.toggleSidebarOnClick(toggleID);
		}
	}

	/**
	 * A helper function register an element which should toggle the sidebar.
	 * @param elementID The ID of the element that should toggle the sidebar.
	 */
	public toggleSidebarOnClick = (elementID: string) => {
		const navToggle = document.getElementById(elementID);

		if (!navToggle) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		this.sidebarToggle = navToggle;

		this.sidebarToggle.addEventListener('click', () => {
			this.sidebar.classList.toggle('active');
		});
	};

	/**
	 * A helper function to hide the sidebar when an element is clicked.
	 * @param elementID The ID of the element that should hide the sidebar.
	 */
	public hideSidebarOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.hideSidebar);
	};

	/**
	 * A helper function to show the sidebar when an element is clicked.
	 * @param elementID The ID of the element that should show the sidebar.
	 */
	public showSidebarOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.showSidebar);
	};

	/**
	 * A function to hide the sidebar.
	 */
	public hideSidebar = () => {
		this.sidebar.classList.remove('active');
	};

	/**
	 * A function to show the sidebar.
	 */
	public showSidebar = () => {
		this.sidebar.classList.add('active');
	};
}

class DoubleSidebarHelper {
	private sidebarsContainer: HTMLElement;

	/**
	 * A helper to manage the double sidebar with.
	 */
	constructor() {
		const sidebarsContainer = document.getElementById('sui-sidebars');

		if (!sidebarsContainer) {
			throw new Error(
				`No item with ID 'sidebars' found. Please add the <DoubleSidebar> component to this page.`
			);
		}

		this.sidebarsContainer = sidebarsContainer;
	}

	/**
	 * A helper function to hide the sidebar when an element is clicked.
	 * @param elementID The ID of the element that should hide the sidebar.
	 */
	public hideSidebarOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.hideSidebar);
	};

	/**
	 * A helper function to show the outer sidebar when an element is clicked.
	 * @param elementID The ID of the element that should show the outer sidebar.
	 */
	public showOuterOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.showOuterSidebar);
	};

	/**
	 * A helper function to show the inner sidebar when an element is clicked.
	 * @param elementID The ID of the element that should show the inner sidebar.
	 */
	public showInnerOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.showInnerSidebar);
	};

	/**
	 * A helper function to toggle between the outer and inner sidebar when an element is clicked.
	 * @param elementID The ID of the element that should toggle the sidebar view.
	 */
	public toggleStateOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.toggleSidebarState);
	};

	/**
	 * A function to show the inner sidebar.
	 */
	public showInnerSidebar = () => {
		this.sidebarsContainer.classList.add('inner', 'active');
	};

	/**
	 * A function to show the outer sidebar.
	 */
	public showOuterSidebar = () => {
		this.sidebarsContainer.classList.add('active');
		this.sidebarsContainer.classList.remove('inner');
	};

	/**
	 * A function to toggle between the outer and inner sidebar.
	 */
	public toggleSidebarState = () => {
		if (this.sidebarsContainer.classList.contains('inner')) {
			this.showOuterSidebar();
		} else {
			this.showInnerSidebar();
		}
	};

	/**
	 * A function to hide the sidebar altogether.
	 */
	public hideSidebar = () => {
		this.sidebarsContainer.classList.remove('inner', 'active');
	};
}

export { SingleSidebarHelper, DoubleSidebarHelper };
