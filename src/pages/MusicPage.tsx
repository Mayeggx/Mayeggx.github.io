import { useMemo, useState } from 'react'
import './MusicPage.css'
import { Icon } from '../components/Icon'
import type { MusicCategory, MusicLibrary, PracticeStatus, Song } from '../types'

const categories: Array<MusicCategory | '全部'> = ['全部', 'J-Pop', 'Anisong', '术力口', '二偶']
const statuses: PracticeStatus[] = ['熟练掌握', '正在练习', '曾经熟悉', '准备练习']
const emptySongs: Song[] = []
const recentLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))
const releaseLabel = (date?: string) => date ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`)) : '发行日期未知'
const openSong = (song: Song) => { if (song.neteaseUrl) window.open(song.neteaseUrl, '_blank', 'noopener,noreferrer') }

function SongArtwork({ song, compact = false }: { song: Song; compact?: boolean }) {
  return <div className={`song-art song-art-${song.color} ${compact ? 'song-art-small' : ''}`} aria-hidden="true">{song.coverUrl && <img src={song.coverUrl} alt="" loading="lazy" />}<span>{song.category}</span><Icon name="music" /></div>
}

export function MusicPage({ library }: { library: MusicLibrary | null }) {
  const [activeCategory, setActiveCategory] = useState<MusicCategory | '全部'>('全部')
  const songs = library?.songs ?? emptySongs
  const visibleSongs = useMemo(() => activeCategory === '全部' ? songs : songs.filter(song => song.category === activeCategory), [activeCategory, songs])
  const songById = useMemo(() => new Map(songs.map(song => [song.id, song])), [songs])
  if (!library) return <main className="music-page container"><div className="music-loading">正在载入音乐库…</div></main>

  return <main className="music-page container">
    <section className="music-intro"><div><p className="eyebrow">MY MUSIC LOG · {library.updatedAt}</p><h1>我的音乐</h1><p>歌曲由 Markdown 清单构建，并在构建时补全网易云的专辑、发行日期、封面与跳转链接。</p></div><div className="music-count"><Icon name="headphones" /><strong>{songs.length}</strong><span>首收藏曲目</span></div></section>
    <p className="source-note">数据来源：<code>posts/music.md</code> · 元数据由 <a href="https://neteasecloudmusicapienhanced.js.org/#/" target="_blank" rel="noreferrer">网易云音乐 API Enhanced</a> 在构建时解析。</p>

    <section className="music-section recent-section"><div className="music-section-heading"><div><p className="eyebrow">RECENT FAVOURITES</p><h2>最近喜欢听的歌</h2></div><div className="music-filters" aria-label="按分类筛选">{categories.map(category => <button key={category} className={activeCategory === category ? 'is-active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div><div className="song-grid">{visibleSongs.map(song => <article className="song-card" key={song.id}><SongArtwork song={song} /><div className="song-card-copy"><span className="song-category">{song.category}</span><h3>{song.title}</h3><p>{song.artist}</p><small className="song-album">{song.album || '专辑信息未知'}</small><div className="song-meta"><span>{releaseLabel(song.releaseDate)}</span><span>收藏于 {recentLabel(song.addedAt)}</span></div></div>{song.neteaseUrl && <a className="netease-link" href={song.neteaseUrl} target="_blank" rel="noreferrer" aria-label={`在网易云音乐打开 ${song.title}`}><Icon name="play" /></a>}</article>)}</div></section>

    <section className="music-section practice-section"><div className="music-section-heading"><div><p className="eyebrow">PRACTICE SHELF</p><h2>歌曲练习情况</h2></div><p className="section-note">每首歌都在自己的时间里慢慢长熟。</p></div><div className="practice-grid">{statuses.map(status => { const statusSongs = songs.filter(song => song.practiceStatus === status); return <section className="practice-column" key={status}><header><h3>{status}</h3><span>{String(statusSongs.length).padStart(2, '0')}</span></header><div>{statusSongs.map(song => <button className={`practice-song ${song.neteaseUrl ? 'is-link' : ''}`} key={song.id} onClick={() => openSong(song)}><SongArtwork song={song} compact /><span><b>{song.title}</b><small>{song.artist}</small></span>{song.neteaseUrl ? <Icon name="play" /> : <span className="external-mark">—</span>}</button>)}</div></section> })}</div></section>

    <section className="music-section thoughts-section"><div className="music-section-heading"><div><p className="eyebrow">LISTENING NOTES</p><h2>最近的音乐感想</h2></div></div><div className="thought-list">{library.thoughts.map(thought => { const song = songById.get(thought.songId); if (!song) return null; return <article className="thought-card" key={thought.id}><div className="thought-meta"><time>{thought.date}</time><span>{thought.mood}</span></div><p>“{thought.content}”</p><button className={`thought-song ${song.neteaseUrl ? 'is-link' : ''}`} onClick={() => openSong(song)}><SongArtwork song={song} compact /><span><b>{song.title}</b><small>{song.artist}</small></span>{song.neteaseUrl && <Icon name="play" />}</button></article> })}</div></section>
  </main>
}
