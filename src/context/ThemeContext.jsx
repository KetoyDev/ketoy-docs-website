import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

export const DEFAULT_ACCENT = '#2563eb'
export const DEFAULT_PATTERN = 'arches'
export const DEFAULT_PATTERN_OPACITY = 0.18
export const MAX_PATTERN_OPACITY = 0.6

export const COLOR_PRESETS = [
  '#2563eb', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a78bfa', '#06B6D4', '#10B981', '#22C55E',
  '#F59E0B', '#F97316', '#EF4444', '#EC4899',
]

const STORAGE_KEY = 'ketoy-docs-customization'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  const lr = Math.min(255, r + Math.round((255 - r) * amount))
  const lg = Math.min(255, g + Math.round((255 - g) * amount))
  const lb = Math.min(255, b + Math.round((255 - b) * amount))
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`
}

function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  const dr = Math.max(0, Math.round(r * (1 - amount)))
  const dg = Math.max(0, Math.round(g * (1 - amount)))
  const db = Math.max(0, Math.round(b * (1 - amount)))
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`
}

function applyAccentCSS(hex, themeMode) {
  const root = document.documentElement
  const { r, g, b } = hexToRgb(hex)

  if (themeMode === 'dark') {
    const lightVariant = lighten(hex, 0.25)
    root.style.setProperty('--accent', hex)
    root.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`)
    root.style.setProperty('--accent-dark', darken(hex, 0.15))
    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hex}, ${lightVariant})`)
    root.style.setProperty('--text-link', lightVariant)
    root.style.setProperty('--text-link-hover', lighten(hex, 0.4))
    root.style.setProperty('--bg-hover', `rgba(${r}, ${g}, ${b}, 0.10)`)
    root.style.setProperty('--bg-active', `rgba(${r}, ${g}, ${b}, 0.15)`)
    root.style.setProperty('--bg-badge', `rgba(${r}, ${g}, ${b}, 0.12)`)
  } else {
    root.style.setProperty('--accent', hex)
    root.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.08)`)
    root.style.setProperty('--accent-dark', darken(hex, 0.15))
    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hex}, ${lighten(hex, 0.2)})`)
    root.style.setProperty('--text-link', hex)
    root.style.setProperty('--text-link-hover', darken(hex, 0.12))
    root.style.setProperty('--bg-hover', `rgba(${r}, ${g}, ${b}, 0.07)`)
    root.style.setProperty('--bg-active', `rgba(${r}, ${g}, ${b}, 0.12)`)
    root.style.setProperty('--bg-badge', `rgba(${r}, ${g}, ${b}, 0.08)`)
  }
}

function clearAccentCSS() {
  const root = document.documentElement
  const props = ['--accent', '--accent-light', '--accent-dark', '--accent-gradient',
    '--text-link', '--text-link-hover', '--bg-hover', '--bg-active', '--bg-badge']
  props.forEach(p => root.style.removeProperty(p))
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function ThemeProvider({ children }) {
  const saved = loadSaved()

  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem('ketoy-docs-theme')
      if (t === 'light' || t === 'dark') return t
    } catch {}
    return 'dark'
  })

  const [accentColor, setAccentColorState] = useState(saved?.accentColor || DEFAULT_ACCENT)
  const [pattern, setPatternState] = useState(saved?.pattern || DEFAULT_PATTERN)
  const [patternOpacity, setPatternOpacityState] = useState(saved?.opacity ?? DEFAULT_PATTERN_OPACITY)

  const persist = useCallback((accent, pat, opacity) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accentColor: accent, pattern: pat, opacity }))
    } catch {}
  }, [])

  const setAccentColor = useCallback((color) => {
    setAccentColorState(color)
    persist(color, pattern, patternOpacity)
  }, [pattern, patternOpacity, persist])

  const setPattern = useCallback((pat) => {
    setPatternState(pat)
    persist(accentColor, pat, patternOpacity)
  }, [accentColor, patternOpacity, persist])

  const setPatternOpacity = useCallback((opacity) => {
    setPatternOpacityState(opacity)
    persist(accentColor, pattern, opacity)
  }, [accentColor, pattern, persist])

  const resetCustomization = useCallback(() => {
    setAccentColorState(DEFAULT_ACCENT)
    setPatternState(DEFAULT_PATTERN)
    setPatternOpacityState(DEFAULT_PATTERN_OPACITY)
    clearAccentCSS()
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('ketoy-docs-theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    if (accentColor === DEFAULT_ACCENT) {
      clearAccentCSS()
    } else {
      applyAccentCSS(accentColor, theme)
    }
  }, [accentColor, theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{
      theme, toggle,
      accentColor, setAccentColor,
      pattern, setPattern,
      patternOpacity, setPatternOpacity,
      resetCustomization,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
