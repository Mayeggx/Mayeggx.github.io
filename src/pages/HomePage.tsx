import type { Post } from '../types'
import { Icon } from '../components/Icon'
import { PostList } from '../components/PostList'
export function HomePage({ posts, query, onQueryChange }: { posts: Post[]; query: string; onQueryChange: (value: string) => void }) { return <main id="content" className="main container"><div className="section-heading"><div><p className="overline">RECENT NOTES</p><h2>Latest notes</h2></div><label className="search-box"><Icon name="search" /><input className="search-input" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Search notes" /></label></div><PostList posts={posts} /></main> }
