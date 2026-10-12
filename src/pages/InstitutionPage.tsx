import { Link, useParams } from 'react-router-dom'
import { findInstitution, formatDate, NOT_CONFIRMED, useTitle } from '../data'
import { CATEGORIES } from '../categories'
import SourceLinks from '../components/SourceLinks'
import type { Person } from '../schema'
import NotFound from './NotFound'

const LINK_LABELS: Record<string, string> = {
  official_page: 'Official page',
  bylaws: 'Bylaws',
  members: 'Members',
  meeting_procedures: 'Meeting procedures',
  agendas: 'Agendas',
  agendas_url: 'Agendas',
  minutes: 'Minutes',
  meetings_url: 'Meetings',
  minutes_example: 'Example minutes',
  agenda_example: 'Example agenda',
  budget: 'Budget',
  board_goals: 'Board goals',
  policies: 'Policies',
  legal_notices: 'Legal notices',
}

function linkLabel(key: string) {
  const label = LINK_LABELS[key] ?? key.replace(/_/g, ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function Unconfirmed() {
  return <span className="unconfirmed">{NOT_CONFIRMED}</span>
}

function Roster({ caption, people }: { caption: string; people: Person[] }) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p, i) => (
            <tr key={i}>
              <th scope="row">
                {p.name ?? <Unconfirmed />}
                {p.credentials && <span className="muted">, {p.credentials}</span>}
              </th>
              <td>{p.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function InstitutionPage() {
  const inst = findInstitution(useParams().id)
  useTitle(inst?.name ?? 'Page not found')
  if (!inst) return <NotFound />

  const limits = inst.limits.filter((l) => l !== null)
  const links = Object.entries(inst.links).filter((e): e is [string, string] => e[1] !== null)
  const contact = Object.entries(inst.how_to_engage.contact ?? {}).filter((e): e is [string, string] => e[1] !== null)
  const { apply } = inst.how_to_engage

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › {CATEGORIES[inst.category]} › {inst.name}
        </nav>
        <div className="page-head__row">
          <div className="page-head__title stack stack--sm">
            <div className="eyebrow">{CATEGORIES[inst.category]}</div>
            <h1>{inst.name}</h1>
            <p className="lede">{inst.summary}</p>
            {inst.aliases.length > 0 && <p className="fine">Also called: {inst.aliases.join(', ')}</p>}
          </div>
          <div className="card verified">
            <div>
              <strong>Last verified:</strong> <time dateTime={inst.last_verified}>{formatDate(inst.last_verified)}</time>
            </div>
            {inst.verification_level && (
              <div>
                <strong>Coverage:</strong> {inst.verification_level}
              </div>
            )}
            <div>
              <strong>Source:</strong>{' '}
              <a className="text-link" href={inst.sources[0].url}>
                {inst.sources[0].title}
              </a>
            </div>
            <Link className="text-link" to="." state={{ scrollTo: 'sources' }}>
              All sources and open questions ↓
            </Link>
            <Link className="text-link" to="/report" state={{ about: inst.name }}>
              Spot an error? Report it →
            </Link>
          </div>
        </div>
      </div>

      <div className="container columns">
        <div className="columns__main stack stack--lg">
          <section className="stack" aria-labelledby="powers-heading">
            <h2 id="powers-heading">What it can and can’t decide</h2>
            <div className="pair">
              <div className="card">
                <h3 className="card__label card__label--can">Can decide</h3>
                {inst.powers.length ? (
                  <ul className="list">
                    {inst.powers.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <Unconfirmed />
                )}
              </div>
              <div className="card">
                <h3 className="card__label card__label--cant">Can’t decide</h3>
                {limits.length ? (
                  <ul className="list">
                    {limits.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                ) : (
                  <Unconfirmed />
                )}
              </div>
            </div>
          </section>

          <section className="stack" aria-labelledby="roster-heading">
            <h2 id="roster-heading">Who sits on it</h2>
            {inst.roster_as_of !== undefined && (
              <p className="fine">Roster as published for {inst.roster_as_of}. It may have changed since.</p>
            )}
            {(inst.how_seated || inst.appointed_by) && (
              <p className="muted">
                {inst.how_seated ?? `Appointed by: ${inst.appointed_by}.`}
                {typeof inst.member_terms === 'string' && ` Terms: ${inst.member_terms}.`}
              </p>
            )}
            <Roster caption={`Members of the ${inst.name}`} people={inst.members} />
            {inst.professionals.length > 0 && (
              <>
                <h3>Staff and professionals</h3>
                <Roster caption={`Staff and professionals of the ${inst.name}`} people={inst.professionals} />
              </>
            )}
          </section>

          {inst.notes.map((note) => (
            <section key={note.title} className="stack" aria-label={note.title}>
              <h2>{note.title}</h2>
              <div className="card stack stack--sm">
                <p>{note.body}</p>
                <SourceLinks sources={note.sources} />
              </div>
            </section>
          ))}

          <section id="sources" tabIndex={-1} className="stack" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Sources</h2>
            <div className="card stack stack--sm">
              <ul className="list">
                {inst.sources.map((s) => (
                  <li key={s.url}>
                    <a className="text-link" href={s.url}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              {inst.needs_verification.length > 0 && (
                <>
                  <h3 className="card__label">Not yet confirmed</h3>
                  <ul className="list">
                    {inst.needs_verification.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>

        <aside className="columns__side stack">
          <section className="card stack stack--sm" aria-labelledby="meetings-heading">
            <h2 id="meetings-heading" className="card__title">
              Meetings
            </h2>
            <dl className="facts">
              <dt>When</dt>
              <dd>{inst.meets.schedule ?? <Unconfirmed />}</dd>
              <dt>Where</dt>
              <dd>{inst.meets.location ?? <Unconfirmed />}</dd>
              {inst.meets.quorum != null && (
                <>
                  <dt>Quorum</dt>
                  <dd>{inst.meets.quorum} members</dd>
                </>
              )}
            </dl>
            {inst.meets.schedule_note && <p className="fine">{inst.meets.schedule_note}</p>}
            {inst.meets.location_note && <p className="fine">{inst.meets.location_note}</p>}
            <div className="placeholder">Meeting calendar: coming later</div>
          </section>

          <section className="card stack stack--sm" aria-labelledby="engage-heading">
            <h2 id="engage-heading" className="card__title">
              How to take part
            </h2>
            <dl className="facts">
              <dt>Public comment</dt>
              <dd>{inst.how_to_engage.public_comment ?? <Unconfirmed />}</dd>
              {inst.how_to_engage.written_comment && (
                <>
                  <dt>Written comments</dt>
                  <dd>{inst.how_to_engage.written_comment}</dd>
                </>
              )}
              {inst.how_to_engage.notice && (
                <>
                  <dt>Notice</dt>
                  <dd>{inst.how_to_engage.notice}</dd>
                </>
              )}
              {apply && (
                <>
                  <dt>Applying</dt>
                  <dd>
                    <ul className="list">
                      {[apply.where, apply.format, apply.fees && `Fees: ${apply.fees}`, ...(apply.rules ?? [])]
                        .filter((x): x is string => Boolean(x))
                        .map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                    </ul>
                  </dd>
                </>
              )}
              {inst.how_to_engage.transcripts && (
                <>
                  <dt>Transcripts</dt>
                  <dd>{inst.how_to_engage.transcripts}</dd>
                </>
              )}
              {contact.map(([key, value]) => (
                <div key={key} className="facts__group">
                  <dt>{linkLabel(key)}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {links.length > 0 && (
            <section className="card stack stack--sm" aria-labelledby="links-heading">
              <h2 id="links-heading" className="card__title">
                Official links
              </h2>
              <ul className="link-list">
                {links.map(([key, url]) => (
                  <li key={key}>
                    <a className="text-link" href={url}>
                      {linkLabel(key)} →
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </>
  )
}
