import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { ArticlePage } from './pages/ArticlePage'
import { ArchivePage, AboutPage, CollectionPage, EmptyPage } from './pages/StaticPages'
import { MusicPage } from './pages/MusicPage'
import type { MusicLibrary, Post, View } from './types'

const parseHash = (): View => {
  const [kind, rawSlug] = (location.hash.replace(/^#\/?/, '') || 'home').split('/')
  const [rawValue, rawAnchor] = rawSlug?.split('#') || []
  const slug = rawValue ? decodeURIComponent(rawValue) : undefined
  return { kind: kind as View['kind'], slug, anchor: rawAnchor ? decodeURIComponent(rawAnchor) : undefined }
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [music, setMusic] = useState<MusicLibrary | null>(null)
  const [view, setView] = useState<View>(parseHash())
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === '1')
  const [query, setQuery] = useState('')

  useEffect(() => { fetch('/content/posts.json').then(res => res.json()).then(setPosts).catch(() => setPosts([])) }, [])
  useEffect(() => { fetch('/content/music.json').then(res => res.json()).then(setMusic).catch(() => setMusic(null)) }, [])
  useEffect(() => { const onHash = () => { setView(parseHash()); window.scrollTo({ top: 0, behavior: 'smooth' }) }; addEventListener('hashchange', onHash); return () => removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('dark', dark ? '1' : '0') }, [dark])

  const categories = useMemo(() => [...new Set(posts.flatMap(post => post.categories))], [posts])
  const tags = useMemo(() => [...new Set(posts.flatMap(post => post.tags))], [posts])
  const current = posts.find(post => post.slug === view.slug)
  const filtered = posts.filter(post => `${post.title} ${post.excerpt} ${post.categories.join(' ')}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="site">
    <SiteHeader view={view} post={current} dark={dark} onThemeToggle={() => setDark(value => !value)} />
    {view.kind === 'home' && <HomePage posts={filtered} query={query} onQueryChange={setQuery} />}
    {view.kind === 'post' && current && <ArticlePage post={current} anchor={view.anchor} />}
    {view.kind === 'post' && !current && <EmptyPage />}
    {view.kind === 'categories' && <CollectionPage title="Categories" subtitle="Browse notes by subject." items={categories} posts={posts} type="category" activeItem={view.slug} />}
    {view.kind === 'tags' && <CollectionPage title="Tags" subtitle="Start exploring from a keyword." items={tags} posts={posts} type="tag" activeItem={view.slug} />}
    {view.kind === 'archives' && <ArchivePage posts={posts} />}
    {view.kind === 'about' && <AboutPage />}
    {view.kind === 'music' && <MusicPage library={music} />}
    <footer><div className="container footer-inner"><span>© {new Date().getFullYear()} Mayegg's Blog</span><span>Built with React · Vite · Markdown</span></div></footer>
  </div>
}
