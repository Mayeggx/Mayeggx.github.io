import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import renderMathInElement from 'katex/contrib/auto-render'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'
import type { Post } from '../types'
import { formatDate } from '../lib/format'

export function ArticlePage({ post, anchor }: { post: Post; anchor?: string }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    body.querySelectorAll('pre code').forEach(node => { if (!node.classList.contains('language-mermaid')) hljs.highlightElement(node as HTMLElement) })
    const onArticleLink = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link || link.getAttribute('href') === '#') return
      event.preventDefault()
      const target = link.getAttribute('href')!.slice(1)
      location.hash = `#/post/${post.slug}#${encodeURIComponent(target)}`
    }
    body.addEventListener('click', onArticleLink)
    renderMathInElement(body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false,
      strict: false,
    })
    const diagrams: HTMLElement[] = []
    body.querySelectorAll('pre code.language-mermaid').forEach((node, index) => {
      const pre = node.parentElement
      if (!pre) return
      const diagram = document.createElement('div')
      diagram.className = 'mermaid'
      diagram.id = `diagram-${post.slug}-${index}`
      diagram.textContent = node.textContent
      pre.replaceWith(diagram)
      diagrams.push(diagram)
    })
    if (diagrams.length) { mermaid.initialize({ startOnLoad: false, theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral', securityLevel: 'loose' }); mermaid.run({ nodes: diagrams }).catch(() => diagrams.forEach(node => node.classList.add('mermaid-error'))) }
    return () => body.removeEventListener('click', onArticleLink)
  }, [post.slug])
  useEffect(() => {
    if (!anchor) return
    requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [anchor, post.slug])
  const toc = (post.toc || []).filter(item => item.depth <= 3)
  return <main className="article-shell"><div className={`article-layout ${tocCollapsed ? 'toc-is-collapsed' : ''}`}><aside className="article-toc" aria-label="Table of contents"><button className="toc-toggle" type="button" onClick={() => setTocCollapsed(value => !value)} aria-label={tocCollapsed ? 'Expand table of contents' : 'Collapse table of contents'} aria-expanded={!tocCollapsed}>{tocCollapsed ? '›' : '‹'}</button><div className="toc-content"><p>ON THIS PAGE</p>{toc.map(item => <a className={`toc-level-${item.depth}`} href={`#/post/${post.slug}#${encodeURIComponent(item.id)}`} key={item.id}>{item.text}</a>)}</div></aside><article className="article"><header className="article-title"><p className="overline">{post.categories[0] || 'NOTE'}</p><h1>{post.title}</h1><time>{formatDate(post.date)}</time></header><div className="article-body" ref={bodyRef} dangerouslySetInnerHTML={{ __html: post.html }} /><div className="article-footer"><a href="#/blog" className="back-link"><span>←</span> Back to blog</a><div>{post.tags.map(tag => <a className="tag" key={tag} href="#/tags">#{tag}</a>)}</div></div></article></div></main>
}
