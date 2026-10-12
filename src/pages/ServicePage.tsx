import { Link, useParams } from 'react-router-dom'
import { formatDate, services, useTitle } from '../data'
import { CATEGORIES } from '../categories'
import NotFound from './NotFound'

function label(key: string) {
  const words = key.replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export default function ServicePage() {
  const { id } = useParams()
  const service = services.find((s) => s.id === id)
  useTitle(service?.name ?? 'Page not found')
  if (!service) return <NotFound />

  const links = Object.entries(service.links).filter((e): e is [string, string] => e[1] !== null)

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › {CATEGORIES[service.category]} › {service.name}
        </nav>
        <div className="page-head__row">
          <div className="page-head__title stack stack--sm">
            <div className="eyebrow">
              {service.layer === 'contracted' ? 'Contracted service' : 'Borough department'}
            </div>
            <h1>{service.name}</h1>
            <p className="lede">{service.summary}</p>
            {service.aliases.length > 0 && <p className="fine">Also called: {service.aliases.join(', ')}</p>}
          </div>
          <div className="card verified">
            <div>
              <strong>Last verified:</strong>{' '}
              <time dateTime={service.last_verified}>{formatDate(service.last_verified)}</time>
            </div>
            <div>
              <strong>Source:</strong>{' '}
              <a className="text-link" href={service.sources[0].url}>
                {service.sources[0].title}
              </a>
            </div>
            <Link className="text-link" to="/report" state={{ about: service.name }}>
              Spot an error? Report it →
            </Link>
          </div>
        </div>
      </div>

      <div className="container columns">
        <div className="columns__main stack stack--lg">
          {service.facts.length > 0 && (
            <section className="stack" aria-labelledby="facts-heading">
              <h2 id="facts-heading">What to know</h2>
              <div className="card">
                <ul className="list">
                  {service.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {service.people.length > 0 && (
            <section className="stack" aria-labelledby="people-heading">
              <h2 id="people-heading">Who runs it</h2>
              <div className="table-wrap">
                <table>
                  <caption className="visually-hidden">Leadership of the {service.name}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.people.map((p) => (
                      <tr key={p.name}>
                        <th scope="row">
                          {p.name}
                          {p.credentials && <span className="muted">, {p.credentials}</span>}
                        </th>
                        <td>{p.role}</td>
                        <td>{p.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="stack" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Sources</h2>
            <div className="card stack stack--sm">
              <ul className="list">
                {service.sources.map((s) => (
                  <li key={s.url}>
                    <a className="text-link" href={s.url}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              {service.needs_verification.length > 0 && (
                <>
                  <h3 className="card__label">Not yet confirmed</h3>
                  <ul className="list">
                    {service.needs_verification.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>

        <aside className="columns__side stack">
          <section className="card stack stack--sm" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="card__title">
              How to reach it
            </h2>
            <dl className="facts">
              {Object.entries(service.contact).map(([key, value]) => (
                <div key={key} className="facts__group">
                  <dt>{label(key)}</dt>
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
                      {label(key)} →
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
