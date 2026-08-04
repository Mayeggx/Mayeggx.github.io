import { useMemo, useState } from 'react'
import './MusicPage.css'
import { Icon } from '../components/Icon'
import type { MusicLibrary, PracticeStatus, Song } from '../types'

const statuses: PracticeStatus[] = ['熟练掌握', '正在练习', '曾经熟悉', '准备练习']
const emptySongs: Song[] = []
const recentLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))
const releaseLabel = (date?: string) => date ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`)) : '发行日期未知'
const reviewTimeLabel = (value: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value))
const openSong = (song: Song) => { if (song.neteaseUrl) window.open(song.neteaseUrl, '_blank', 'noopener,noreferrer') }

function SongArtwork({ song, compact = false }: { song: Song; compact?: boolean }) {
  return <div className={`song-art song-art-${song.color} ${compact ? 'song-art-small' : ''}`} aria-hidden="true">
    {song.coverUrl && <img src={song.coverUrl} alt="" loading="lazy" />}
    <span>{song.tags?.[0] || '未标记'}</span>
    <Icon name="music" />
  </div>
}

function SongCard({ song }: { song: Song }) {
  return <article className="song-card">
    <SongArtwork song={song} />
    <div className="song-card-copy">
      <div className="song-tags" aria-label="歌曲标签">{song.tags?.map(tag => <span key={tag}>#{tag}</span>)}</div>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
      <small className="song-album">{song.album || '专辑信息未知'}</small>
      <div className="song-meta"><span>{releaseLabel(song.releaseDate)}</span><span>收藏于 {recentLabel(song.addedAt)}</span></div>
    </div>
    {song.neteaseUrl && <a className="netease-link" href={song.neteaseUrl} target="_blank" rel="noreferrer" aria-label={`在网易云音乐打开 ${song.title}`}><Icon name="play" /></a>}
  </article>
}

export function MusicPage({ library }: { library: MusicLibrary | null }) {
  const [activeTag, setActiveTag] = useState('全部')
  const [activeStatus, setActiveStatus] = useState<PracticeStatus | '全部'>('全部')
  const songs = library?.songs ?? emptySongs
  const tags = useMemo(() => [...new Set(songs.flatMap(song => song.tags ?? []))], [songs])
  const visibleSongs = useMemo(() => songs.filter(song => {
    const matchesTag = activeTag === '全部' || song.tags?.includes(activeTag)
    const matchesStatus = activeStatus === '全部' || song.practiceStatus === activeStatus
    return matchesTag && matchesStatus
  }), [activeStatus, activeTag, songs])
  const songById = useMemo(() => new Map(songs.map(song => [song.id, song])), [songs])
  if (!library) return <main className="music-page container"><div className="music-loading">正在载入音乐库…</div></main>

  return <main className="music-page container">
    <section className="music-intro">
      <div><p className="eyebrow">MY MUSIC LOG · {library.updatedAt}</p><h1>我的音乐</h1><p>歌曲由 Markdown 清单构建，并在构建时补全网易云的专辑、发行日期、封面与跳转链接。</p></div>
      <div className="music-count"><Icon name="headphones" /><strong>{songs.length}</strong><span>首收藏曲目</span></div>
    </section>
    <p className="source-note">数据来源：<code>posts/music.md</code>、<code>posts/music-review.md</code> · 元数据由 <a href="https://neteasecloudmusicapienhanced.js.org/#/" target="_blank" rel="noreferrer">网易云音乐 API Enhanced</a> 在构建时解析。</p>

    <section className="music-section collection-section">
      <div className="music-section-heading">
        <div><p className="eyebrow">MY COLLECTION</p><h2>收藏的歌曲</h2></div>
        <p className="section-note">{visibleSongs.length === songs.length ? `共 ${songs.length} 首` : `显示 ${visibleSongs.length} / ${songs.length} 首`}</p>
      </div>
      <div className="music-filter-panel" aria-label="歌曲筛选">
        <section className="filter-group" aria-label="按歌曲分类筛选">
          <p>歌曲标签</p>
          <div className="music-filters"><button className={activeTag === '全部' ? 'is-active' : ''} onClick={() => setActiveTag('全部')}>全部</button>{tags.map(tag => <button key={tag} className={activeTag === tag ? 'is-active' : ''} onClick={() => setActiveTag(tag)}>{tag}</button>)}</div>
        </section>
        <section className="filter-group" aria-label="按熟练程度筛选">
          <p>熟练程度</p>
          <div className="music-filters"><button className={activeStatus === '全部' ? 'is-active' : ''} onClick={() => setActiveStatus('全部')}>全部</button>{statuses.map(status => <button key={status} className={activeStatus === status ? 'is-active' : ''} onClick={() => setActiveStatus(status)}>{status}</button>)}</div>
        </section>
      </div>
      {visibleSongs.length ? <div className="song-grid">{visibleSongs.map(song => <SongCard key={song.id} song={song} />)}</div> : <p className="music-empty">没有符合当前筛选条件的收藏歌曲。</p>}
    </section>

    <section className="music-section thoughts-section">
      <div className="music-section-heading"><div><p className="eyebrow">LISTENING NOTES</p><h2>最近的音乐感想</h2></div></div>
      <div className="thought-list">{library.reviews.map((review, index) => {
        const song = songById.get(review.songId)
        if (!song) return null
        return <article className="thought-card" key={`${review.songId}-${review.createdAt}-${index}`}><div className="thought-meta"><time dateTime={review.createdAt}>{reviewTimeLabel(review.createdAt)}</time></div><p>“{review.content}”</p><button className={`thought-song ${song.neteaseUrl ? 'is-link' : ''}`} onClick={() => openSong(song)}><SongArtwork song={song} compact /><span><b>{song.title}</b><small>{song.artist}</small></span>{song.neteaseUrl && <Icon name="play" />}</button></article>
      })}</div>
    </section>
  </main>
}
