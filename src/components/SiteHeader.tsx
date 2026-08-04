import { useState, type ReactNode } from 'react'
import type { Post, View } from '../types'
import { Icon } from './Icon'

const links = [['#/', 'Home'], ['#/blog', 'Blog'], ['#/memory', 'Memory'], ['#/music', 'Music'], ['#/media', 'Media'], ['#/about', 'About']] as const

type Props = { view: View; post?: Post; dark: boolean; onThemeToggle: () => void; children?: ReactNode }

export function SiteHeader({ view, dark, onThemeToggle, children }: Props) {
  const [open, setOpen] = useState(false)
  const isActive = (href: string) => href === '#/' ? view.kind === 'home' : view.kind === href.slice(2)

  return <header className={view.kind === 'home' ? 'hero' : 'compact-header'}>
    <nav className="nav container-wide">
      <a href="#/" className="brand"><img src="/img/mayegg.png" alt="Mayegg avatar" /><span>Mayegg's Page</span></a>
      <div className={`nav-panel ${open ? 'is-open' : ''}`}>{links.map(([href, label]) => <a key={href} className={isActive(href) ? 'active' : ''} href={href} onClick={() => setOpen(false)}>{label}</a>)}</div>
      <div className="nav-actions"><button className="icon-button" aria-label="Search notes" onClick={() => { if (view.kind !== 'blog') location.hash = '#/blog'; setTimeout(() => document.querySelector<HTMLInputElement>('.search-input')?.focus(), 0) }}><Icon name="search" /></button><button className="icon-button" aria-label="Toggle color mode" onClick={onThemeToggle}><Icon name={dark ? 'sun' : 'moon'} /></button><button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setOpen(value => !value)}><Icon name={open ? 'close' : 'menu'} /></button></div>
    </nav>
    {view.kind === 'home' && children}
  </header>
}
