import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { budget, findInstitution, guide, institutions, isElected, services, useTitle } from '../data'
import SourceLinks from '../components/SourceLinks'
import type { Institution, Source } from '../schema'

/** Drop repeated sources, and any that are missing. */
function unique(sources: (Source | null | undefined)[]): Source[] {
  const seen = new Set<string>()
  return sources.filter((s): s is Source => Boolean(s) && !seen.has(s!.url) && Boolean(seen.add(s!.url)))
}

/** The body's own page, which is where its summary comes from. */
function officialPage(inst: Institution | undefined): Source | undefined {
  const url = inst?.links.official_page
  return inst && url ? { title: `${inst.name} (official page)`, url } : undefined
}

function InstLink({ id }: { id: string }) {
  const inst = findInstitution(id)
  return inst ? (
    <Link className="text-link" to={`/institutions/${inst.id}`}>
      {inst.name}
    </Link>
  ) : null
}

const and = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

type Step = { title: string; body: ReactNode; sources: Source[]; next: { label: string; to: string; scrollTo?: string } }

/** Every statement here restates a sourced field in data/; the steps carry those sources. */
function steps(): Step[] {
  const elected = institutions.filter(isElected)
  const total = budget.shares.reduce((n, s) => n + s.levy, 0)
  const landUse = institutions.filter((i) => i.category === 'land-use')
  const contracted = services.filter((s) => s.layer === 'contracted')
  const health = findInstitution('board-of-health')
  const library = findInstitution('library-board-of-trustees')

  return [
    {
      title: `Voters elect ${elected.length === 2 ? 'two' : elected.length} bodies`,
      body: (
        <>
          {elected.map((inst, i) => (
            <span key={inst.id}>
              {i > 0 && ' and the '}
              {i === 0 && 'The '}
              <InstLink id={inst.id} />
            </span>
          ))}{' '}
          are elected by voters. Each sets its own budget.
        </>
      ),
      sources: unique([
        ...elected.map((i) => i.seated_source),
        ...budget.shares.filter((s) => elected.some((i) => i.id === s.institution)).map((s) => s.pays_source),
      ]),
      next: { label: 'See how it fits together', to: '/', scrollTo: 'map' },
    },
    {
      title: `Your property tax bill has ${budget.shares.length === 3 ? 'three' : budget.shares.length} parts`,
      body: (
        <>
          In {budget.tax_year}, {and.format(budget.shares.map((s) => `the ${s.name.toLowerCase()} took ${((s.levy / total) * 100).toFixed(1)}%`))}{' '}
          of the property tax levy. They are separate budgets, set by {and.format(budget.shares.map((s) => s.set_by))}.
        </>
      ),
      sources: unique(budget.sources.slice(0, 1)),
      next: { label: 'Where the money goes', to: '/budget' },
    },
    {
      title: 'Changes to a property go through the land-use bodies',
      body: (
        <ul className="list">
          {landUse.map((inst) => (
            <li key={inst.id}>
              <span>
                <InstLink id={inst.id} />: {inst.summary}
              </span>
            </li>
          ))}
        </ul>
      ),
      sources: unique(landUse.map(officialPage)),
      next: { label: 'Find who to ask about a project', to: '/permits' },
    },
    {
      title: 'Some services come from neighbouring towns',
      body: (
        <ul className="list">
          {contracted.map((p) => (
            <li key={p.id}>
              <span>
                <Link className="text-link" to={`/services/${p.id}`}>
                  {p.name}
                </Link>
                : {p.summary}
              </span>
            </li>
          ))}
          {health && (
            <li>
              <span>
                <InstLink id={health.id} />: {health.summary}
              </span>
            </li>
          )}
          {library && (
            <li>
              <span>
                The library has its own board, the <InstLink id={library.id} />.
              </span>
            </li>
          )}
        </ul>
      ),
      sources: unique([...contracted.map((p) => p.sources[0]), officialPage(health), officialPage(library)]),
      next: { label: 'Glen Ridge at a glance', to: '/at-a-glance' },
    },
    {
      title: 'You can take part, even if you never speak',
      body: <>Meetings are open to the public, and the Council and the school board take public comment at every one.</>,
      sources: unique(guide.meeting_basics.slice(0, 2).flatMap((b) => b.sources)),
      next: { label: 'Read the first-meeting guide', to: '/first-meeting' },
    },
  ]
}

export default function Tour() {
  useTitle('New here? Start with the tour')
  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › Everyday questions › Newcomer tour
        </nav>
        <div className="stack stack--sm">
          <h1>New here? Start with the tour</h1>
          <p className="lede">Five things to know about how Glen Ridge is run, each with a place to read more.</p>
        </div>
      </div>

      <div className="container section">
        <ol className="steps measure">
          {steps().map((step) => (
            <li key={step.title}>
              <div className="stack stack--sm">
                <div>
                  <strong>{step.title}</strong>
                  <div className="muted">{step.body}</div>
                </div>
                <Link className="text-link" to={step.next.to} state={step.next.scrollTo ? { scrollTo: step.next.scrollTo } : undefined}>
                  {step.next.label} →
                </Link>
                <SourceLinks sources={step.sources} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
