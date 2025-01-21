interface CustomEventMap {
	createtoast: CustomEvent<import('./assets/types').ToastProps>;
}

declare global {
	interface Document {
		addEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void
		): void;
		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
	}
}

declare module 'studiocms:ui/scripts/*' {}
