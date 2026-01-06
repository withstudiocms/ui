/** biome-ignore-all lint/correctness/noUnusedVariables: Global augments */

/**
 * CustomEventMap defines the custom events used in the application.
 *
 * @interface CustomEventMap
 */
interface CustomEventMap {
	/**
	 * Represents a custom event for creating a toast notification. The event detail
	 * contains the properties defined in ToastProps.
	 *
	 * @event createtoast
	 * @type {CustomEvent<import('./types/index.js').ToastProps>}
	 */
	createtoast: CustomEvent<import('./types/index.js').ToastProps>;
}

/**
 * Tooltip interface defines the structure of a tooltip API on the window object.
 */
interface SuiTooltipApi {
	instances: Map<string, Tooltip>;
	/**
	 * Gets a tooltip instance by its container ID.
	 * @param id The ID of the tooltip container element.
	 * @returns The Tooltip instance if found, otherwise undefined.
	 */
	get: (id: string) => Tooltip | undefined;

	/**
	 * Shows a tooltip by its container ID.
	 * @param id The ID of the tooltip container element.
	 */
	show: (id: string) => void;

	/**
	 * Hides a tooltip by its container ID.
	 * @param id The ID of the tooltip container element.
	 */
	hide: (id: string) => void;
}

interface Window {
	/**
	 * The StudioCMS UI API, which includes various tools and utilities for the UI.
	 */
	sui: {
		/**
		 * The tooltip API, which provides methods for managing tooltips in the UI.
		 */
		tooltips: SuiTooltipApi;
	};
}

/**
 * Extends the global `Document` interface to include custom event handling methods.
 *
 * @template K - The type of the event name, which must be a key of `CustomEventMap`.
 *
 * @interface Document
 * @method addEventListener
 * @param type - The name of the event to listen for.
 * @param listener - The callback function that will be invoked when the event is dispatched.
 *
 * @method dispatchEvent
 * @param ev - The custom event to be dispatched.
 */
declare global {
	/**
	 * Extends the global `Document` interface to include custom event handling methods.
	 *
	 * @template K - The type of the event name, which must be a key of `CustomEventMap`.
	 *
	 * @interface Document
	 * @method addEventListener
	 * @param type - The name of the event to listen for.
	 * @param listener - The callback function that will be invoked when the event is dispatched.
	 *
	 * @method dispatchEvent
	 * @param ev - The custom event to be dispatched.
	 */
	interface Document {
		/**
		 * Adds an event listener for a custom event.
		 *
		 * @template K - The type of the event name, which must be a key of `CustomEventMap`.
		 *
		 * @param type - The name of the event to listen for.
		 * @param listener - The callback function that will be invoked when the event is dispatched.
		 */
		addEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void
		): void;

		/**
		 * Dispatches a custom event.
		 *
		 * @template K - The type of the event name, which must be a key of `CustomEventMap`.
		 *
		 * @param ev - The custom event to be dispatched.
		 */
		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
	}
}
