import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const sourceFile = path.join(root, 'posts', 'music.md')
const outputFile = path.join(root, 'public', 'content', 'music.json')
const apiBase = (process.env.NETEASE_API_BASE_URL || 'https://moefurina-neteasecloudmusicapienhanced.hf.space').replace(/\/$/, '')
const colors = ['violet', 'orange', 'mint', 'sky', 'rose', 'yellow', 'blue']
const slugify = (value) => value.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'song'
const dateOnly = (value) => value ? new Date(value).toISOString().slice(0, 10) : ''

function parseLibrary(markdown) {
  const songs = []
  let category = 'J-Pop'
  let song = null
  const flush = () => { if (song?.title && song.artist) songs.push(song); song = null }
  for (const rawLine of markdown.split(/\r?\n/)) {
    const heading = rawLine.match(/^##\s+(.+)\s*$/)
    if (heading) { flush(); category = heading[1].trim(); continue }
    const songStart = rawLine.match(/^\s*-\s*song\s*:\s*(.+)\s*$/i)
    if (songStart) { flush(); song = { title: songStart[1].trim(), artist: '', category }; continue }
    const field = rawLine.match(/^\s{2,}([a-zA-Z]+)\s*:\s*(.*?)\s*$/)
    if (field && song) song[field[1].toLowerCase()] = field[2].trim()
  }
  flush()
  return songs
}

async function enrichSong(source, index) {
  const keywords = [source.title, source.artist, source.album].filter(Boolean).join(' ')
  try {
    const query = new URLSearchParams({ keywords, type: '1', limit: '1' })
    const response = await fetch(`${apiBase}/search?${query}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const payload = await response.json()
    const result = payload.result?.songs?.[0]
    if (!result) throw new Error('No search result')
    let coverUrl = result.album?.picUrl || ''
    if (!coverUrl) {
      const detailResponse = await fetch(`${apiBase}/song/detail?ids=${result.id}`)
      if (detailResponse.ok) {
        const detail = await detailResponse.json()
        coverUrl = detail.songs?.[0]?.al?.picUrl || detail.songs?.[0]?.album?.picUrl || ''
      }
    }
    return {
      id: `${slugify(source.title)}-${result.id}`,
      title: result.name,
      artist: result.artists?.map((artist) => artist.name).join(' / ') || source.artist,
      category: source.category,
      practiceStatus: source.practice || '准备练习',
      addedAt: source.added || new Date().toISOString().slice(0, 10),
      color: colors[index % colors.length],
      note: source.note || '',
      album: result.album?.name || source.album || '',
      releaseDate: dateOnly(result.album?.publishTime),
      coverUrl,
      neteaseId: result.id,
      neteaseUrl: `https://music.163.com/#/song?id=${result.id}`,
      thought: source.thought || '',
      mood: source.mood || '听后记录',
    }
  } catch (error) {
    console.warn(`Could not enrich “${source.title}”: ${error.message}`)
    return {
      id: `${slugify(source.title)}-local`, title: source.title, artist: source.artist,
      category: source.category, practiceStatus: source.practice || '准备练习',
      addedAt: source.added || new Date().toISOString().slice(0, 10), color: colors[index % colors.length],
      note: source.note || '', album: source.album || '', releaseDate: '', coverUrl: '', neteaseUrl: '', thought: source.thought || '', mood: source.mood || '听后记录',
    }
  }
}

const raw = await fs.readFile(sourceFile, 'utf8')
const { data, content } = matter(raw)
if (data.type !== 'music-library') throw new Error('posts/music.md must declare type: music-library')
const sourceSongs = parseLibrary(content)
if (!sourceSongs.length) throw new Error('posts/music.md contains no valid songs')
const songs = await Promise.all(sourceSongs.map(enrichSong))
const thoughts = songs.filter((song) => song.thought).map((song) => ({ id: `thought-${song.id}`, songId: song.id, date: song.addedAt, mood: song.mood, content: song.thought }))
const output = { updatedAt: new Date().toISOString().slice(0, 10), songs: songs.map(({ thought: _thought, mood: _mood, ...song }) => song), thoughts }
await fs.mkdir(path.dirname(outputFile), { recursive: true })
await fs.writeFile(outputFile, JSON.stringify(output, null, 2))
console.log(`Generated ${songs.length} enriched music entries.`)
