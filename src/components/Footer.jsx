import { Link } from 'react-router-dom'
import { FaGithub, FaHeart } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__divider" />

      <div className="footer__content">
        <div className="footer__top">
          <div className="footer__links">
            <a
              href="https://github.com/KetoyDev/ketoy/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contributing to Ketoy
            </a>
            <span className="footer__sep">|</span>
            <a
              href="https://github.com/KetoyDev/ketoy/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              Releases
            </a>
            <span className="footer__sep">|</span>
            <Link to="/security">Security</Link>
            <span className="footer__sep">|</span>
            <a
              href="https://central.sonatype.com/artifact/dev.ketoy/sdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Maven Central
            </a>
          </div>

          <div className="footer__social">
            <a
              href="https://github.com/KetoyDev/ketoy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer__social-link"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="footer__license">
          Ketoy is licensed under the{' '}
          <a
            href="https://github.com/KetoyDev/ketoy/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
             Apache License 2.0
          </a>
          .
        </div>

        <div className="footer__bottom">
          <div className="footer__brand">
            <span>
              Supported and developed by{' '}
              <a
                href="https://github.com/developerchunk"
                target="_blank"
                rel="noopener noreferrer"
              >
                DeveloperChunk
              </a>
            </span>
          </div>
          <div className="footer__credit">
            Website designed & built with <FaHeart className="footer__heart" /> by{' '}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
              Claude
            </a>{' '}
            and{' '}
            <a href="https://github.com/developerchunk" target="_blank" rel="noopener noreferrer">
              Developer Chunk
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
