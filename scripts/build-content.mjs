import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const root = process.cwd()
const source = path.join(root, 'posts')
const files = (await fs.readdir(source)).filter((file) => file.endsWith('.md'))
const slugify = (value) => value.toLowerCase().trim().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section'
const getToc = (content) => {
  const used = new Map()
  return [...content.matchAll(/^(#{1,6})\s+(.+?)\s*#*\s*$/gm)].map(([, marks, raw]) => {
    const text = raw.replace(/[`*_]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim()
    const base = slugify(text), count = used.get(base) || 0
    used.set(base, count + 1)
    return { depth: marks.length, text, id: count ? `${base}-${count + 1}` : base, used: false }
  })
}
const addHeadingIds = (html, toc) => html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (full, depth, body) => {
  const text = body.replace(/<[^>]*>/g, '').trim()
  const item = toc.find((entry) => entry.depth === Number(depth) && entry.text === text && !entry.used)
  if (!item) return full
  item.used = true
  return `<h${depth} id="${item.id}">${body}</h${depth}>`
})
const posts = (await Promise.all(files.map(async (file) => {
  const raw = await fs.readFile(path.join(source, file), 'utf8')
  const { data, content } = matter(raw)
  if (data.type === 'music-library') return null
  const toc = getToc(content)
  const html = addHeadingIds(marked.parse(content, { gfm: true, breaks: false }), toc)
  toc.forEach(({ used: _used, ...item }, index) => { toc[index] = item })
  const text = content.replace(/[`#>*_\-[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
  return {
    slug: file.replace(/\.md$/, ''), title: data.title || file.replace(/\.md$/, ''),
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    categories: Array.isArray(data.categories) ? data.categories : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    math: Boolean(data.math), mermaid: Boolean(data.mermaid), toc, html, excerpt: text.slice(0, 180),
  }
}))).filter(Boolean)
posts.sort((a, b) => new Date(b.date) - new Date(a.date))
await fs.mkdir(path.join(root, 'public', 'content'), { recursive: true })
await fs.writeFile(path.join(root, 'public', 'content', 'posts.json'), JSON.stringify(posts, null, 2))
console.log(`Generated ${posts.length} posts.`)
