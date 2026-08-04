import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { BlogPage } from './pages/BlogPage'
import { ArticlePage } from './pages/ArticlePage'
import { AboutPage, CollectionPage, EmptyPage } from './pages/StaticPages'
import { MusicPage } from './pages/MusicPage'
import { MediaPage } from './pages/MediaPage'
import { MemoryPage } from './pages/MemoryPage'
import type { BlogSection, MemoryLog, MusicLibrary, Post, View } from './types'

const blogSections: BlogSection[] = ['posts', 'categories', 'archives']

const parseHash = (): View => {
  if (location.hash === '#content') return { kind: 'home' }
  const [route = 'home', ...segments] = (location.hash.replace(/^#\/?/, '') || 'home').split('/')
  const values = segments.map(value => decodeURIComponent(value))

  if (route === 'blog') {
    const section = blogSections.includes(values[0] as BlogSection) ? values[0] as BlogSection : 'posts'
    return { kind: 'blog', section, slug: section === 'categories' ? values[1] : undefined }
  }
  if (route === 'categories') return { kind: 'blog', section: 'categories', slug: values[0] }
  if (route === 'archives') return { kind: 'blog', section: 'archives' }

  const [slugWithAnchor = ''] = values
  const [slug, anchor] = slugWithAnchor.split('#')
  return { kind: route as View['kind'], slug: slug || undefined, anchor: anchor || undefined }
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [music, setMusic] = useState<MusicLibrary | null>(null)
  const [memory, setMemory] = useState<MemoryLog | null>(null)
  const [view, setView] = useState<View>(parseHash())
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === '1')
  const [query, setQuery] = useState('')

  useEffect(() => { fetch('/content/posts.json').then(res => res.json()).then(setPosts).catch(() => setPosts([])) }, [])
  useEffect(() => { fetch('/content/music.json').then(res => res.json()).then(setMusic).catch(() => setMusic(null)) }, [])
  useEffect(() => { fetch('/content/memory.json').then(res => res.json()).then(setMemory).catch(() => setMemory(null)) }, [])
  useEffect(() => { const onHash = () => { setView(parseHash()); window.scrollTo({ top: 0, behavior: 'smooth' }) }; addEventListener('hashchange', onHash); return () => removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('dark', dark ? '1' : '0') }, [dark])

  const categories = useMemo(() => [...new Set(posts.flatMap(post => post.categories))], [posts])
  const tags = useMemo(() => [...new Set(posts.flatMap(post => post.tags))], [posts])
  const current = posts.find(post => post.slug === view.slug)
  const filtered = posts.filter(post => `${post.title} ${post.excerpt} ${post.categories.join(' ')}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="site">
    <SiteHeader view={view} post={current} dark={dark} onThemeToggle={() => setDark(value => !value)}>{view.kind === 'home' && <HomePage posts={posts} music={music} memory={memory} />}</SiteHeader>
    {view.kind === 'blog' && <BlogPage posts={filtered} allPosts={posts} categories={categories} section={view.section || 'posts'} activeCategory={view.slug} query={query} onQueryChange={setQuery} />}
    {view.kind === 'post' && current && <ArticlePage post={current} anchor={view.anchor} />}
    {view.kind === 'post' && !current && <EmptyPage />}
    {view.kind === 'tags' && <CollectionPage title="Tags" subtitle="Start exploring from a keyword." items={tags} posts={posts} type="tag" activeItem={view.slug} />}
    {view.kind === 'about' && <AboutPage />}
    {view.kind === 'music' && <MusicPage library={music} />}
    {view.kind === 'memory' && <MemoryPage memory={memory} />}
    {view.kind === 'media' && <MediaPage />}
    {view.kind !== 'media' && <footer><div className="container footer-inner"><span>© {new Date().getFullYear()} Mayegg's Page</span><span>Built with React · Vite · Markdown</span></div></footer>}
  </div>
}
