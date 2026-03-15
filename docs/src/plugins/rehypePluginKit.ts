import rehypeSlug from 'rehype-slug';
import type { RehypePlugins } from './rehype.types';
import rehypeExternalLinks from './rehypeExternalLinks';

export const rehypePluginKit: RehypePlugins = [rehypeSlug, rehypeExternalLinks];

export default rehypePluginKit;
