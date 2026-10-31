import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from './consts';
import { getPosts, postUrl } from './utils';

export async function buildRss(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description.en,
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.pubDate, link: postUrl(p) })),
  });
}
