export const LANGS = ['en', 'zh'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const HTML_LANG: Record<Lang, string> = { en: 'en', zh: 'zh-CN' };

export const ui = {
  en: {
    writing: 'Writing', archive: 'Archive', about: 'About', all: 'All',
    everything: 'Everything, by year →', back: '← Writing', onPage: 'On this page',
    newer: '← Newer', older: 'Older →', latest: 'Latest', elsewhere: 'Elsewhere',
    blurb: 'Notes from a Mac and Linux developer. Written on a Mac, in plain text.',
    noTrack: 'No cookies, no trackers.', updated: 'Updated',
    alsoIn: 'This post is also available in Chinese', altBadge: '中文',
    archiveLede: (n: number) => n + ' posts, newest first.',
    tagLede: (n: number) => n + (n === 1 ? ' post' : ' posts'),
    minRead: (n: number) => n + ' min read',
    toLight: 'Switch to light mode', toDark: 'Switch to dark mode',
    notFound: 'Nothing here', notFoundBody: 'That page moved or never existed.', backHome: 'Back to writing →',
  },
  zh: {
    writing: '文章', archive: '归档', about: '关于', all: '全部',
    everything: '按年份查看全部 →', back: '← 文章', onPage: '本页目录',
    newer: '← 较新', older: '较早 →', latest: '最新', elsewhere: '其他地方',
    blurb: '一位 Mac 与 Linux 开发者的笔记。在 Mac 上用纯文本写成。',
    noTrack: '无 Cookie，无追踪。', updated: '更新于',
    alsoIn: '本文另有英文版本', altBadge: 'EN',
    archiveLede: (n: number) => '共 ' + n + ' 篇，按时间倒序。',
    tagLede: (n: number) => '共 ' + n + ' 篇',
    minRead: (n: number) => n + ' 分钟阅读',
    toLight: '切换到浅色模式', toDark: '切换到深色模式',
    notFound: '这里什么都没有', notFoundBody: '页面可能已移动或不存在。', backHome: '返回文章 →',
  },
} as const;

export const t = (lang: Lang) => ui[lang];

/** Prefix a site path for a language. path('zh', '/archive/') -> '/zh/archive/' */
export function path(lang: Lang, p = '/'): string {
  const clean = p.startsWith('/') ? p : '/' + p;
  return lang === DEFAULT_LANG ? clean : '/' + lang + (clean === '/' ? '/' : clean);
}

export function langFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return (LANGS as readonly string[]).includes(seg) ? (seg as Lang) : DEFAULT_LANG;
}

/** Same page in the other language (strip / add the /zh prefix). */
export function switchPath(url: URL, to: Lang): string {
  const from = langFromUrl(url);
  const rest = from === DEFAULT_LANG ? url.pathname : url.pathname.slice(from.length + 1) || '/';
  return path(to, rest);
}

/** Display names for canonical (English) tags. Unknown tags show as written. */
export const TAG_LABELS: Record<string, Partial<Record<Lang, string>>> = {
  Software: { zh: '软件' }, Design: { zh: '设计' }, Apple: { zh: 'Apple' },
  Travel: { zh: '旅行' }, Books: { zh: '读书' }, Life: { zh: '生活' }, Linux: { zh: 'Linux' },
};
export const tagLabel = (tag: string, lang: Lang) => TAG_LABELS[tag]?.[lang] ?? tag;
