import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaRocket, FaThLarge, FaPuzzlePiece, FaMobileAlt, FaCompass, FaBolt, FaWrench, FaCogs, FaFlask, FaBoxOpen, FaFont, FaImage, FaKeyboard, FaListUl } from 'react-icons/fa'
import CodeBlock from '../components/CodeBlock'
import { getDocById, getAllDocs } from '../data/docs'
import { getClassById } from '../data/reference'
import useSEO from '../hooks/useSEO'
import './DocsPage.css'

/** Map icon string names from doc data to react-icons components */
const iconMap = {
  FaRocket: FaRocket,
  FaThLarge: FaThLarge,
  FaPuzzlePiece: FaPuzzlePiece,
  FaMobileAlt: FaMobileAlt,
  FaCompass: FaCompass,
  FaBolt: FaBolt,
  FaWrench: FaWrench,
  FaCogs: FaCogs,
  FaFlask: FaFlask,
  FaBoxOpen: FaBoxOpen,
  FaFont: FaFont,
  FaImage: FaImage,
  FaKeyboard: FaKeyboard,
  FaListUl: FaListUl,
}

function DocIcon({ name, className }) {
  const Icon = iconMap[name]
  return Icon ? <Icon className={className} /> : null
}

/** Render a table from { headers, rows } */
function DocsTable({ headers, rows }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  {j === 0 ? <code>{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Render markdown-lite content (simple paragraphs, bold, code, links, lists, tables) */
function RichContent({ content }) {
  if (!content) return null

  // Split into paragraphs by double newlines
  const paragraphs = content.split(/\n\n+/)

  return (
    <div className="docs-rich-content">
      {paragraphs.map((paragraph, i) => {
        const trimmed = paragraph.trim()

        // Detect markdown table
        if (trimmed.includes('|') && trimmed.split('\n').length >= 2) {
          const lines = trimmed.split('\n').filter(l => l.trim())
          // Check if 2nd line is separator (---|---|...)
          if (lines.length >= 2 && /^\|?[\s-:|]+\|?$/.test(lines[1])) {
            const parseRow = row =>
              row.split('|').map(c => c.trim()).filter(Boolean)
            const headers = parseRow(lines[0])
            const rows = lines.slice(2).map(parseRow)
            return (
              <div key={i} className="docs-table-wrap">
                <table className="docs-table">
                  <thead>
                    <tr>{headers.map(h => <th key={h} dangerouslySetInnerHTML={{ __html: formatInline(h) }} />)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // Detect ordered list (lines starting with "1. ", "2. ", etc.)
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(l => l.trim())
          return (
            <ol key={i}>
              {items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^\d+\.\s*/, '')) }} />
              ))}
            </ol>
          )
        }

        // Detect unordered list (lines starting with "- ")
        if (/^[-*]\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(l => l.trim())
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^[-*]\s*/, '')) }} />
              ))}
            </ul>
          )
        }

        // Detect blockquote (starts with "> ")
        if (trimmed.startsWith('>')) {
          const text = trimmed.replace(/^>\s*/gm, '')
          return (
            <blockquote key={i} className="docs-blockquote" dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          )
        }

        // Regular paragraph
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        )
      })}
    </div>
  )
}

/** Format inline markdown: **bold**, `code`, [link](url) */
function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

