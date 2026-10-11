import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findInstitution, formatDate, guide, useTitle } from '../data'
import SourceLinks from '../components/SourceLinks'

export default function PermitFinder() {
  useTitle('Permit finder')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const permits = guide.permits.filter(
    (p) => !q || [p.project, p.who, p.body].some((s) => s.toLowerCase().includes(q)),
  )

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › Everyday questions › Permit finder
        </nav>
        <div className="stack stack--sm">
          <h1>Permit finder</h1>
          <p className="lede">Which borough office or board to ask first, by the kind of project.</p>
          <p className="fine">
            Last verified {formatDate(guide.last_verified)}. This says who to ask, not what will be approved. A project
            can need more than one of these.
          </p>
        </div>
      </div>

      <div className="container columns">
        <div className="columns__main stack">
          <div className="search">
            <label htmlFor="permit-q">Search projects</label>
            <input
              id="permit-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “tree”, “historic” or “sidewalk”"
            />
          </div>
          <p className="fine" aria-live="polite">
            {permits.length} of {guide.permits.length} projects
          </p>
          {permits.length ? (
            <ul className="rows">
              {permits.map((p) => {
                const inst = findInstitution(p.institution ?? undefined)
                return (
                  <li key={p.project} className="row">
                    <div className="row__when">{p.project}</div>
                    <div className="row__what stack stack--sm">
                      <div>
                        <div className="eyebrow">Ask</div>
                        <div className="row__title">{p.who}</div>
                        <div className="muted">{p.body}</div>
                      </div>
                      {p.contact && <div>{p.contact}</div>}
                      {inst && (
                        <Link className="text-link" to={`/institutions/${inst.id}`}>
                          About the {inst.name} →
                        </Link>
                      )}
                      <SourceLinks sources={p.sources} />
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="muted">No project matches that search.</p>
          )}
        </div>

        <aside className="columns__side stack">
          <section className="card stack stack--sm" aria-labelledby="forms-heading">
            <h2 id="forms-heading" className="card__title">
              Official forms
            </h2>
            <p className="muted">The borough keeps its permit applications and fee schedule on its own pages.</p>
            <ul className="link-list">
              <li>
                <a className="text-link" href="https://www.glenridgenj.org/permits/">
                  Easy Access Forms →
                </a>
              </li>
              <li>
                <a className="text-link" href="https://www.glenridgenj.org/building-department/">
                  Building Department →
                </a>
              </li>
            </ul>
          </section>
          <section className="card stack stack--sm" aria-labelledby="permit-related-heading">
            <h2 id="permit-related-heading" className="card__title">
              Related
            </h2>
            <ul className="link-list">
              <li>
                <Link className="text-link" to="/glossary">
                  Glossary →
                </Link>
              </li>
              <li>
                <Link className="text-link" to="/first-meeting">
                  Your first public meeting →
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  )
}
