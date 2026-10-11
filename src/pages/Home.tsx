import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, institutions, isAppointed, isElected, matchesQuery, namedMembers, NOT_CONFIRMED, oldestVerified, planned, useTitle } from '../data'
import { CATEGORIES, type CategoryId } from '../categories'
import type { Institution, Planned, Source } from '../schema'

type Filter = CategoryId | 'all'

function InstitutionCard({ inst }: { inst: Institution }) {
  const named = namedMembers(inst).length
  return (
    <li>
      <Link to={`/institutions/${inst.id}`} className="card card--link inst-card">
        <span className="eyebrow">{CATEGORIES[inst.category]}</span>
        <span className="inst-card__name">{inst.name}</span>
        <span className="inst-card__summary">{inst.summary}</span>
        <span className="inst-card__meta">
          <span>Meets: {inst.meets.schedule ?? NOT_CONFIRMED.toLowerCase()}</span>
          <span>{named ? `${named} members listed · see roster →` : 'Roster not yet confirmed · open page →'}</span>
        </span>
      </Link>
    </li>
  )
}

type MapItem = { id: string; name: string; live: boolean; source?: Source }

function MapLink({ item, className }: { item: MapItem; className?: string }) {
  return item.live ? (
    <Link className={className} to={`/institutions/${item.id}`}>
      {item.name}
    </Link>
  ) : (
    <span className={className && `${className} pill--soon`}>{item.name}</span>
  )
}

/**
 * Only bodies with a source for how they are seated appear here: a live
 * institution needs seated_source, a planned one needs layer + source.
 */
