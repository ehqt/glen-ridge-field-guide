import { Link } from 'react-router-dom'
import { calendar, findInstitution, formatDate, institutions, NOT_CONFIRMED, useTitle } from '../data'
import SourceLinks from '../components/SourceLinks'

/** Today as YYYY-MM-DD in the visitor's own time zone, so past dates drop off. */
function today(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function CalendarPage() {
  useTitle('Civic calendar')
  const now = today()
  const sorted = [...institutions].sort((a, b) => a.name.localeCompare(b.name))
  const upcoming = institutions
    .flatMap((inst) => (inst.meets.dates ?? []).map((d) => ({ ...d, inst })))
    .filter((d) => d.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › Everyday questions › Calendar
        </nav>
        <div className="stack stack--sm">
          <h1>Civic calendar</h1>
          <p className="lede">When each body meets, the dated meetings coming up, and what comes round every year.</p>
          <p className="fine">Dates and times can change. Check the official source before you go.</p>
        </div>
      </div>

      <div className="container columns">
        <div className="columns__main stack stack--lg">
          <section className="stack" aria-labelledby="regular-heading">
            <h2 id="regular-heading">Regular meetings</h2>
            <ul className="rows">
              {sorted.map((inst) => (
                <li key={inst.id} className="row">
                  <div className="row__when">
                    <Link className="text-link" to={`/institutions/${inst.id}`}>
                      {inst.name}
                    </Link>
                  </div>
                  <div className="row__what">
                    <div className="row__title">
                      {inst.meets.schedule ?? <span className="unconfirmed">{NOT_CONFIRMED}</span>}
                    </div>
                    {inst.meets.location && <div className="muted">{inst.meets.location}</div>}
                    {inst.meets.schedule_note && <div className="fine">{inst.meets.schedule_note}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="stack" aria-labelledby="upcoming-heading">
            <h2 id="upcoming-heading">Dated meetings coming up</h2>
            {upcoming.length ? (
              <ul className="rows">
                {upcoming.map((d) => (
                  <li key={d.inst.id + d.date} className="row">
                    <div className="row__when row__when--date">
                      <time dateTime={d.date}>{formatDate(d.date)}</time>
                    </div>
                    <div className="row__what">
                      <div className="row__title">{d.inst.name}</div>
                      {d.note && <div className="muted">{d.note}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No dated meetings are on file right now.</p>
            )}
            <p className="fine">
              Only bodies that publish a list of dates appear here. For the others, use the regular schedule above.
            </p>
          </section>

          <section className="stack" aria-labelledby="yearly-heading">
            <h2 id="yearly-heading">Every year</h2>
            <ul className="rows">
              {calendar.map((item) => {
                const inst = findInstitution(item.institution ?? undefined)
                return (
                  <li key={item.title} className="row">
                    <div className="row__when row__when--date">{item.when}</div>
                    <div className="row__what stack stack--sm">
                      <div>
                        <div className="eyebrow">{item.kind}</div>
                        <div className="row__title">{item.title}</div>
                        <div className="muted">{item.note}</div>
                      </div>
                      {inst && (
                        <Link className="text-link" to={`/institutions/${inst.id}`}>
                          About the {inst.name} →
                        </Link>
                      )}
                      <SourceLinks sources={item.sources} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        <aside className="columns__side stack">
          <section className="card stack stack--sm" aria-labelledby="missing-heading">
            <h2 id="missing-heading" className="card__title">
              Not here yet
            </h2>
            <p className="muted">
              Election dates and property tax due dates are not listed, because this guide has not yet sourced them.
              Your tax bill and the county clerk have the official dates.
            </p>
          </section>
          <section className="card card--ink stack stack--sm" aria-labelledby="feed-heading">
            <h2 id="feed-heading" className="card__title">
              Add it to your calendar
            </h2>
            <p>A calendar feed you can subscribe to is planned for later.</p>
          </section>
          <section className="card stack stack--sm" aria-labelledby="related-heading">
            <h2 id="related-heading" className="card__title">
              Related
            </h2>
            <ul className="link-list">
              <li>
                <Link className="text-link" to="/budget">
                  Where the money goes →
                </Link>
              </li>
              <li>
                <Link className="text-link" to="/first-meeting">
                  Your first public meeting →
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
