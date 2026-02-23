import { useTheme } from '../context/ThemeContext'
import './PatternBackground.css'

const patterns = {
  none: () => null,
  minimal: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-minimal" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect x="25" y="0" width="10" height="40" rx="3" fill={color} />
          <rect x="0" y="20" width="40" height="8" rx="3" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-minimal)" />
    </svg>
  ),
  dots: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="3" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-dots)" />
    </svg>
  ),
  grid: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-grid)" />
    </svg>
  ),
  waves: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-waves" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke={color} strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-waves)" />
    </svg>
  ),
  diagonal: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-diagonal" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 20 L20 0" stroke={color} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-diagonal)" />
    </svg>
  ),
  hexagons: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-hexagons" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
          <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke={color} strokeWidth="1" />
          <path d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34" fill="none" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-hexagons)" />
    </svg>
  ),
  arches: (color) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="p-arches" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40 A20 20 0 0 1 40 40" fill="none" stroke={color} strokeWidth="1.2" />
          <path d="M-20 40 A20 20 0 0 1 20 40" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-arches)" />
    </svg>
  ),
}

export const patternList = [
  { id: 'none', label: 'None' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'dots', label: 'Dots' },
  { id: 'grid', label: 'Grid' },
  { id: 'waves', label: 'Waves' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'hexagons', label: 'Hexagons' },
  { id: 'arches', label: 'Arches' },
]

export default function PatternBackground() {
  const { accentColor, pattern, patternOpacity } = useTheme()
  if (pattern === 'none' || !patterns[pattern]) return null
  return (
    <div className="pattern-bg" style={{ opacity: patternOpacity }}>
      {patterns[pattern](accentColor)}
    </div>
  )
}
