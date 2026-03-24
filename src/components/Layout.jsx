import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import PatternBackground from './PatternBackground'
import ThemeCustomizer from './ThemeCustomizer'
import Footer from './Footer'
import Search from './Search'
import navigation from '../data/navigation'
import './Layout.css'

/* ── Chevron SVG ── */
function Chevron({ open, className = '' }) {
  return (
    <svg
      className={`nav-chevron ${open ? 'nav-chevron--open' : ''} ${className}`}
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/* ── Header ── */
function Header({ onMenuToggle, menuOpen }) {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const [stars, setStars] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/KetoyDev/ketoy')
      .then(res => res.json())
      .then(data => { if (data.stargazers_count) setStars(data.stargazers_count) })
      .catch(() => {})
  }, [])

  const isReferenceActive = location.pathname.startsWith('/reference') || location.pathname === '/'
  const isDocsActive = location.pathname.startsWith('/docs')

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            }
          </svg>
        </button>
        <NavLink to="/" className="header__logo">
          <img src="/ketoy-logo.svg" alt="Ketoy" width="28" height="28" style={{ borderRadius: 6 }} />
          <span className="header__title">Ketoy Docs</span>
        </NavLink>
      </div>

      <nav className="header__nav">
        <NavLink to="/docs" className={`header__nav-link ${isDocsActive ? 'header__nav-link--active' : ''}`}>
          Docs
        </NavLink>
        <NavLink to="/" className={`header__nav-link ${isReferenceActive ? 'header__nav-link--active' : ''}`}>
          Reference
        </NavLink>
      </nav>

      <div className="header__search">
        <Search />
      </div>

      <div className="header__right">
        <span className="badge">v0.1.4-beta</span>
        <a
          href="https://github.com/KetoyDev/ketoy"
          target="_blank"
          rel="noopener noreferrer"
          className="header__github-btn"
          aria-label="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {stars !== null && (
            <span className="header__github-stars">{stars.toLocaleString()}</span>
          )}
        </a>
        <ThemeCustomizer />
        <button className="header__icon-btn" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════
 *  Sidebar – Android-docs-style tree navigation
 * ══════════════════════════════════════════════════════ */

/** Recursively collect all leaf paths from a nav item */
function collectPaths(item) {
  if (item.path) return [item.path]
  if (item.children) return item.children.flatMap(collectPaths)
  return []
}

/** Build initial expanded keys from current URL */
function buildExpandedKeys(items, pathname, prefix = '') {
  const keys = new Set()
  for (const item of items) {
    if (item.type !== 'section') continue
    const key = prefix ? `${prefix}/${item.label}` : item.label
    const paths = collectPaths(item)
    if (paths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
      keys.add(key)
      if (item.children) {
        const childKeys = buildExpandedKeys(item.children, pathname, key)
        childKeys.forEach(k => keys.add(k))
      }
    }
  }
  return keys
}

function Sidebar({ open, onClose }) {
  const location = useLocation()

  // All sections start collapsed; only expand to show active page
  const [expanded, setExpanded] = useState(() =>
    buildExpandedKeys(navigation, location.pathname)
  )

  // When route changes, expand to show the new active page
  useEffect(() => {
    setExpanded(prev => {
      const needed = buildExpandedKeys(navigation, location.pathname)
      if (needed.size === 0) return prev
      const next = new Set(prev)
      needed.forEach(k => next.add(k))
      return next
    })
  }, [location.pathname])

  // Close mobile sidebar on navigation
  useEffect(() => { onClose() }, [location.pathname])

  const toggle = (key) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  /** Render a tree of nav items at a given depth */
  const renderItems = (items, depth = 0, parentKey = '') => {
    return items.map((item, idx) => {
      // ── Divider ──
      if (item.type === 'divider') {
        return <div className="nav-divider" key={`div-${idx}`} />
      }

      // ── Static header ──
      if (item.type === 'header') {
        return (
          <div className="nav-header" key={item.label}>
            {item.label}
          </div>
        )
      }

      // ── Top-level link ──
      if (item.type === 'link') {
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/' || item.path === '/reference'}
            className={({ isActive }) =>
              `nav-link nav-link--depth-${depth} ${isActive ? 'nav-link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        )
      }

      // ── Collapsible section ──
      if (item.type === 'section') {
        const key = parentKey ? `${parentKey}/${item.label}` : item.label
        const isOpen = expanded.has(key)

        // Separate sub-sections from leaf links
        const subSections = (item.children || []).filter(c => c.type === 'section')
        const leafLinks = (item.children || []).filter(c => !c.type || c.type === 'link' || c.path)

        return (
          <div className="nav-section" key={key}>
            <button
              className={`nav-section__toggle nav-section__toggle--depth-${depth}`}
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
            >
              <Chevron open={isOpen} />
              <span className="nav-section__label">{item.label}</span>
            </button>
            {isOpen && (
              <div className="nav-section__children">
                {/* Leaf links */}
                {leafLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `nav-link nav-link--depth-${depth + 1} ${isActive ? 'nav-link--active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {/* Nested sub-sections */}
                {subSections.length > 0 && renderItems(subSections, depth + 1, key)}
              </div>
            )}
          </div>
        )
      }

      return null
    })
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <nav className="sidebar__nav">
          {renderItems(navigation)}
        </nav>
      </aside>
    </>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ThemeProvider>
      <div className="layout">
        <PatternBackground />
        <Header
          onMenuToggle={() => setMenuOpen(v => !v)}
          menuOpen={menuOpen}
        />
        <div className="layout__body">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          <main className="layout__main">
            <div className="layout__content">
              <Outlet />
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
