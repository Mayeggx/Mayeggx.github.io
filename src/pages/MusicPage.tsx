import { useMemo, useState, type FormEvent } from 'react'
import './MusicPage.css'
import { Icon } from '../components/Icon'
import { getNeteasePreviewUrl, searchNeteaseSongs } from '../lib/netease'
import type { MusicCategory, MusicLibrary, NeteaseSong, PracticeStatus, Song } from '../types'

const categories: Array<MusicCategory | '全部'> = ['全部', 'J-Pop', 'Anisong', '术力口', '二偶']
const statuses: PracticeStatus[] = ['熟练掌握', '正在练习', '曾经熟悉', '准备练习']
const emptySongs: Song[] = []
const recentLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))

function SongArtwork({ song, compact = false }: { song: Song; compact?: boolean }) {
  return <div className={`song-art song-art-${song.color} ${compact ? 'song-art-small' : ''}`} aria-hidden="true"><span>{song.category}</span><Icon name="music" /></div>
}

export function MusicPage({ library }: { library: MusicLibrary | null }) {
  const [activeCategory, setActiveCategory] = useState<MusicCategory | '全部'>('全部')
  const [selected, setSelected] = useState<Song | null>(null)
  const [neteaseQuery, setNeteaseQuery] = useState('')
  const [neteaseResults, setNeteaseResults] = useState<NeteaseSong[]>([])
  const [neteaseLoading, setNeteaseLoading] = useState(false)
  const [neteaseError, setNeteaseError] = useState('')
  const [preview, setPreview] = useState<{ song: NeteaseSong; url: string } | null>(null)
  const songs = library?.songs ?? emptySongs
  const visibleSongs = useMemo(() => activeCategory === '全部' ? songs : songs.filter(song => song.category === activeCategory), [activeCategory, songs])
  const songById = useMemo(() => new Map(songs.map(song => [song.id, song])), [songs])
  const closePlayer = () => { setSelected(null); setPreview(null) }
  const play = (song: Song) => {
    if (song.youtubeId) setSelected(song)
    else if (song.searchUrl) window.open(song.searchUrl, '_blank', 'noopener,noreferrer')
  }
  const searchNetease = async (event: FormEvent) => {
    event.preventDefault()
    const keyword = neteaseQuery.trim()
    if (!keyword) return
    setNeteaseLoading(true); setNeteaseError(''); setNeteaseResults([])
    try { setNeteaseResults(await searchNeteaseSongs(keyword)) } catch { setNeteaseError('搜索服务暂时不可用，请稍后重试。') } finally { setNeteaseLoading(false) }
  }
  const previewNetease = async (song: NeteaseSong) => {
    setNeteaseError('')
    try {
      const url = await getNeteasePreviewUrl(song.id)
      if (!url) throw new Error('unavailable')
      setPreview({ song, url })
    } catch { setNeteaseError('该歌曲当前没有可用的试听链接。') }
  }

  if (!library) return <main className="music-page container"><div className="music-loading">正在载入音乐库…</div></main>

  return <main className="music-page container">
    <section className="music-intro"><div><p className="eyebrow">MY MUSIC LOG · {library.updatedAt}</p><h1>我的音乐</h1><p>把最近喜欢的声音、练习进度和听歌时留下的念头，收在同一张小小的唱片架里。</p></div><div className="music-count"><Icon name="headphones" /><strong>{songs.length}</strong><span>首收藏曲目</span></div></section>

    <section className="netease-search" aria-label="网易云音乐搜索"><div className="netease-search-copy"><p className="eyebrow">NETEASE CLOUD MUSIC</p><h2>想听什么？</h2><p>搜索网易云音乐，并直接试听可用的歌曲链接。</p></div><form onSubmit={searchNetease}><label className="netease-field"><Icon name="search" /><input value={neteaseQuery} onChange={event => setNeteaseQuery(event.target.value)} placeholder="歌名、歌手或专辑" aria-label="搜索网易云音乐" /><button type="submit" disabled={neteaseLoading}>{neteaseLoading ? '搜索中…' : '搜索'}</button></label></form>{neteaseError && <p className="netease-feedback is-error">{neteaseError}</p>}{neteaseResults.length > 0 && <div className="netease-results">{neteaseResults.map(song => <article className="netease-result" key={song.id}>{song.coverUrl ? <img src={song.coverUrl} alt="" /> : <div className="netease-cover"><Icon name="music" /></div>}<div><h3>{song.name}</h3><p>{song.artists} · {song.album}</p></div><button onClick={() => previewNetease(song)}><Icon name="play" />试听</button></article>)}</div>}</section>

    <section className="music-section recent-section"><div className="music-section-heading"><div><p className="eyebrow">RECENT FAVOURITES</p><h2>最近喜欢听的歌</h2></div><div className="music-filters" aria-label="按分类筛选">{categories.map(category => <button key={category} className={activeCategory === category ? 'is-active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div><div className="song-grid">{visibleSongs.map(song => <article className="song-card" key={song.id}><SongArtwork song={song} /><div className="song-card-copy"><span className="song-category">{song.category}</span><h3>{song.title}</h3><p>{song.artist}</p><small>收藏于 {recentLabel(song.addedAt)}</small></div><button className="play-button" onClick={() => play(song)} aria-label={`播放 ${song.title}`}><Icon name="play" /></button></article>)}</div></section>

    <section className="music-section practice-section"><div className="music-section-heading"><div><p className="eyebrow">PRACTICE SHELF</p><h2>歌曲练习情况</h2></div><p className="section-note">每首歌都在自己的时间里慢慢长熟。</p></div><div className="practice-grid">{statuses.map(status => { const statusSongs = songs.filter(song => song.practiceStatus === status); return <section className="practice-column" key={status}><header><h3>{status}</h3><span>{String(statusSongs.length).padStart(2, '0')}</span></header><div>{statusSongs.map(song => <button className="practice-song" key={song.id} onClick={() => play(song)}><SongArtwork song={song} compact /><span><b>{song.title}</b><small>{song.artist}</small></span>{song.youtubeId ? <Icon name="play" /> : <span className="external-mark">↗</span>}</button>)}</div></section> })}</div></section>

    <section className="music-section thoughts-section"><div className="music-section-heading"><div><p className="eyebrow">LISTENING NOTES</p><h2>最近的音乐感想</h2></div></div><div className="thought-list">{library.thoughts.map(thought => { const song = songById.get(thought.songId); if (!song) return null; return <article className="thought-card" key={thought.id}><div className="thought-meta"><time>{thought.date}</time><span>{thought.mood}</span></div><p>“{thought.content}”</p><button className="thought-song" onClick={() => play(song)}><SongArtwork song={song} compact /><span><b>{song.title}</b><small>{song.artist}</small></span><Icon name="play" /></button></article> })}</div></section>

    {(selected || preview) && <div className="player-overlay" role="dialog" aria-modal="true" aria-label="正在播放"><div className="music-player"><button className="player-close" onClick={closePlayer} aria-label="关闭播放器">×</button><div className="player-caption"><p>NOW PLAYING · {preview ? 'NETEASE CLOUD MUSIC' : 'YOUTUBE'}</p><h2>{preview?.song.name ?? selected?.title}</h2><span>{preview?.song.artists ?? selected?.artist}</span></div>{preview ? <div className="netease-player">{preview.song.coverUrl && <img src={preview.song.coverUrl} alt="" />}<audio src={preview.url} controls autoPlay /></div> : <div className="player-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${selected?.youtubeId}?autoplay=1&rel=0`} title={`${selected?.title} — ${selected?.artist}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>}<small>{preview ? '试听链接由已配置的网易云 API 服务提供。' : '播放器内容由 YouTube 提供。'}</small></div></div>}
  </main>
}
