import type { APIContext } from 'astro';
import { buildRss } from '../rss';
export const GET = (context: APIContext) => buildRss(context);
