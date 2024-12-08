import md5 from 'md5';

type ThumURLAuthOptions =
	| {
			type: 'referer';
	  }
	| {
			type: 'raw' | 'md5';
			keyId: string;
			secret: string;
	  };

interface IThumURLOptions {
	url: string;
	protocol?: string;
	useImageAPI?: boolean;
	maxAge?: number;
	width?: number;
	crop?: number;
	png?: boolean;
	refresh?: boolean;
	ogImage?: boolean;
	device?: 'ipad' | 'iphone5' | 'iphone6' | 'iphone6plus' | 'galaxys5';
	auth?: string | ThumURLAuthOptions;
}

export default function getThumURL(options: IThumURLOptions) {
	let thumUrl = '//image.thum.io/get';

	const url = options.url;
	if (!url) {
		throw new Error('Url must be specified');
	}

	const protocol = options.protocol;
	if (protocol) {
		thumUrl = `${protocol}:${thumUrl}`;
	}

	const useImageAPI = options.useImageAPI;
	if (useImageAPI) {
		thumUrl += '/image';
	}

	const maxAge = options.maxAge;
	if (maxAge) {
		thumUrl += `/maxAge/${maxAge}`;
	}

	const width = options.width;
	if (width) {
		thumUrl += `/width/${width}`;
	}

	const crop = options.crop;
	if (crop) {
		thumUrl += `/crop/${crop}`;
	}

	const png = options.png;
	if (png) {
		thumUrl += '/png';
	}

	const refresh = options.refresh;
	if (refresh) {
		thumUrl += '/refresh';
	}

	const ogImage = options.ogImage;
	if (ogImage) {
		thumUrl += '/ogImage';
	}

	const device = options.device;
	if (device) {
		switch (device) {
			case 'ipad':
			case 'iphone5':
			case 'iphone6':
			case 'iphone6plus':
			case 'galaxys5':
				thumUrl += `/${device}`;
				break;

			default:
				throw new Error('Device is not valid');
		}
	}

	const auth = options.auth;
	if (auth) {
		if (typeof auth === 'string') {
			thumUrl += `/auth/${auth}`;
		} else {
			switch (auth.type) {
				case 'raw':
					thumUrl += `/auth/${auth.keyId}-${auth.secret}`;
					break;
				case 'md5': {
					// Add 300 seconds to the current time for a 5 minute expiry
					const expires = new Date().getTime() + 1000 * 300;

					const hash = md5(auth.secret + expires + url);
					thumUrl += `/auth/${auth.keyId}-${expires}-${hash}`;

					break;
				}
				case 'referer':
					// Doesn't need to add to URL
					break;
				default:
					throw new Error("Auth type must be 'raw' or 'md5' or 'referer'");
			}
		}
	}

	return `${thumUrl}/${url}`;
}