function RelationshipMap() {
  const live = institutions
    .filter((i) => i.seated_source)
    .map((i) => ({ id: i.id, name: i.name, live: true, source: i.seated_source, inst: i }))
  const elected: MapItem[] = live.filter((i) => isElected(i.inst))
  const appointed: MapItem[] = [
    ...live.filter((i) => isAppointed(i.inst)),
    ...planned.filter((p) => p.layer === 'appointed').map((p) => ({ id: p.id, name: p.name, live: false, source: p.source })),
  ]
  const plannedIn = (layer: Planned['layer']): MapItem[] =>
    planned.filter((p) => p.layer === layer).map((p) => ({ id: p.id, name: p.name, live: false, source: p.source }))
  const rows = [
    { label: 'Borough departments', items: plannedIn('department') },
    { label: 'Bought from a neighbouring town', items: plannedIn('contracted') },
    { label: 'Also taxes Glen Ridge property', items: plannedIn('above') },
  ].filter((row) => row.items.length > 0)

  const sources = new Map<string, Source>()
  for (const item of [...elected, ...appointed, ...rows.flatMap((r) => r.items)]) {
    if (item.source) sources.set(item.source.url, item.source)
  }

  return (
    <>
      <div className="card map">
        <div className="map__residents">Glen Ridge residents</div>
        <div className="map__connector">elect</div>
        <ul className="map__row">
          {elected.map((b) => (
            <li key={b.id} className="map__elected">
              <MapLink item={b} />
            </li>
          ))}
        </ul>
        {appointed.length > 0 && (
          <>
            <div className="map__connector">the Mayor appoints, the Council confirms</div>
            <ul className="map__pills">
              {appointed.map((b) => (
                <li key={b.id}>
                  <MapLink item={b} className="pill" />
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="map__rows">
          {rows.map((row) => (
            <div key={row.label} className="map__above">
              <span className="eyebrow eyebrow--muted">{row.label}</span>
              <span>{row.items.map((a) => a.name).join(' · ')}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="fine">
        Dashed names and the rows below them do not have a page yet. Sources for this diagram:{' '}
        {[...sources.values()].map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a className="text-link" href={s.url}>
              {s.title}
            </a>
          </span>
        ))}
      </p>
    </>
  )
}

export default function Home() {
  useTitle()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const verified = oldestVerified()

  const inFilter = (c: CategoryId) => filter === 'all' || c === filter
  const shown = institutions.filter((i) => inFilter(i.category) && matchesQuery(i, query))
  const soon = planned.filter((p) => inFilter(p.category) && p.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <>
      <section className="container hero stack">
        <div className="eyebrow eyebrow--lg">An unofficial guide for residents</div>
        <h1 className="hero__title">Who runs what in Glen Ridge?</h1>
        <p className="lede">
          Every board, commission and office in the borough and the schools: what each one decides, who sits on it,
          and where to go when you need something.
        </p>
        <p className="fine">
          {verified && <>Pages last verified {formatDate(verified)} or later · </>}
          Every page links to its official source ·{' '}
          <Link className="text-link" to="/report">
            Spot something wrong? Report an error
          </Link>
        </p>
      </section>

      <section id="map" tabIndex={-1} className="container section stack" aria-labelledby="map-heading">
        <div className="stack stack--sm">
          <h2 id="map-heading">How it fits together</h2>
          <p className="measure muted">
            Residents elect two governing bodies. The Mayor appoints the members of the borough's boards and
            commissions, and the Council confirms them.
          </p>
        </div>
        <RelationshipMap />
      </section>

      <section className="container stack tools" aria-labelledby="tools-heading">
        <h2 id="tools-heading">Everyday questions</h2>
        <ul className="grid">
          <li>
            <Link to="/tour" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">New here? Take the tour</span>
              <span className="inst-card__summary">
                Five things to know about how Glen Ridge is run, each with a place to read more.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/budget" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">Where the money goes</span>
              <span className="inst-card__summary">
                How the property tax levy splits among the schools, the borough and the county, and who sets each
                budget.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/calendar" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">Civic calendar</span>
              <span className="inst-card__summary">
                When each body meets, the dated meetings coming up, and what comes round every year.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/first-meeting" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">Your first public meeting</span>
              <span className="inst-card__summary">
                What the law says about attending and speaking, and each body's own rules for public comment.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/permits" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">Permit finder</span>
              <span className="inst-card__summary">
                Building, changing a historic exterior, removing a tree: which office or board to ask first.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/glossary" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">Glossary</span>
              <span className="inst-card__summary">
                Variance, ordinance, executive session and other terms you will meet on an agenda.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/people" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">People index</span>
              <span className="inst-card__summary">
                Everyone named in the guide in one list, so you can see who serves on more than one body.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
          <li>
            <Link to="/at-a-glance" className="card card--link inst-card inst-card--tool">
              <span className="inst-card__name">Glen Ridge at a glance</span>
              <span className="inst-card__summary">
                Every body on one printable page: what it does, when it meets and how to reach it.
              </span>
              <span className="inst-card__meta">Open →</span>
            </Link>
          </li>
        </ul>
      </section>

      <section id="institutions" tabIndex={-1} className="band" aria-labelledby="institutions-heading">
        <div className="container section stack">
          <h2 id="institutions-heading">Browse every institution</h2>

          <div className="search">
            <label htmlFor="q">Search institutions and people</label>
            <input
              id="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “variance”, “school budget”, or a name"
            />
          </div>

          <div className="chips" role="group" aria-label="Filter by category">
            {(['all', ...Object.keys(CATEGORIES)] as Filter[]).map((c) => (
              <button
                key={c}
                type="button"
                className="chip"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c === 'all' ? 'All' : CATEGORIES[c]}
              </button>
            ))}
          </div>

          <p className="fine" aria-live="polite">
            {shown.length} with a page · {soon.length} coming soon
          </p>

          {shown.length > 0 && (
            <ul className="grid">
              {shown.map((inst) => (
                <InstitutionCard key={inst.id} inst={inst} />
              ))}
            </ul>
          )}

          {soon.length > 0 && (
            <ul className="grid">
              {soon.map((p) => (
                <li key={p.id} className="card inst-card inst-card--soon">
                  <span className="eyebrow eyebrow--muted">{CATEGORIES[p.category]}</span>
                  <span className="inst-card__name">{p.name}</span>
                  <span className="inst-card__meta">Coming soon</span>
                </li>
              ))}
            </ul>
          )}

          {shown.length + soon.length === 0 && <p className="muted">Nothing matches that search yet.</p>}
        </div>
      </section>
    </>
  )
}
