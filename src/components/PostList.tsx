import type { CSSProperties } from 'react'
import type { Post } from '../types'
import { formatDate } from '../lib/format'
import { Icon } from './Icon'
export function PostList({ posts }: { posts: Post[] }) { return <div className="post-list">{posts.map((post, index) => <article className="post-card" key={post.slug} style={{ '--delay': `${index * 40}ms` } as CSSProperties}><div className="post-date"><span>{new Date(post.date).getFullYear()}</span><strong>{formatDate(post.date, true)}</strong></div><div className="post-body"><div className="post-label">{post.categories[0] || 'Unsorted'}</div><h3><a href={`#/post/${post.slug}`}>{post.title}</a></h3><p>{post.excerpt}</p><a className="read-link" href={`#/post/${post.slug}`}>Read note <Icon name="arrow" /></a></div></article>)}{posts.length === 0 && <p className="no-results">No matching notes found.</p>}</div> }
