import { useParams, Link } from 'react-router-dom'
import { Highlight, themes } from 'prism-react-renderer'
import { useTheme } from '../context/ThemeContext'
import { getClassById, getAllClasses } from '../data/reference'
import './ReferencePage.css'

/** Set of all known reference class names for cross-linking */
const ALL_CLASS_NAMES = new Set(getAllClasses().map(c => c.name))

/**
 * Parse a Kotlin type string and turn known reference names into links.
 * Handles: "KetoyCacheStrategy", "KetoyCacheEntry?", "Map<String, NavFetchResult>"
 */
function TypeLink({ type }) {
  if (!type || type === '—') return <code className="ref-prop-type">{type}</code>

  // Tokenize: split on word boundaries while keeping delimiters (< > , ? * () ->)
  const tokens = type.split(/(\b)/)
  const parts = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    // Strip trailing ? for lookup
    const stripped = token.replace(/\?$/, '')
    if (ALL_CLASS_NAMES.has(stripped)) {
      parts.push(
        <Link key={i} to={`/reference/${stripped}`} className="ref-type-link">
          {token}
        </Link>
      )
    } else {
      parts.push(<span key={i}>{token}</span>)
    }
  }

  return <code className="ref-prop-type ref-prop-type--linked">{parts}</code>
}

function AnnotationBadge({ name }) {
  const colorMap = {
    '@Composable': { bg: '#4CAF5020', color: '#4CAF50', border: '#4CAF5040' },
    '@Serializable': { bg: '#FF980020', color: '#FF9800', border: '#FF980040' },
    '@Target(FUNCTION)': { bg: '#2196F320', color: '#2196F3', border: '#2196F340' },
    '@Retention(RUNTIME)': { bg: '#9C27B020', color: '#9C27B0', border: '#9C27B040' },
    'private': { bg: '#78909C20', color: '#78909C', border: '#78909C40' },
  }
  const style = colorMap[name] || { bg: 'var(--bg-hover)', color: 'var(--text-secondary)', border: 'var(--border-secondary)' }
  return (
    <span className="ref-annotation" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
      {name}
    </span>
  )
}

function KindBadge({ kind }) {
  return <span className="ref-kind-badge">{kind}</span>
}

