interface CustomEventMap {
	createtoast: CustomEvent<import('./src/types/index.ts').ToastProps>;
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
