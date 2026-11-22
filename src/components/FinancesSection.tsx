import { finances, formatDate } from '../data'
import type { Indicator } from '../schema'
import SourceLinks from './SourceLinks'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function pct(n: number): string {
  // Small shares get two decimals so 0.20% does not read as 0.2%.
  return `${(n * 100).toFixed(n < 0.01 ? 2 : 1)}%`
}

function display(ind: Indicator): string {
  if (ind.format === 'text') return ind.text_value ?? ''
  if (ind.format === 'dollars') return money.format(ind.value ?? 0)
  return pct(ind.value ?? 0)
}

/** Glen Ridge's value against the peer range, as a labeled bar plus plain text. */
function PeerRange({ ind }: { ind: Indicator }) {
  if (ind.peer_median === undefined) return null
  const { value = 0, peer_median: median, peer_low: low, peer_high: high } = ind
  const text =
    low !== undefined && high !== undefined
      ? `Peer median ${pct(median)}, range ${pct(low)} to ${pct(high)}`
      : `Peer median ${pct(median)}`
  if (low === undefined || high === undefined) return <p className="fine">{text}</p>

  const lo = Math.min(low, value)
  const hi = Math.max(high, value)
  const at = (n: number) => `${hi === lo ? 50 : ((n - lo) / (hi - lo)) * 100}%`
  return (
    <div className="peer-range">
      <div className="peer-range__track" aria-hidden="true">
        <span className="peer-range__band" style={{ left: at(low), width: `calc(${at(high)} - ${at(low)})` }} />
        <span className="peer-range__median" style={{ left: at(median) }} />
        <span className="peer-range__gr" style={{ left: at(value) }} />
      </div>
      <p className="fine">
        {text}. <span className="peer-range__key">●</span> Glen Ridge
      </p>
    </div>
  )
}

export default function FinancesSection() {
  return (
    <section className="container section stack" aria-labelledby="finances-heading">
      <div className="stack stack--sm">
        <div className="eyebrow">Mayor and Borough Council</div>
        <h2 id="finances-heading">Borough finances by the numbers</h2>
        <p className="muted measure">{finances.intro}</p>
        <p className="fine">
          Budget year {finances.budget_year}. Compared with: {finances.peers.join(', ')}. Last verified{' '}
          <time dateTime={finances.last_verified}>{formatDate(finances.last_verified)}</time>.
        </p>
      </div>

      <div className="grid">
        {finances.indicators.map((ind) => (
          <article key={ind.id} className="card stack stack--sm" aria-labelledby={`fin-${ind.id}`}>
            <h3 id={`fin-${ind.id}`} className="card__label">
              {ind.name}
            </h3>
            <div className="fin-value">{display(ind)}</div>
            <PeerRange ind={ind} />
            <p className="muted">{ind.detail}</p>
            <SourceLinks sources={ind.sources} />
          </article>
        ))}
      </div>

      {finances.needs_verification.length > 0 && (
        <div className="card stack stack--sm">
          <h3 className="card__label">Not yet confirmed</h3>
          <ul className="list">
            {finances.needs_verification.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
