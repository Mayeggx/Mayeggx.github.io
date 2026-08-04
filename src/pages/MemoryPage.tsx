import './MemoryPage.css'
import type { MemoryLog } from '../types'

const formatDate = (date: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${date}T00:00:00`))

export function MemoryPage({ memory }: { memory: MemoryLog | null }) {
  if (!memory) return <main className="memory-page container"><p className="memory-loading">正在载入生活记录…</p></main>
  return <main className="memory-page container">
    <header className="memory-intro"><p className="overline">LIFE LOG</p><h1>Memory</h1><p>把生活里值得停留的一点光、一次出走和偶然的心绪记下来。</p></header>
    <div className="memory-list">{memory.entries.map((entry, index) => <article className="memory-entry" key={`${entry.date}-${index}`}><time>{formatDate(entry.date)}</time><p>{entry.content}</p>{entry.images.length > 0 && <div className={`memory-images count-${Math.min(entry.images.length, 4)}`}>{entry.images.map((image, imageIndex) => <img key={`${image}-${imageIndex}`} src={image} alt={`生活记录 ${entry.date}`} loading="lazy" />)}</div>}</article>)}</div>
  </main>
}
