import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type PostLang = Post['data']['lang'];

export const postUrl = (p: Post) => '/blog/' + p.id + '/';
export const htmlLang = (l: PostLang) => (l === 'zh' ? 'zh-CN' : 'en');

/** Every published post including translated copies, newest first. Drafts show in dev only. */
async function all(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Posts for lists, RSS and prev/next: translated copies are hidden so each post appears once. */
export async function getPosts(): Promise<Post[]> {
  return (await all()).filter((p) => !p.data.translationOf);
}

/** The other-language version of a post, if one exists. */
export async function getTranslation(post: Post): Promise<Post | undefined> {
  const posts = await all();
  if (post.data.translationOf) return posts.find((p) => p.id === post.data.translationOf);
  return posts.find((p) => p.data.translationOf === post.id);
}

export function readingTime(body = '', lang: PostLang = 'en'): number {
  const text = body.replace(/```[\s\S]*?```/g, ' ');
  const han = (text.match(/[\u3400-\u9fff]/g) || []).length; // CJK characters, ~400/min
  const words = text.replace(/[\u3400-\u9fff]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(han / 400 + words / 225));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/(^-|-$)/g, '');
}

export async function getTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const p of await getPosts()) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, slug: slugifyTag(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

const PALETTE: Record<string, [string, string]> = {
  software: ['light-dark(#F5E6DF,rgba(224,138,106,.16))', 'light-dark(#A94F31,#E8A68C)'],
  design:   ['light-dark(#EDE9F3,rgba(170,150,200,.16))', 'light-dark(#5F4B86,#C3B3E0)'],
  apple:    ['light-dark(#E9ECE6,rgba(150,170,140,.16))', 'light-dark(#4A5E3F,#B5C9A8)'],
  travel:   ['light-dark(#F4ECDA,rgba(220,180,110,.16))', 'light-dark(#86601A,#E2C383)'],
  books:    ['light-dark(#F3E4E4,rgba(210,140,140,.16))', 'light-dark(#8E3B3B,#E3A9A9)'],
  life:     ['light-dark(#E2ECEA,rgba(120,180,170,.16))', 'light-dark(#2F6A61,#9FD0C7)'],
};
const FALLBACK = Object.values(PALETTE);

export function tagColors(tag: string): { bg: string; fg: string } {
  const key = slugifyTag(tag);
  let pair = PALETTE[key];
  if (!pair) { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; pair = FALLBACK[h % FALLBACK.length]; }
  return { bg: pair[0], fg: pair[1] };
}

/** getStaticPaths for /blog/[...slug]. Translated copies get pages too; their newer/older follow the original. */
export async function postPaths() {
  const listed = await getPosts();
  const everything = await all();
  return Promise.all(everything.map(async (post) => {
    const anchor = post.data.translationOf ?? post.id;
    const i = listed.findIndex((p) => p.id === anchor);
    return {
      params: { slug: post.id },
      props: { post, newer: i > 0 ? listed[i - 1] : undefined, older: i >= 0 ? listed[i + 1] : undefined, translation: await getTranslation(post) },
    };
  }));
}

export async function tagPaths() {
  return (await getTags()).map((t) => ({ params: { tag: t.slug }, props: { tag: t.tag } }));
}
