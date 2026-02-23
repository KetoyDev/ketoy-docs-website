import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import referenceData from '../data/reference'
import './Search.css'

function highlightMatch(text, query) {
  if (!query || !text) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  )
}

function searchItems(query) {
  if (!query || query.length < 2) return []

  const lowerQuery = query.toLowerCase()
  const results = []

  Object.entries(referenceData).forEach(([id, cls]) => {
    const matchScore =
      (cls.name?.toLowerCase().includes(lowerQuery) ? 10 : 0) +
      (cls.description?.toLowerCase().includes(lowerQuery) ? 5 : 0) +
      (cls.category?.toLowerCase().includes(lowerQuery) ? 3 : 0) +
      (cls.subcategory?.toLowerCase().includes(lowerQuery) ? 3 : 0) +
      (cls.android?.packageName?.toLowerCase().includes(lowerQuery) ? 2 : 0)

    if (matchScore > 0) {
      results.push({
        id,
        name: cls.name,
        description: cls.description,
        category: cls.category,
        subcategory: cls.subcategory,
        path: `/reference/${id}`,
        score: matchScore
      })
    }
  })

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 8)
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const searchResults = searchItems(query)
    setResults(searchResults)
    setIsOpen(query.length >= 2)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (path) => {
    navigate(path)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="search">
      <div className="search__input-wrapper">
        <svg className="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search__input"
          placeholder="Search reference... (⌘K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button className="search__clear" onClick={handleClear} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="search__dropdown">
          {results.length === 0 ? (
            <div className="search__empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{margin: '0 auto 0.5rem', opacity: 0.3}}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <div>No results for &quot;{query}&quot;</div>
            </div>
          ) : (
            <>
              <div className="search__category">Reference ({results.length})</div>
              {results.map((result) => (
                <a
                  key={result.id}
                  className="search__result"
                  onClick={(e) => {
                    e.preventDefault()
                    handleResultClick(result.path)
                  }}
                  href={result.path}
                >
                  <div className="search__result-header">
                    <span className="search__result-badge search__result-badge--reference">
                      {result.subcategory || result.category}
                    </span>
                    <span className="search__result-title">{highlightMatch(result.name, query)}</span>
                  </div>
                  <div className="search__result-desc">{result.description}</div>
                </a>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
