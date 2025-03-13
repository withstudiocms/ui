import { AstroError } from 'astro/errors';

export class StudioCMS_UI_IconError extends AstroError {
	override name = 'StudioCMS UI Icon Error';
	override hint =
		'Please check that the Icon Collection you are using includes the icon you are trying to use.';
	override type = 'AstroUserError' as const;
}
