import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCloud, FaCubes, FaBolt } from 'react-icons/fa'
import { getAllClasses, getClassesByCategory } from '../data/reference'
import './Home.css'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function Home() {
  const allClasses = getAllClasses()
  const byCategory = getClassesByCategory()

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            Open Source · Apache 2.0
          </span>
          <h1 className="home__title">
            Ketoy <span className="home__title-accent">Docs</span>
          </h1>
          <p className="home__subtitle">
            Server-Driven UI framework for <strong>Jetpack Compose</strong>.
            Build dynamic, cloud-managed screens with caching, navigation, and a powerful component registry.
          </p>
          <div className="home__actions">
            <Link to="/docs" className="home__btn home__btn--primary">
              Documentation
            </Link>
            <Link to="/reference" className="home__btn home__btn--secondary">
              API Reference
            </Link>
            <a
              href="https://github.com/KetoyDev/ketoy"
              target="_blank"
              rel="noopener noreferrer"
              className="home__btn home__btn--secondary"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Info cards */}
      <section className="home__info">
        {[
          {
            icon: <FaCloud />,
            title: 'Cloud-Driven Screens',
            desc: 'Fetch UI layouts from the Ketoy Cloud API with built-in caching, versioning, and background refresh.',
          },
          {
            icon: <FaCubes />,
            title: 'Component Registry',
            desc: 'Register custom @Composable components with @KComponent and render them dynamically from JSON.',
          },
          {
            icon: <FaBolt />,
            title: 'Smart Caching',
            desc: 'Five caching strategies (Network-First, Cache-First, Optimistic, Cache-Only, Network-Only) for every use case.',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            className="home__info-card"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="home__info-icon">{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats */}
      <section className="home__platforms">
        <h2>SDK at a Glance</h2>
        <div className="home__platform-grid">
          {[
            { name: 'Classes & Objects', version: `${allClasses.length}` },
            { name: 'Categories', version: `${Object.keys(byCategory).length}` },
            { name: 'Platform', version: 'Android' },
            { name: 'Min SDK', version: 'API 21+' },
            { name: 'Language', version: 'Kotlin' },
          ].map((p) => (
            <div key={p.name} className="home__platform-chip">
              <strong>{p.name}</strong>
              <span>{p.version}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Reference Links */}
      <section className="home__gallery">
        <h2>Quick Reference</h2>
        <p className="home__gallery-sub">
          Browse the complete API reference for the Ketoy SDK.
        </p>
        <div className="home__gallery-grid">
          {allClasses.slice(0, 12).map((cls, i) => (
            <motion.div
              key={cls.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
            >
              <Link to={`/reference/${cls.name}`} className="home__gallery-card">
                <div className="home__gallery-placeholder">
                  <span>{cls.name[0]}</span>
                </div>
                <div className="home__gallery-card-body">
                  <h4>{cls.name}</h4>
                  <span className="badge badge--outline">{cls.kind}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {allClasses.length > 12 && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/reference" className="home__btn home__btn--secondary">
              View All {allClasses.length} Entries →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
