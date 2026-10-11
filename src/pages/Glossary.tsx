import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findInstitution, formatDate, guide, useTitle } from '../data'
import SourceLinks from '../components/SourceLinks'

export default function Glossary() {
  useTitle('Glossary')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const terms = [...guide.glossary]
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { numeric: true }))
    .filter((t) => !q || [t.term, ...t.aliases, t.meaning].some((s) => s.toLowerCase().includes(q)))

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › Everyday questions › Glossary
        </nav>
        <div className="stack stack--sm">
          <h1>Glossary</h1>
          <p className="lede">Terms you will meet on an agenda or a notice, each with the source for its meaning.</p>
          <p className="fine">
            Last verified {formatDate(guide.last_verified)}. These are plain summaries, not legal advice.
          </p>
        </div>
      </div>

      <div className="container section stack">
        <div className="search">
          <label htmlFor="term-q">Search the glossary</label>
          <input id="term-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <p className="fine" aria-live="polite">
          {terms.length} of {guide.glossary.length} terms
        </p>
        {terms.length ? (
          <dl className="rows glossary">
            {terms.map((t) => {
              const inst = findInstitution(t.institution ?? undefined)
              return (
                <div key={t.term} className="row">
                  <dt className="row__when">
                    {t.term}
                    {t.aliases.length > 0 && <div className="fine">Also: {t.aliases.join(', ')}</div>}
                  </dt>
                  <dd className="row__what stack stack--sm">
                    <div>{t.meaning}</div>
                    {inst && (
                      <Link className="text-link" to={`/institutions/${inst.id}`}>
                        About the {inst.name} →
                      </Link>
                    )}
                    <SourceLinks sources={t.sources} />
                  </dd>
                </div>
              )
            })}
          </dl>
        ) : (
          <p className="muted">No term matches that search.</p>
        )}
      </div>
    </>
  )
}
