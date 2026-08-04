import type { BlogSection, Post } from '../types'
import { formatDate } from '../lib/format'
import { Icon } from '../components/Icon'
import { PostList } from '../components/PostList'
import './BlogPage.css'

type Props = {
  posts: Post[]
  allPosts: Post[]
  categories: string[]
  section: BlogSection
  activeCategory?: string
  query: string
  onQueryChange: (value: string) => void
}

const sectionCopy: Record<BlogSection, { eyebrow: string; title: string; subtitle: string }> = {
  posts: { eyebrow: 'BLOG', title: 'Notes', subtitle: 'Ideas, learning notes, and useful things worth returning to.' },
  categories: { eyebrow: 'BLOG / CATEGORIES', title: 'Categories', subtitle: 'Browse every note from a starting point.' },
  archives: { eyebrow: 'BLOG / ARCHIVE', title: 'Archive', subtitle: 'Every note, in chronological order.' },
}

function BlogSidebar({ section }: { section: BlogSection }) {
  const links: Array<[BlogSection, string, string]> = [['posts', 'All notes', '#/blog'], ['categories', 'Categories', '#/blog/categories'], ['archives', 'Archive', '#/blog/archives']]
  return <aside className="blog-sidebar" aria-label="Blog navigation"><p>EXPLORE BLOG</p><nav>{links.map(([key, label, href]) => <a className={section === key ? 'is-active' : ''} href={href} key={key}><span>{label}</span><b>→</b></a>)}</nav></aside>
}

function CategoryView({ categories, allPosts, activeCategory }: Pick<Props, 'categories' | 'allPosts' | 'activeCategory'>) {
  const matchingPosts = activeCategory ? allPosts.filter(post => post.categories.includes(activeCategory)) : []
  if (activeCategory) return <><div className="category-result-heading"><a href="#/blog/categories">← All categories</a><h2>{activeCategory}</h2><p>{matchingPosts.length} notes in this category.</p></div><PostList posts={matchingPosts} /></>
  return <div className="topic-grid">{categories.map(category => {
    const count = allPosts.filter(post => post.categories.includes(category)).length
    return <a href={`#/blog/categories/${encodeURIComponent(category)}`} className="topic-card" key={category}><span>◌</span><strong>{category}</strong><small>{count} notes <b>→</b></small></a>
  })}</div>
}

function ArchiveView({ allPosts }: Pick<Props, 'allPosts'>) {
  const years = [...new Set(allPosts.map(post => new Date(post.date).getFullYear()))]
  return <div className="archive">{years.map(year => <section className="year-group" key={year}><h3>{year}</h3><div>{allPosts.filter(post => new Date(post.date).getFullYear() === year).map(post => <a className="archive-row" href={`#/post/${post.slug}`} key={post.slug}><time>{formatDate(post.date, true)}</time><span>{post.title}</span><small>{post.categories[0]}</small><b>↗</b></a>)}</div></section>)}</div>
}

export function BlogPage({ posts, allPosts, categories, section, activeCategory, query, onQueryChange }: Props) {
  const copy = sectionCopy[section]
  return <main className="blog-page container">
    <BlogSidebar section={section} />
    <div className="blog-content">
      <header className="blog-title"><p className="overline">{copy.eyebrow}</p><h1>{activeCategory || copy.title}</h1><p>{activeCategory ? 'A focused collection of related notes.' : copy.subtitle}</p></header>
      {section === 'posts' && <><div className="blog-toolbar"><span>{allPosts.length} notes</span><label className="search-box"><Icon name="search" /><input className="search-input" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Search notes" /></label></div><PostList posts={posts} /></>}
      {section === 'categories' && <CategoryView categories={categories} allPosts={allPosts} activeCategory={activeCategory} />}
      {section === 'archives' && <ArchiveView allPosts={allPosts} />}
    </div>
  </main>
}
