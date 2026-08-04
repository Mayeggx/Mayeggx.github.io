import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const sourceFile = path.join(root, 'posts', 'music.md')
const reviewSourceFile = path.join(root, 'posts', 'music-review.md')
const outputFile = path.join(root, 'public', 'content', 'music.json')
const apiBase = (process.env.NETEASE_API_BASE_URL || 'https://moefurina-neteasecloudmusicapienhanced.hf.space').replace(/\/$/, '')
const colors = ['violet', 'orange', 'mint', 'sky', 'rose', 'yellow', 'blue']
const dateOnly = (value) => value ? new Date(value).toISOString().slice(0, 10) : ''
const parseTags = (value) => [...new Set(value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean))]

function parseRecords(markdown) {
  const records = []
  let record = null
  const flush = () => { if (record) records.push(record); record = null }
  for (const rawLine of markdown.split(/\r?\n/)) {
    const listField = rawLine.match(/^\s*-\s*([a-zA-Z]+)\s*:\s*(.*?)\s*$/)
    if (listField) {
      flush()
      const [, name, value] = listField
      record = { [name.toLowerCase()]: name.toLowerCase() === 'tags' ? parseTags(value) : value.trim() }
      continue
    }
    const field = rawLine.match(/^\s{2,}([a-zA-Z]+)\s*:\s*(.*?)\s*$/)
    if (!field || !record) continue
    const [, name, value] = field
    record[name.toLowerCase()] = name.toLowerCase() === 'tags' ? parseTags(value) : value.trim()
  }
  flush()
  return records
}

function parseSongs(markdown) {
  const songs = parseRecords(markdown)
  songs.forEach((song, index) => {
    const id = Number(song.id)
    if (!Number.isInteger(id) || id !== index + 1) throw new Error(`Song id must be the next integer: expected ${index + 1}`)
    if (!song.song || !song.artist) throw new Error(`Song ${id} must contain song and artist`)
    song.id = id
  })
  return songs
}

function parseReviews(markdown, songIds) {
  const reviews = parseRecords(markdown).map((review, index) => {
    const songId = Number(review.songid)
    if (!Number.isInteger(songId) || !songIds.has(songId)) throw new Error(`Review ${index + 1} references an unknown songId`)
    if (!review.createdat || Number.isNaN(Date.parse(review.createdat))) throw new Error(`Review ${index + 1} must contain a valid createdAt`)
    if (!review.content) throw new Error(`Review ${index + 1} must contain content`)
    return { songId, createdAt: review.createdat, content: review.content }
  })
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

async function readCompiledSongs() {
  try {
    const previous = JSON.parse(await fs.readFile(outputFile, 'utf8'))
    const songs = Array.isArray(previous.songs) ? previous.songs : []
    return new Map(songs.filter((song) => Number.isInteger(song.id) && Number.isFinite(song.neteaseId)).map((song) => [song.id, song]))
  } catch (error) {
    if (error.code === 'ENOENT') return new Map()
    console.warn(`Could not read compiled music cache: ${error.message}`)
    return new Map()
  }
}

function mergeCachedSong(source, index, cached) {
  return {
    ...cached,
    id: source.id,
    tags: source.tags || [],
    practiceStatus: source.practice || '准备练习',
    addedAt: source.added || new Date().toISOString().slice(0, 10),
    color: colors[index % colors.length],
    note: source.note || '',
  }
}

async function enrichSong(source, index) {
  const keywords = [source.song, source.artist, source.album].filter(Boolean).join(' ')
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
      id: source.id,
      title: result.name,
      artist: result.artists?.map((artist) => artist.name).join(' / ') || source.artist,
      tags: source.tags || [],
      practiceStatus: source.practice || '准备练习',
      addedAt: source.added || new Date().toISOString().slice(0, 10),
      color: colors[index % colors.length],
      note: source.note || '',
      album: result.album?.name || source.album || '',
      releaseDate: dateOnly(result.album?.publishTime),
      coverUrl,
      neteaseId: result.id,
      neteaseUrl: `https://music.163.com/#/song?id=${result.id}`,
    }
  } catch (error) {
    console.warn(`Could not enrich “${source.song}”: ${error.message}`)
    return {
      id: source.id, title: source.song, artist: source.artist,
      tags: source.tags || [], practiceStatus: source.practice || '准备练习',
      addedAt: source.added || new Date().toISOString().slice(0, 10), color: colors[index % colors.length],
      note: source.note || '', album: source.album || '', releaseDate: '', coverUrl: '', neteaseUrl: '',
    }
  }
}

const musicRaw = await fs.readFile(sourceFile, 'utf8')
const reviewRaw = await fs.readFile(reviewSourceFile, 'utf8')
const { data: musicData, content: musicContent } = matter(musicRaw)
const { data: reviewData, content: reviewContent } = matter(reviewRaw)
if (musicData.type !== 'music-library') throw new Error('posts/music.md must declare type: music-library')
if (reviewData.type !== 'music-reviews') throw new Error('posts/music-review.md must declare type: music-reviews')
const sourceSongs = parseSongs(musicContent)
if (!sourceSongs.length) throw new Error('posts/music.md contains no valid songs')
const reviews = parseReviews(reviewContent, new Set(sourceSongs.map((song) => song.id)))
const compiledSongs = await readCompiledSongs()
let reusedCount = 0
const songs = await Promise.all(sourceSongs.map((source, index) => {
  const cached = compiledSongs.get(source.id)
  if (cached) {
    reusedCount += 1
    return mergeCachedSong(source, index, cached)
  }
  return enrichSong(source, index)
}))
const output = { updatedAt: new Date().toISOString().slice(0, 10), songs, reviews }
await fs.mkdir(path.dirname(outputFile), { recursive: true })
await fs.writeFile(outputFile, JSON.stringify(output, null, 2))
console.log(`Reused ${reusedCount} compiled music entries; compiled ${songs.length - reusedCount} new entries; generated ${reviews.length} reviews.`)
