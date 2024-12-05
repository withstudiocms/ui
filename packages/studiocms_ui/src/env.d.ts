/// <reference path="../.astro/types.d.ts" />

interface CustomEventMap {
	createtoast: CustomEvent<import('./types').ToastProps>;
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