function SourceCodeBlock({ code, theme }) {
  return (
    <Highlight theme={theme === 'dark' ? themes.nightOwl : themes.nightOwlLight} code={code.trim()} language="kotlin">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`ref-source-pre ${className}`} style={{ ...style, background: 'var(--bg-code)' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="ref-source-line-no">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default function ReferencePage() {
  const { classId } = useParams()
  const { theme } = useTheme()

  const cls = getClassById(classId)

  if (!cls) {
    return (
      <div className="ref-page">
        <h1>Class Not Found</h1>
        <p>No reference entry for <code>{classId}</code>.</p>
        <Link to="/reference" className="ref-back-link">Back to All Classes</Link>
      </div>
    )
  }

  const platformData = cls.android
  const annotations = platformData.annotations || []

  return (
    <div className="ref-page">
      {/* Breadcrumbs */}
      <nav className="ref-breadcrumbs">
        <Link to="/reference">Reference</Link>
        <span className="ref-breadcrumbs__sep">/</span>
        <span>{cls.category}</span>
        <span className="ref-breadcrumbs__sep">/</span>
        <span>{cls.subcategory}</span>
        <span className="ref-breadcrumbs__sep">/</span>
        <span className="ref-breadcrumbs__current">{cls.name}</span>
      </nav>

      {/* Header */}
      <div className="ref-header">
        <div className="ref-header__badges">
          <KindBadge kind={cls.kind} />
          {annotations.map((a) => <AnnotationBadge key={a} name={a} />)}
          <span className="ref-platform-indicator">Android</span>
        </div>
        <h1 className="ref-header__name">{cls.name}</h1>
        <p className="ref-header__desc">{cls.description}</p>
      </div>

      {/* Package Info */}
      <section className="ref-section">
        <h2 className="ref-section__title">Package</h2>
        <code className="ref-package">{platformData.packageName}</code>
      </section>

      {/* Imports */}
      {platformData.imports && platformData.imports.length > 0 && (
        <section className="ref-section">
          <h2 className="ref-section__title">Imports</h2>
          <div className="ref-imports">
            {platformData.imports.map((imp, i) => (
              <code key={i} className="ref-import-line">{imp}</code>
            ))}
          </div>
        </section>
      )}

      {/* Source Code */}
      <section className="ref-section">
        <h2 className="ref-section__title">Source Code</h2>
        <div className="ref-source">
          <div className="ref-source__header">
            <span className="ref-source__filename">
              {cls.name}.kt
            </span>
            <span className="ref-source__lang">Kotlin</span>
          </div>
          <SourceCodeBlock code={platformData.sourceCode} theme={theme} />
        </div>
      </section>

      {/* Properties Table */}
      {cls.properties && cls.properties.length > 0 && (
        <section className="ref-section">
          <h2 className="ref-section__title">Properties</h2>
          <div className="ref-table-wrapper">
            <table className="ref-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {cls.properties.map((p) => (
                  <tr key={p.name}>
                    <td><code className="ref-prop-name">{p.name}</code></td>
                    <td><TypeLink type={p.type} /></td>
                    <td><code className="ref-prop-default">{p.default}</code></td>
                    <td>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Methods */}
      {cls.methods && cls.methods.length > 0 && (
        <section className="ref-section">
          <h2 className="ref-section__title">Methods</h2>
          <div className="ref-table-wrapper">
            <table className="ref-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Returns</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {cls.methods.map((m) => (
                  <tr key={m.name}>
                    <td><code className="ref-prop-name">{m.name}</code></td>
                    <td><TypeLink type={m.returns} /></td>
                    <td>{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Inner Classes */}
      {cls.innerClasses && cls.innerClasses.length > 0 && (
        <section className="ref-section">
          <h2 className="ref-section__title">Inner Classes</h2>
          {cls.innerClasses.map((inner) => (
            <div key={inner.name} className="ref-inner-class">
              <div className="ref-inner-class__header">
                <KindBadge kind={inner.kind} />
                <h3 className="ref-inner-class__name">{inner.name}</h3>
              </div>
              <p className="ref-inner-class__desc">{inner.description}</p>
              {inner.properties && inner.properties.length > 0 && (
                <div className="ref-table-wrapper">
                  <table className="ref-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inner.properties.map((p) => (
                        <tr key={p.name}>
                          <td><code className="ref-prop-name">{p.name}</code></td>
                          <td><TypeLink type={p.type} /></td>
                          <td><code className="ref-prop-default">{p.default}</code></td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Usage */}
      {cls.usage && (
        <section className="ref-section">
          <h2 className="ref-section__title">Usage</h2>
          <div className="ref-source">
            <div className="ref-source__header">
              <span className="ref-source__filename">Example</span>
              <span className="ref-source__lang">Kotlin</span>
            </div>
            <SourceCodeBlock code={cls.usage} theme={theme} />
          </div>
        </section>
      )}

      {/* Notes */}
      {cls.notes && (
        <section className="ref-section">
          <h2 className="ref-section__title">Notes</h2>
          <div className="ref-note">
            {cls.notes}
          </div>
        </section>
      )}

      {/* See Also – Tags */}
      {cls.seeAlso && cls.seeAlso.length > 0 && (
        <section className="ref-section">
          <h2 className="ref-section__title">See Also</h2>
          <div className="ref-tags">
            {cls.seeAlso.map((tag) => {
              const target = getClassById(tag)
              return target ? (
                <Link key={tag} to={`/reference/${tag}`} className="ref-tag">
                  {tag}
                  {target.kind && <span className="ref-tag__kind">{target.kind}</span>}
                </Link>
              ) : (
                <span key={tag} className="ref-tag ref-tag--missing">{tag}</span>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
