import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const NAV = [
  { label: 'Institutions', section: 'institutions' },
  { label: 'How it fits together', section: 'map' },
]

/**
 * Scroll to a section after navigation, or to the top. The router uses the
 * URL hash for routes, so in-page targets travel in link state instead:
 * <Link to="/" state={{ scrollTo: 'map' }}>.
 */
function useScrollToSection() {
  const location = useLocation()
  const section: string | undefined = location.state?.scrollTo
  useEffect(() => {
    const target = section ? document.getElementById(section) : null
    if (target) {
      target.scrollIntoView()
      target.focus({ preventScroll: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key, section])
}

export default function Layout() {
  useScrollToSection()
  return (
    <div className="page">
      {/* A plain #main link would be read as a route by the hash router. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              GR
            </span>
            <span className="brand__name">Glen Ridge Field Guide</span>
          </Link>
          <nav aria-label="Main" className="site-nav">
            {NAV.map((item) => (
              <Link key={item.section} to="/" state={{ scrollTo: item.section }}>
                {item.label}
              </Link>
            ))}
            <Link to="/budget">Where the money goes</Link>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div className="site-footer__name">Glen Ridge Field Guide</div>
          <p>
            <Link className="site-footer__link" to="/report">
              Spot something out of date? Report an error
            </Link>
          </p>
          <p>
            An unofficial, nonpartisan reference made by a resident. Not affiliated with the Borough of Glen Ridge or
            the Glen Ridge Public Schools. Each page links to its official source and shows when it was last verified.
            Check the official source before relying on anything here.
          </p>
        </div>
      </footer>
    </div>
  )
}
