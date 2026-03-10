import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaRocket, FaThLarge, FaPuzzlePiece, FaMobileAlt, FaCompass, FaBolt, FaWrench, FaCogs, FaFlask, FaBoxOpen, FaFont, FaImage, FaKeyboard, FaListUl } from 'react-icons/fa'
import { getGuideDocs, getWidgetDocs } from '../data/docs'
import useSEO from '../hooks/useSEO'
import './DocsIndex.css'

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function DocsIndex() {
  useSEO({
    title: 'Documentation — Ketoy Server-Driven UI SDK',
    description: 'Browse all Ketoy guides and component documentation. Learn how to build server-driven UIs with Jetpack Compose.',
    path: '/docs',
  })
  const allDocs = getGuideDocs()
  const widgetDocs = getWidgetDocs()

  // Roadmap items that are not yet written
  const upcoming = [
    { id: 'screens', title: 'Screens', icon: 'FaMobileAlt', description: 'ProvideKetoyScreen, KetoyContent, and screen composition.' },
    { id: 'navigation', title: 'Navigation', icon: 'FaCompass', description: 'Ketoy Compose navigation support and KetoyScreen navigation.' },
    { id: 'actions', title: 'Action Handling', icon: 'FaBolt', description: 'Click handlers, navigate actions, custom action parsers.' },
    { id: 'custom-components', title: 'Custom Components', icon: 'FaWrench', description: '@KComponent, custom function calls, and extensibility.' },
    { id: 'testing', title: 'Testing Locally', icon: 'FaFlask', description: 'Write test code, Gradle plugin commands, KetoyDev tools.' },
    { id: 'production', title: 'Production Release', icon: 'FaBoxOpen', description: 'Export code, Gradle config, screen versioning, and deployment.' },
  ]

  return (
    <div className="didx">
      <div className="didx-hero">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            Developer Guide
          </span>
          <h1 className="didx-hero__title">Documentation</h1>
          <p className="didx-hero__desc">
            Step-by-step guides for building server-driven UIs with the Ketoy SDK.
            Each module covers JSON syntax, Kotlin APIs, and practical examples.
          </p>
          <div className="didx-hero__stats">
            <span className="didx-stat">{allDocs.length} guides</span>
            <span className="didx-stat">{allDocs.length + upcoming.length} planned</span>
            <span className="didx-stat">Kotlin + JSON</span>
          </div>
        </motion.div>
      </div>

      {/* Available guides */}
      <section className="didx-section">
        <h2 className="didx-section__title">Available Guides</h2>
        <div className="didx-grid">
          {allDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link to={`/docs/${doc.id}`} className="didx-card">
                <span className="didx-card__icon"><DocIcon name={doc.icon} /></span>
                <div className="didx-card__body">
                  <h3 className="didx-card__title">{doc.title}</h3>
                  <p className="didx-card__desc">{doc.description}</p>
                  <span className="didx-card__count">
                    {doc.sections.length} sections
                  </span>
                </div>
                <svg className="didx-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Component Docs */}
      <section className="didx-section">
        <h2 className="didx-section__title">Components</h2>
        <div className="didx-grid">
          {widgetDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              custom={i + allDocs.length}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link to={`/docs/${doc.id}`} className="didx-card">
                <span className="didx-card__icon"><DocIcon name={doc.icon} /></span>
                <div className="didx-card__body">
                  <h3 className="didx-card__title">{doc.title}</h3>
                  <p className="didx-card__desc">{doc.description}</p>
                  <span className="didx-card__count">
                    {doc.sections.length} sections
                  </span>
                </div>
                <svg className="didx-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="didx-section">
        <h2 className="didx-section__title">Coming Soon</h2>
        <div className="didx-grid">
          {upcoming.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i + allDocs.length}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
            >
              <div className="didx-card didx-card--disabled">
                <span className="didx-card__icon"><DocIcon name={item.icon} /></span>
                <div className="didx-card__body">
                  <h3 className="didx-card__title">{item.title}</h3>
                  <p className="didx-card__desc">{item.description}</p>
                  <span className="didx-card__badge-soon">Coming soon</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA: API Reference */}
      <section className="didx-cta">
        <p className="didx-cta__text">
          Looking for the complete class & function reference?
        </p>
        <Link to="/reference" className="didx-cta__link">
          API Reference →
        </Link>
      </section>
    </div>
  )
}
