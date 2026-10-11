import { Link } from 'react-router-dom'
import { budget, findInstitution, formatDate, useTitle } from '../data'
import SourceLinks from '../components/SourceLinks'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const millions = (n: number) => `$${(n / 1e6).toFixed(1)} million`
const percent = (n: number) => `${(n * 100).toFixed(1)}%`

export default function BudgetPage() {
  useTitle('Where the money goes')
  const total = budget.shares.reduce((n, s) => n + s.levy, 0)

  return (
    <>
      <div className="container page-head stack">
        <nav aria-label="Breadcrumb" className="fine">
          <Link className="text-link" to="/">
            Home
          </Link>{' '}
          › Everyday questions › Budget
        </nav>
        <div className="page-head__row">
          <div className="page-head__title stack stack--sm">
            <h1>Where the money goes</h1>
            <p className="lede">
              Your property tax bill pays for three separate budgets, each set by a different body. Here is who decides
              what, and how the {budget.tax_year} levy split.
            </p>
          </div>
          <div className="card verified">
            <div>
              <strong>Tax year:</strong> {budget.tax_year}
            </div>
            <div>
              <strong>Last verified:</strong>{' '}
              <time dateTime={budget.last_verified}>{formatDate(budget.last_verified)}</time>
            </div>
            <div>
              <strong>Source:</strong>{' '}
              <a className="text-link" href={budget.sources[0].url}>
                {budget.sources[0].title}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container section stack">
        <ul className="split" aria-label={`Share of the ${budget.tax_year} property tax levy`}>
          {budget.shares.map((s) => (
            <li
              key={s.id}
              className={`split__part split__part--${s.id}`}
              style={{ '--share': Math.round((s.levy / total) * 100) } as React.CSSProperties}
            >
              <div className="split__pct">{percent(s.levy / total)}</div>
              <div className="split__name">{s.name}</div>
            </li>
          ))}
        </ul>
        <p className="fine">
          Share of the {budget.tax_year} levy of {millions(total)}. The average residential property, assessed at{' '}
          {money.format(budget.average_residential_value)}, was billed {money.format(budget.average_total_taxes)} before
          credits and deductions, at a total rate of {budget.total_rate.toFixed(3)} per $100 of assessed value.
        </p>

        <div className="triple">
          {budget.shares.map((s) => {
            const inst = s.institution ? findInstitution(s.institution) : undefined
            return (
              <section key={s.id} className="card budget-card" aria-labelledby={`budget-${s.id}`}>
                <div className="eyebrow">Set by {s.set_by}</div>
                <h2 id={`budget-${s.id}`} className="budget-card__name">
                  {s.name}
                </h2>
                <p className="muted">{s.pays}</p>
                <SourceLinks sources={[s.pays_source]} />
                {inst && (
                  <Link className="text-link" to={`/institutions/${inst.id}`}>
                    About the {inst.name} →
                  </Link>
                )}
                <dl className="facts">
                  <dt>{budget.tax_year} tax levy</dt>
                  <dd>
                    {money.format(s.levy)}
                    {s.lines.length > 1 && (
                      <ul className="list fine">
                        {s.lines.map((l) => (
                          <li key={l.name}>
                            {l.name}: {money.format(l.levy)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                  <dt>Tax rate</dt>
                  <dd>{s.rate.toFixed(3)} per $100 of assessed value</dd>
                  <dt>On the average residential bill</dt>
                  <dd>{money.format(s.average_taxes)}</dd>
                </dl>
              </section>
            )
          })}
        </div>
      </div>

      <div className="container columns">
        <div className="columns__main stack stack--lg">
          <section className="stack" aria-labelledby="adopt-heading">
            <h2 id="adopt-heading">How a budget gets adopted</h2>
            <ol className="steps">
              {budget.process.map((step) => (
                <li key={step.title}>
                  <div className="stack stack--sm">
                    <div>
                      <strong>{step.title}</strong>
                      <span className="muted">{step.body}</span>
                    </div>
                    <SourceLinks sources={step.sources} />
                  </div>
                </li>
              ))}
            </ol>
            {budget.process_note && <p className="fine">{budget.process_note}</p>}
          </section>

          <section className="stack" aria-labelledby="budget-sources-heading">
            <h2 id="budget-sources-heading">Sources</h2>
            <div className="card stack stack--sm">
              <ul className="list">
                {budget.sources.map((s) => (
                  <li key={s.url}>
                    <a className="text-link" href={s.url}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              {budget.needs_verification.length > 0 && (
                <>
                  <h3 className="card__label">Not yet confirmed</h3>
                  <ul className="list">
                    {budget.needs_verification.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>

        <aside className="columns__side stack">
          <section className="card card--ink stack stack--sm" aria-labelledby="weigh-heading">
            <h2 id="weigh-heading" className="card__title">
              When to weigh in
            </h2>
            <p>
              The public hearing comes before adoption. The borough's budget notice says taxpayers may present
              objections there. Dates are set each year.
            </p>
          </section>
          {budget.latest_note && (
            <section className="card stack stack--sm" aria-labelledby="latest-heading">
              <h2 id="latest-heading" className="card__title">
                What changed for 2026
              </h2>
              <p className="muted">{budget.latest_note.text}</p>
              <SourceLinks sources={[budget.latest_note.source]} />
            </section>
          )}
          <section className="card stack stack--sm" aria-labelledby="notadvice-heading">
            <h2 id="notadvice-heading" className="card__title">
              Not tax advice
            </h2>
            <p className="muted">
              These are borough-wide figures for one year. Your own bill depends on your assessment. Check your bill
              or ask the borough tax office.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}
