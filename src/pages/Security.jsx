import { motion } from 'framer-motion'
import useSEO from '../hooks/useSEO'
import './Security.css'

export default function Security() {
  useSEO({
    title: 'Security — Ketoy Docs',
    description: 'Security practices, artifact verification, and vulnerability reporting for the Ketoy SDK.',
    path: '/security',
  })
  return (
    <div className="sec">
      {/* ── Hero ── */}
      <div className="sec-hero">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            Security
          </span>
          <h1 className="sec-hero__title">Security</h1>
          <p className="sec-hero__desc">
            The Ketoy team takes security seriously. This page describes how we publish artifacts
            securely and how to report vulnerabilities.
          </p>
        </motion.div>
      </div>

      {/* ── Artifact Verification ── */}
      <section className="sec-section">
        <h2 className="sec-section__title">Artifact Verification</h2>
        <p>
          All Ketoy releases are published to Maven Central and signed with a GPG key so you can
          verify their authenticity. You can browse and verify the published artifacts at:
        </p>
        <a
          href="https://central.sonatype.com/artifact/dev.ketoy/sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="sec-maven-link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Maven Central — dev.ketoy:sdk
        </a>
      </section>

      {/* ── Public Signing Key ── */}
      <section className="sec-section">
        <h2 className="sec-section__title">Public Signing Key</h2>
        <p>
          Ketoy SDK artifacts are signed with the following GPG key. You can use it to verify
          that downloads have not been tampered with.
        </p>

        <div className="sec-key-box">
          <div className="sec-key-row">
            <span className="sec-key-label">Key ID</span>
            <span className="sec-key-value">1ACC8665</span>
          </div>
          <div className="sec-key-row">
            <span className="sec-key-label">Full Fingerprint</span>
            <span className="sec-key-value">B2DC 6C74 B394 1F63 CCB2 6F64 C084 1494 1ACC 8665</span>
          </div>

          <p style={{ marginTop: 16, marginBottom: 10, fontWeight: 600, color: 'var(--text-primary)' }}>Key Details</p>
          <table className="sec-key-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Type</td>
                <td>Ed25519 (Elliptic Curve)</td>
              </tr>
              <tr>
                <td>Key Size</td>
                <td>256-bit</td>
              </tr>
              <tr>
                <td>Security Level</td>
                <td>Equivalent to RSA 3072-bit</td>
              </tr>
              <tr>
                <td>Subkey</td>
                <td>cv25519 (Curve25519, 256-bit) for encryption</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sec-callout">
          <strong>Why Ed25519?</strong> Ed25519 is a modern elliptic curve algorithm that is more
          secure and efficient than RSA. It is fully supported by Maven Central and GPG verification
          tools. The 256-bit Ed25519 key provides the same security level as a 3072-bit RSA key but
          with better performance and smaller signatures.
        </div>
      </section>

      {/* ── Verifying Artifacts ── */}
      <section className="sec-section">
        <h2 className="sec-section__title">Verifying Artifacts</h2>
        <p>
          To verify a downloaded artifact, use GPG with the public key above. Import the key then
          verify the signature file accompanying each Maven Central release:
        </p>
        <pre className="sec-code">
{`# Receive public key from key server
gpg --recv-keys 1ACC8665

# Verify a downloaded .aar or .jar file
gpg --verify ketoy-sdk-<version>.aar.asc ketoy-sdk-<version>.aar`}
        </pre>
        <p>
          Maven Central automatically verifies signatures during publishing. All artifacts listed on{' '}
          <a href="https://central.sonatype.com/artifact/dev.ketoy/sdk" target="_blank" rel="noopener noreferrer">
            central.sonatype.com/artifact/dev.ketoy/sdk
          </a>{' '}
          have been verified and signed with the key above.
        </p>
      </section>

      {/* ── Reporting Vulnerabilities ── */}
      <section className="sec-section">
        <h2 className="sec-section__title">Reporting Vulnerabilities</h2>
        <p>
          If you discover a security vulnerability in Ketoy, please report it responsibly.{' '}
          <strong>Do not open a public GitHub issue for security vulnerabilities.</strong>
        </p>
        <p>Instead, please send an email to:</p>
        <a href="mailto:aditya@ketoy.dev" className="sec-email-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          aditya@ketoy.dev
        </a>
        <p style={{ marginTop: '0.9rem' }}>
          We will acknowledge your report within 48 hours and work with you to understand and
          address the issue before any public disclosure.
        </p>
      </section>

      {/* ── Secure Release Process ── */}
      <section className="sec-section">
        <h2 className="sec-section__title">Secure Release Process</h2>
        <p>Ketoy follows a secure release process for all SDK and Gradle plugin artifacts:</p>
        <ul>
          <li>All releases are built in a controlled CI environment.</li>
          <li>Artifacts are signed before publication with the GPG key listed above.</li>
          <li>Releases are published exclusively through Maven Central (Sonatype) — no third-party mirrors.</li>
          <li>
            Each release is tagged in the{' '}
            <a href="https://github.com/KetoyDev/ketoy/releases" target="_blank" rel="noopener noreferrer">
              GitHub Releases
            </a>{' '}
            page with a corresponding changelog.
          </li>
          <li>We recommend pinning to a specific version in your Gradle configuration and updating intentionally.</li>
        </ul>
      </section>

      {/* ── Related Links ── */}
      <section className="sec-section">
        <h2 className="sec-section__title">Related Links</h2>
        <ul>
          <li>
            <a href="https://central.sonatype.com/artifact/dev.ketoy/sdk" target="_blank" rel="noopener noreferrer">
              Ketoy on Maven Central
            </a>
          </li>
          <li>
            <a href="https://github.com/KetoyDev/ketoy/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
              Contributing to Ketoy
            </a>
          </li>
          <li>
            <a href="https://github.com/KetoyDev/ketoy/releases" target="_blank" rel="noopener noreferrer">
              Releases
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
