export type TocItem = { depth: number; text: string; id: string }
export type Post = { slug: string; title: string; date: string; categories: string[]; tags: string[]; excerpt: string; html: string; toc?: TocItem[] }
export type View = { kind: 'home' | 'categories' | 'archives' | 'tags' | 'about' | 'post'; slug?: string; anchor?: string }
