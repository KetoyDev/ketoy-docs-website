import { useEffect } from 'react'

const SITE = 'https://docs.ketoy.dev'
const SITE_NAME = 'Ketoy Docs'

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name)
    } else {
      el.setAttribute('name', name)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

/**
 * @param {{ title: string, description?: string, path?: string }} opts
 */
export default function useSEO({ title, description, path = '' }) {
  useEffect(() => {
    document.title = title

    const url = `${SITE}${path}`
    const desc = description || `${title} — ${SITE_NAME}`

    setMeta('description', desc)
    setCanonical(url)
    setMeta('og:title', title)
    setMeta('og:description', desc)
    setMeta('og:url', url)
    setMeta('twitter:title', title)
    setMeta('twitter:description', desc)
  }, [title, description, path])
}
