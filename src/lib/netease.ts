import type { NeteaseSong } from '../types'

// Deploy NeteaseCloudMusicApiEnhanced yourself and set VITE_NETEASE_API_BASE_URL.
// The fallback is suitable for anonymous search and short preview attempts only.
const apiBase = (import.meta.env.VITE_NETEASE_API_BASE_URL || 'https://netease-cloud-music-api-gjmp.vercel.app').replace(/\/$/, '')

type SearchResponse = { result?: { songs?: Array<{ id: number; name: string; artists?: Array<{ name: string }>; album?: { name?: string; picUrl?: string } }> } }
type SongUrlResponse = { data?: Array<{ url?: string | null }> }

export async function searchNeteaseSongs(keywords: string): Promise<NeteaseSong[]> {
  const query = new URLSearchParams({ keywords, type: '1', limit: '8' })
  const response = await fetch(`${apiBase}/search?${query}`)
  if (!response.ok) throw new Error('Music search is unavailable.')
  const payload = await response.json() as SearchResponse
  return (payload.result?.songs ?? []).map(song => ({
    id: song.id,
    name: song.name,
    artists: song.artists?.map(artist => artist.name).join(' / ') || 'Unknown artist',
    album: song.album?.name || 'Unknown album',
    coverUrl: song.album?.picUrl,
  }))
}

export async function getNeteasePreviewUrl(id: number): Promise<string | null> {
  const query = new URLSearchParams({ id: String(id), level: 'standard' })
  const response = await fetch(`${apiBase}/song/url/v1?${query}`)
  if (!response.ok) throw new Error('Preview is unavailable.')
  const payload = await response.json() as SongUrlResponse
  return payload.data?.[0]?.url ?? null
}
