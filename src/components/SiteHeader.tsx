import { useState } from 'react'
import type { Post, View } from '../types'
import { Icon } from './Icon'

const links = [['#/', 'Home'], ['#/music', 'Music'], ['#/categories', 'Categories'], ['#/archives', 'Archive'], ['#/about', 'About']] as const
export function SiteHeader({ view, dark, onThemeToggle }: { view: View; post?: Post; dark: boolean; onThemeToggle: () => void }) {
  const [open, setOpen] = useState(false)
  return <header className={view.kind === 'home' ? 'hero' : 'compact-header'}><nav className="nav container-wide"><a href="#/" className="brand"><img src="/img/mayegg.png" alt="Mayegg avatar" /><span>Mayegg's Blog</span></a><div className={`nav-panel ${open ? 'is-open' : ''}`}>{links.map(([href, label]) => <a key={href} className={view.kind === (href === '#/' ? 'home' : href.slice(2)) ? 'active' : ''} href={href}>{label}</a>)}</div><div className="nav-actions"><button className="icon-button" aria-label="Search posts" onClick={() => document.querySelector<HTMLInputElement>('.search-input')?.focus()}><Icon name="search" /></button><button className="icon-button" aria-label="Toggle color mode" onClick={onThemeToggle}><Icon name={dark ? 'sun' : 'moon'} /></button><button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setOpen(value => !value)}><Icon name={open ? 'close' : 'menu'} /></button></div></nav>{view.kind === 'home' && <div className="hero-content container-wide"><p className="hero-kicker">WELCOME TO MAYEGG'S CORNER</p><h1>Wander through<br /><i>ideas and notes.</i></h1><p className="hero-subtitle">Small, deliberate discoveries in programming, math, language, and everyday life.</p><a className="scroll-cue" href="#content">Start reading <span>↓</span></a></div>}</header>
}
