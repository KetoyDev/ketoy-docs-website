import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllClasses, getClassesByCategory } from '../data/reference'
import { getGuideDocs } from '../data/docs'
import CodeBlock from '../components/CodeBlock'
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
  const guideDocs = getGuideDocs().slice(0, 5)

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
            Open Source · Apache License 2.0
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

      {/* Info chips */}
      <section className="home__info">
        {[
          { label: 'Cloud-Driven Screens', desc: 'Fetch UI layouts from Ketoy Cloud with built-in caching & versioning.' },
          { label: 'Component Registry', desc: 'Register @Composable components with @KComponent and render from JSON.' },
          { label: 'Smart Caching', desc: '5 caching strategies: Network-First, Cache-First, Optimistic, and more.' },
        ].map((item) => (
          <div key={item.label} className="home__info-item">
            <h3>{item.label}</h3>
            <p>{item.desc}</p>
          </div>
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

      {/* Installation */}
      <section className="home__install">
        <h2>Installation</h2>
        <p className="home__gallery-sub">
          Add Ketoy to your Android project. Always use the{' '}
          <strong>latest version</strong>{' '}—{' '}
          <a
            href="https://central.sonatype.com/artifact/dev.ketoy/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="home__install-maven-link"
          >
            check Maven Central for the latest release ↗
          </a>
        </p>

        {/* Format table */}
        <div className="home__install-table-wrap">
          <table className="home__install-table">
            <thead>
              <tr>
                <th>Build System</th>
                <th>Config File</th>
                <th>Latest Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kotlin DSL</td>
                <td><code>build.gradle.kts</code></td>
                <td><code>0.1-beta</code></td>
              </tr>
              <tr>
                <td>Groovy DSL</td>
                <td><code>build.gradle</code></td>
                <td><code>0.1-beta</code></td>
              </tr>
              <tr>
                <td>Version Catalog (TOML)</td>
                <td><code>libs.versions.toml</code></td>
                <td><code>0.1-beta</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Code blocks */}
        <div className="home__install-blocks">
          <h4 className="home__install-format-label">Kotlin DSL</h4>
          <CodeBlock
            code={`dependencies {
    implementation("dev.ketoy:sdk:0.1-beta")
}`}
            language="kotlin"
            title="build.gradle.kts"
          />

          <h4 className="home__install-format-label">Groovy DSL</h4>
          <CodeBlock
            code={`dependencies {
    implementation 'dev.ketoy:sdk:0.1-beta'
}`}
            language="groovy"
            title="build.gradle"
          />

          <h4 className="home__install-format-label">Version Catalog (TOML)</h4>
          <CodeBlock
            code={`[versions]
ketoy = "0.1-beta"

[libraries]
ketoy-sdk = { group = "dev.ketoy", name = "sdk", version.ref = "ketoy" }`}
            language="toml"
            title="libs.versions.toml"
          />
          <CodeBlock
            code={`dependencies {
    implementation(libs.ketoy.sdk)
}`}
            language="kotlin"
            title="build.gradle.kts"
          />
        </div>
      </section>

      {/* Quick Reference Links */}
      <section className="home__gallery">
        <h2>Quick Reference</h2>
        <p className="home__gallery-sub">
          Jump to the most commonly used guides.
        </p>
        <div className="home__ref-list">
          {guideDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
            >
              <Link to={`/docs/${doc.id}`} className="home__ref-item">
                <span className="home__ref-name">{doc.title}</span>
                <span className="badge badge--outline">{doc.sections.length} sections</span>
              </Link>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/docs" className="home__btn home__btn--secondary">
            View All Guides →
          </Link>
        </div>
      </section>
    </div>
  )
}
