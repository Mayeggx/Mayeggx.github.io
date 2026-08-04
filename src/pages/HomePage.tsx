import './HomePage.css'
import type { MemoryLog, MusicLibrary, Post } from '../types'
import { formatDate } from '../lib/format'
import { Icon } from '../components/Icon'

type Props = { posts: Post[]; music: MusicLibrary | null; memory: MemoryLog | null }

const sortNewest = <T extends { date?: string; addedAt?: string }>(items: T[]) => [...items].sort((a, b) => new Date(b.date || b.addedAt || 0).getTime() - new Date(a.date || a.addedAt || 0).getTime())
const dateText = (date: string) => new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))

export function HomePage({ posts, music, memory }: Props) {
  const latestPosts = sortNewest(posts).slice(0, 3)
  const latestMemory = sortNewest(memory?.entries || []).slice(0, 2)
  const latestSongs = sortNewest(music?.songs || []).slice(0, 3)

  return <main id="content" className="home-page">
    <section className="home-grid" aria-label="Recent updates">
      <article className="home-panel latest-notes"><div className="home-panel-heading"><div><p className="home-label">BLOG</p><h3>Latest notes</h3></div><a href="#/blog">View all <Icon name="arrow" /></a></div><div className="home-note-list">{latestPosts.map(post => <a href={`#/post/${post.slug}`} className="home-note" key={post.slug}><time>{formatDate(post.date, true)}</time><span><b>{post.title}</b><small>{post.excerpt}</small></span><Icon name="arrow" /></a>)}{latestPosts.length === 0 && <p className="home-empty">Notes are on their way.</p>}</div></article>
      <article className="home-panel memory-preview"><div className="home-panel-heading"><div><p className="home-label">MEMORY</p><h3>Recent moments</h3></div><a href="#/memory">Open memory <Icon name="arrow" /></a></div><div className="home-memory-list">{latestMemory.map((entry, index) => <div className="home-memory" key={`${entry.date}-${index}`}><time>{dateText(entry.date)}</time><p>{entry.content}</p></div>)}{latestMemory.length === 0 && <p className="home-empty">A quiet space for future moments.</p>}</div></article>
      <article className="home-panel music-preview"><div className="home-panel-heading"><div><p className="home-label">MUSIC</p><h3>Recently added</h3></div><a href="#/music">Open library <Icon name="arrow" /></a></div><div className="home-song-list">{latestSongs.map(song => <a className="home-song" href={song.neteaseUrl || '#/music'} target={song.neteaseUrl ? '_blank' : undefined} rel={song.neteaseUrl ? 'noreferrer' : undefined} key={song.id}><span className={`home-song-art song-art-${song.color}`}>{song.coverUrl && <img src={song.coverUrl} alt="" loading="lazy" />}</span><span><b>{song.title}</b><small>{song.artist}</small></span><time>{dateText(song.addedAt)}</time></a>)}{latestSongs.length === 0 && <p className="home-empty">The music shelf is loading.</p>}</div></article>
    </section>
  </main>
}
