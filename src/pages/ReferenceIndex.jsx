import { Link } from 'react-router-dom'
import { getAllClasses, getClassesByCategory } from '../data/reference'
import useSEO from '../hooks/useSEO'
import './ReferenceIndex.css'

function AnnotationBadge({ name }) {
  const colorMap = {
    '@Composable': { bg: '#4CAF5015', color: '#4CAF50', border: '#4CAF5030' },
    '@Serializable': { bg: '#FF980015', color: '#FF9800', border: '#FF980030' },
    '@Target(FUNCTION)': { bg: '#2196F315', color: '#2196F3', border: '#2196F330' },
    '@Retention(RUNTIME)': { bg: '#9C27B015', color: '#9C27B0', border: '#9C27B030' },
    'private': { bg: '#78909C15', color: '#78909C', border: '#78909C30' },
  }
  const style = colorMap[name] || { bg: 'var(--bg-hover)', color: 'var(--text-secondary)', border: 'var(--border-secondary)' }
  return (
    <span className="ridx-badge" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
      {name}
    </span>
  )
}

export default function ReferenceIndex() {
  useSEO({
    title: 'API Reference — Ketoy SDK',
    description: `Browse all ${getAllClasses().length} classes in the Ketoy SDK API reference. Server-Driven UI framework for Android Jetpack Compose.`,
    path: '/reference',
  })
  const allClasses = getAllClasses()
  const byCategory = getClassesByCategory()

  const categoryOrder = ['Annotation', 'Cloud', 'Core']
  const total = allClasses.length

  return (
    <div className="ridx">
      <div className="ridx-hero">
        <h1 className="ridx-hero__title">API Reference</h1>
        <p className="ridx-hero__desc">
          Complete reference for all Ketoy SDK classes, objects, functions, enums, and annotations
          across the annotation, cloud, and core packages.
        </p>
        <div className="ridx-hero__stats">
          <span className="ridx-stat">{total} entries</span>
          <span className="ridx-stat">{Object.keys(byCategory).length} categories</span>
          <span className="ridx-stat">Android</span>
        </div>
      </div>

      {categoryOrder.map((cat) => {
        const subcats = byCategory[cat]
        if (!subcats) return null
        return (
          <section className="ridx-category" key={cat}>
            <h2 className="ridx-category__title">{cat}</h2>
            {Object.entries(subcats).map(([subcat, classes]) => (
              <div className="ridx-subcategory" key={subcat}>
                <h3 className="ridx-subcategory__title">{subcat}</h3>
                <div className="ridx-class-grid">
                  {classes.map((cls) => {
                    const pData = cls.android
                    return (
                      <Link to={`/reference/${cls.name}`} className="ridx-class-card" key={cls.name}>
                        <div className="ridx-class-card__header">
                          <span className="ridx-class-card__kind">{cls.kind}</span>
                          <div className="ridx-class-card__annotations">
                            {(pData.annotations || []).map((a) => (
                              <AnnotationBadge key={a} name={a} />
                            ))}
                          </div>
                        </div>
                        <h4 className="ridx-class-card__name">{cls.name}</h4>
                        <p className="ridx-class-card__pkg">{pData.packageName}</p>
                        <p className="ridx-class-card__desc">{cls.description}</p>
                        {cls.properties && cls.properties.length > 0 && (
                          <span className="ridx-class-card__count">{cls.properties.length} properties</span>
                        )}
                        {cls.methods && cls.methods.length > 0 && (
                          <span className="ridx-class-card__count">{cls.methods.length} methods</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
