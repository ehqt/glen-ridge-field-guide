import { Link } from 'react-router-dom'
import { formatDate, guide, institutions, NOT_CONFIRMED, useTitle } from '../data'
import SourceLinks from '../components/SourceLinks'
import type { Institution } from '../schema'

/** Where a body posts its agendas, or failing that its official page. */
function agendaLink(inst: Institution): { label: string; url: string } | undefined {
  const agendas = inst.links.agendas_url ?? inst.links.agendas
  if (agendas) return { label: 'Agendas', url: agendas }
  const page = inst.links.official_page
  return page ? { label: 'Official page', url: page } : undefined
}

export default function FirstMeeting() {
  useTitle('Your first public meeting')
  const sorted = [...institutions].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › Everyday questions › First meeting
        </nav>
        <div className="stack stack--sm">
          <h1>Your first public meeting</h1>
          <p className="lede">
            What state law says about attending and speaking, and the rules each Glen Ridge body has published for
            itself.
          </p>
          <p className="fine">
            Last verified {formatDate(guide.last_verified)}. Rules and times can change. Check the agenda before you
            go.
          </p>
        </div>
      </div>

      <div className="container columns">
        <div className="columns__main stack stack--lg">
          <section className="stack" aria-labelledby="basics-heading">
            <h2 id="basics-heading">What to expect</h2>
            <ol className="steps">
              {guide.meeting_basics.map((item) => (
                <li key={item.title}>
                  <div className="stack stack--sm">
                    <div>
                      <strong>{item.title}</strong>
                      <span className="muted">{item.body}</span>
                    </div>
                    <SourceLinks sources={item.sources} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="stack" aria-labelledby="bodies-heading">
            <h2 id="bodies-heading">Body by body</h2>
            <ul className="rows">
              {sorted.map((inst) => {
                const link = agendaLink(inst)
                return (
                  <li key={inst.id} className="row">
                    <div className="row__when">
                      <Link className="text-link" to={`/institutions/${inst.id}`}>
                        {inst.name}
                      </Link>
                    </div>
                    <div className="row__what stack stack--sm">
                      <div>
                        <div className="row__title">
                          {inst.meets.schedule ?? <span className="unconfirmed">{NOT_CONFIRMED}</span>}
                        </div>
                        {inst.meets.location && <div className="muted">{inst.meets.location}</div>}
                      </div>
                      <dl className="facts">
                        <div>
                          <dt>Speaking</dt>
                          <dd>
                            {inst.how_to_engage.public_comment ?? (
                              <span className="unconfirmed">{NOT_CONFIRMED}</span>
                            )}
                          </dd>
                        </div>
                        {inst.how_to_engage.written_comment && (
                          <div>
                            <dt>In writing</dt>
                            <dd>{inst.how_to_engage.written_comment}</dd>
                          </div>
                        )}
                      </dl>
                      {link && (
                        <a className="text-link" href={link.url}>
                          {link.label} →
                        </a>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="fine">
              Each body's own page in this guide lists the sources for its rules and the date they were last checked.
            </p>
          </section>
        </div>

        <aside className="columns__side stack">
          <section className="card stack stack--sm" aria-labelledby="words-heading">
            <h2 id="words-heading" className="card__title">
              Words on the agenda
            </h2>
            <p>Ordinance, resolution, executive session, variance: the glossary explains each, with its source.</p>
<Link className="text-link" to="/glossary">
              Open the glossary →
            </Link>
          </section>
          <section className="card stack stack--sm" aria-labelledby="fm-related-heading">
            <h2 id="fm-related-heading" className="card__title">
              Related
            </h2>
            <ul className="link-list">
              <li>
                <Link className="text-link" to="/calendar">
                  Civic calendar →
                </Link>
              </li>
              <li>
                <Link className="text-link" to="/at-a-glance">
                  Glen Ridge at a glance →
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  )
}