/** Section renderer */
function DocSection({ section, depth = 2 }) {
  const HeadingTag = `h${Math.min(depth, 4)}`

  return (
    <div className="docs-section" id={section.id}>
      <HeadingTag className={`docs-section__title docs-section__title--h${depth}`}>
        {section.title}
      </HeadingTag>

      {section.content && <RichContent content={section.content} />}

      {section.table && (
        <DocsTable headers={section.table.headers} rows={section.table.rows} />
      )}

      {section.code && (
        <CodeBlock
          code={section.code}
          language={section.language || 'kotlin'}
          title={section.codeTitle}
        />
      )}

      {/* Subsections */}
      {section.subsections && section.subsections.map(sub => (
        <DocSection key={sub.id} section={sub} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function DocsPage() {
  const { docId } = useParams()
  const doc = getDocById(docId)
  const [activeId, setActiveId] = useState(null)

  useSEO({
    title: doc ? `${doc.title} — Ketoy Docs` : 'Page Not Found — Ketoy Docs',
    description: doc ? `Learn about ${doc.title} in the Ketoy Server-Driven UI framework for Android Jetpack Compose.` : undefined,
    path: `/docs/${docId}`,
  })

  // Collect TOC — must be before any early return (Rules of Hooks)
  const toc = doc ? doc.sections.map(s => ({ id: s.id, title: s.title })) : []

  useEffect(() => {
    if (!doc || toc.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible entry
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [docId, toc.length])

  if (!doc) {
    return (
      <div className="docs-page">
        <h1>Guide Not Found</h1>
        <p>No documentation for <code>{docId}</code>.</p>
        <Link to="/docs" className="docs-back-link">Back to Documentation</Link>
      </div>
    )
  }

  // Determine sibling docs for prev/next navigation
  const siblingDocs = getAllDocs()
  const currentIdx = siblingDocs.findIndex(d => d.id === docId)
  const prevDoc = currentIdx > 0 ? siblingDocs[currentIdx - 1] : null
  const nextDoc = currentIdx < siblingDocs.length - 1 ? siblingDocs[currentIdx + 1] : null

  return (
    <motion.div
      className="docs-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Breadcrumbs */}
      <nav className="docs-breadcrumbs">
        <Link to="/">Home</Link>
        <span className="docs-breadcrumbs__sep">/</span>
        <Link to="/docs">Docs</Link>
        <span className="docs-breadcrumbs__sep">/</span>
        <span className="docs-breadcrumbs__current">{doc.title}</span>
      </nav>

      {/* Header */}
      <div className="docs-header">
        <span className="docs-header__icon"><DocIcon name={doc.icon} /></span>
        <h1 className="docs-header__title">{doc.title}</h1>
        <p className="docs-header__desc">{doc.description}</p>
      </div>

      {/* Body: main content + On This Page sidebar */}
      <div className="docs-page__body">
        <div className="docs-page__main">
          {/* Content sections */}
          <div className="docs-content">
            {doc.sections.map(section => (
              <DocSection key={section.id} section={section} />
            ))}
          </div>

          {/* Related Reference */}
          {doc.relatedReference && doc.relatedReference.length > 0 && (
            <div className="docs-related">
              <h3 className="docs-related__title">Related API Reference</h3>
              <div className="docs-related__tags">
                {doc.relatedReference.map(ref => {
                  const refClass = getClassById(ref)
                  if (!refClass) return (
                    <span key={ref} className="docs-related__tag docs-related__tag--missing">{ref}</span>
                  )
                  return (
                    <Link key={ref} to={`/reference/${ref}`} className="docs-related__tag">
                      {ref}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="docs-nav-footer">
            {prevDoc ? (
              <Link to={`/docs/${prevDoc.id}`} className="docs-nav-footer__link docs-nav-footer__link--prev">
                <span className="docs-nav-footer__dir">← Previous</span>
                <span className="docs-nav-footer__label">{prevDoc.title}</span>
              </Link>
            ) : <div />}
            {nextDoc ? (
              <Link to={`/docs/${nextDoc.id}`} className="docs-nav-footer__link docs-nav-footer__link--next">
                <span className="docs-nav-footer__dir">Next →</span>
                <span className="docs-nav-footer__label">{nextDoc.title}</span>
              </Link>
            ) : <div />}
          </div>
        </div>

                {/* On This Page – sticky right sidebar (all docs pages) */}
                {toc.length > 1 && (
                  <aside className="docs-page__toc">
                    <nav className="docs-toc">
                      <h4 className="docs-toc__title">On this page</h4>
                      <ul className="docs-toc__list">
                        {toc.map(item => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className={`docs-toc__link${activeId === item.id ? ' docs-toc__link--active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                                setActiveId(item.id)
                              }}
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </aside>
                )}
              </div>
            </motion.div>
          )
        }
