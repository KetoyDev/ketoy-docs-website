import { useState, useRef, useEffect } from 'react'
import { useTheme, DEFAULT_ACCENT, COLOR_PRESETS, MAX_PATTERN_OPACITY } from '../context/ThemeContext'
import { patternList } from './PatternBackground'
import { FaPalette, FaTimes, FaUndo } from 'react-icons/fa'
import './ThemeCustomizer.css'

/* ── Pattern mini-preview SVGs for thumbnails ── */
const patternThumbs = {
  none: () => null,
  minimal: (c) => <><rect x="11" y="2" width="4" height="14" rx="1.5" fill={c} /><rect x="2" y="8" width="14" height="3" rx="1.5" fill={c} /></>,
  dots: (c) => <><circle cx="7" cy="7" r="2" fill={c} /><circle cx="17" cy="7" r="2" fill={c} /><circle cx="7" cy="17" r="2" fill={c} /><circle cx="17" cy="17" r="2" fill={c} /><circle cx="12" cy="12" r="2" fill={c} /></>,
  grid: (c) => <><line x1="8" y1="0" x2="8" y2="24" stroke={c} strokeWidth="0.8" /><line x1="16" y1="0" x2="16" y2="24" stroke={c} strokeWidth="0.8" /><line x1="0" y1="8" x2="24" y2="8" stroke={c} strokeWidth="0.8" /><line x1="0" y1="16" x2="24" y2="16" stroke={c} strokeWidth="0.8" /></>,
  waves: (c) => <><path d="M0 8 Q6 2 12 8 Q18 14 24 8" fill="none" stroke={c} strokeWidth="1.2" /><path d="M0 16 Q6 10 12 16 Q18 22 24 16" fill="none" stroke={c} strokeWidth="1.2" /></>,
  diagonal: (c) => <><line x1="0" y1="8" x2="8" y2="0" stroke={c} strokeWidth="1" /><line x1="0" y1="16" x2="16" y2="0" stroke={c} strokeWidth="1" /><line x1="0" y1="24" x2="24" y2="0" stroke={c} strokeWidth="1" /><line x1="8" y1="24" x2="24" y2="8" stroke={c} strokeWidth="1" /><line x1="16" y1="24" x2="24" y2="16" stroke={c} strokeWidth="1" /></>,
  hexagons: (c) => <path d="M12 2 L20 6 L20 14 L12 18 L4 14 L4 6 Z" fill="none" stroke={c} strokeWidth="1" />,
  arches: (c) => <><path d="M0 20 A10 10 0 0 1 20 20" fill="none" stroke={c} strokeWidth="1.2" /><path d="M4 20 A10 10 0 0 1 24 20" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5" /></>,
}

export default function ThemeCustomizer() {
  const { accentColor, setAccentColor, pattern, setPattern, patternOpacity, setPatternOpacity, resetCustomization } = useTheme()
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(accentColor)
  const panelRef = useRef(null)

  useEffect(() => { setHexInput(accentColor) }, [accentColor])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const btn = document.querySelector('.tc-trigger')
        if (btn && btn.contains(e.target)) return
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleHexSubmit = (e) => {
    e.preventDefault()
    const hex = hexInput.startsWith('#') ? hexInput : `#${hexInput}`
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      setAccentColor(hex)
    }
  }

  return (
    <>
      <button
        className="tc-trigger"
        onClick={() => setOpen(v => !v)}
        aria-label="Customize theme"
        title="Customize theme"
      >
        <FaPalette />
      </button>

      {open && (
        <div className="tc-panel" ref={panelRef}>
          <div className="tc-panel__header">
            <h4>Customize</h4>
            <button className="tc-panel__close" onClick={() => setOpen(false)} aria-label="Close">
              <FaTimes />
            </button>
          </div>

          {/* Color section */}
          <div className="tc-section">
            <label className="tc-label">Accent Color</label>
            <div className="tc-presets">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  className={`tc-swatch ${accentColor === c ? 'tc-swatch--active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setAccentColor(c)}
                  title={c}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>

            <form className="tc-hex-row" onSubmit={handleHexSubmit}>
              <div className="tc-hex-preview" style={{ background: accentColor }} />
              <input
                className="tc-hex-input"
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#6C5CE7"
                maxLength={7}
                spellCheck={false}
              />
              <input
                className="tc-color-picker"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                title="Pick a color"
              />
            </form>
          </div>

          {/* Pattern section */}
          <div className="tc-section">
            <label className="tc-label">Background Pattern</label>
            <div className="tc-patterns">
              {patternList.map((p) => (
                <button
                  key={p.id}
                  className={`tc-pattern ${pattern === p.id ? 'tc-pattern--active' : ''}`}
                  onClick={() => setPattern(p.id)}
                  title={p.label}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    {p.id === 'none'
                      ? <line x1="4" y1="4" x2="20" y2="20" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                      : patternThumbs[p.id]?.(accentColor)
                    }
                  </svg>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Opacity slider */}
          <div className="tc-section">
            <label className="tc-label">Pattern Opacity</label>
            <div className="tc-opacity">
              <input
                type="range"
                min="0"
                max={MAX_PATTERN_OPACITY}
                step="0.01"
                value={patternOpacity}
                onChange={(e) => setPatternOpacity(parseFloat(e.target.value))}
                className="tc-opacity-slider"
              />
              <span className="tc-opacity-value">
                {Math.round(patternOpacity * 100)}%
              </span>
            </div>
          </div>

          {/* Reset */}
          <button className="tc-reset" onClick={() => { resetCustomization(); setHexInput(DEFAULT_ACCENT) }}>
            <FaUndo /> Reset to Defaults
          </button>
        </div>
      )}
    </>
  )
}
