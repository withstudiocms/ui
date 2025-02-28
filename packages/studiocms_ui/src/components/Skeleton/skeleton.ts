import { z } from 'astro/zod';

const measurementPx = z.custom<`${number}px`>();
const measurementRem = z.custom<`${number}rem`>();
const measurementPercent = z.custom<`${number}%`>();

const measurement = z.union([measurementPx, measurementRem, measurementPercent]);

const BaseSkeletonSchema = z.object({
	/**
	 * The variant of the skeleton.
	 */
	variant: z.literal('text'),

  /**
   * The class of the skeleton. Defaults to `undefined`.
   */
	class: z.string().optional(),

  /**
   * The radius of the skeleton. Defaults to `lg`.
   */
	radius: z.union([z.literal('none'), z.literal('sm'), z.literal('md'), z.literal('lg')]).optional(),

  /**
   * The animation of the skeleton. Defaults to `slide`.
   */
	animation: z.union([z.literal('none'), z.literal('slide'), z.literal('pulse')]).optional(),

  /**
   * The width of the skeleton. Defaults to `100%`.
   */
	width: measurement.optional(),

  /**
   * The height of the skeleton. Defaults to `100%`.
   */
	height: measurement.optional(),
});

const CardSkeletonSchema = BaseSkeletonSchema.extend({
  /**
   * The variant of the skeleton. `card` is used for cards which contain other Skeleton components.
   */
	variant: z.literal('card'),

  /**
   * The direction of the skeleton. Defaults to `column`.
   */
	direction: z.union([z.literal('row'), z.literal('column')]).optional(),

  /**
   * The horizontal alignment of the skeleton. Defaults to `center`.
   */
	hAlign: z.union([z.literal('start'), z.literal('center'), z.literal('end')]).optional(),

  /**
   * The vertical alignment of the skeleton. Defaults to `center`.
   */
	vAlign: z.union([z.literal('start'), z.literal('center'), z.literal('end')]).optional(),

  /**
   * The gap between the skeletons. Defaults to `0.5rem`.
   */
	gap: measurement.optional(),
});

const BlockCircleSchema = BaseSkeletonSchema.extend({
  /**
   * The variant of the skeleton. `circle` is used for circles which contain other Skeleton components.
   */
	variant: z.union([z.literal('circle'), z.literal('block')]),

  /**
   * The width of the skeleton.
   */
	width: measurement,

  /**
   * The height of the skeleton.
   */
	height: measurement,
});

export const SkeletonSchema = z.union([BaseSkeletonSchema, CardSkeletonSchema, BlockCircleSchema]);