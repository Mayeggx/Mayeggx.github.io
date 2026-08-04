import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const sourceFile = path.join(root, 'posts', 'memory.md')
const outputFile = path.join(root, 'public', 'content', 'memory.json')
const parseImages = (value) => [...new Set(value.split(/[,，]/).map((image) => image.trim()).filter(Boolean))]

function parseEntries(markdown) {
  const entries = []
  let entry = null
  const flush = () => { if (entry) entries.push(entry); entry = null }
  const source = markdown.replace(/<!--[\s\S]*?-->/g, '')
  for (const rawLine of source.split(/\r?\n/)) {
    const listField = rawLine.match(/^\s*-\s*([a-zA-Z]+)\s*:\s*(.*?)\s*$/)
    if (listField) {
      flush()
      const [, name, value] = listField
      entry = { [name.toLowerCase()]: name.toLowerCase() === 'images' ? parseImages(value) : value.trim() }
      continue
    }
    const field = rawLine.match(/^\s{2,}([a-zA-Z]+)\s*:\s*(.*?)\s*$/)
    if (!field || !entry) continue
    const [, name, value] = field
    entry[name.toLowerCase()] = name.toLowerCase() === 'images' ? parseImages(value) : value.trim()
  }
  flush()
  return entries.map((entry, index) => {
    if (!entry.date || Number.isNaN(Date.parse(`${entry.date}T00:00:00`))) throw new Error(`Memory entry ${index + 1} must contain a valid date`)
    if (!entry.content) throw new Error(`Memory entry ${index + 1} must contain content`)
    return { date: entry.date, content: entry.content, images: entry.images || [] }
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
}

const raw = await fs.readFile(sourceFile, 'utf8')
const { data, content } = matter(raw)
if (data.type !== 'memory-log') throw new Error('posts/memory.md must declare type: memory-log')
const entries = parseEntries(content)
await fs.mkdir(path.dirname(outputFile), { recursive: true })
await fs.writeFile(outputFile, JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), entries }, null, 2))
console.log(`Generated ${entries.length} memory entries.`)
