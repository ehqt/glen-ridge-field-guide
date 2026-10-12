import { useState } from 'react'
import { Link } from 'react-router-dom'
import { institutions, services, useTitle } from '../data'

type Seat = { instId: string; instName: string; role: string; to: string }
type PersonEntry = { name: string; sortKey: string; seats: Seat[] }

/**
 * One entry per person, matched by first and last name so that "Michael P.
 * Zichelli" and "Michael Zichelli" are the same entry. Two different people
 * who share a first and last name would be merged; the page says so.
 */
function buildIndex(): PersonEntry[] {
  const byKey = new Map<string, PersonEntry>()
  const groups = [
    ...institutions.map((i) => ({ id: i.id, name: i.name, to: `/institutions/${i.id}`, people: [...i.members, ...i.professionals] })),
    ...services.map((s) => ({ id: s.id, name: s.name, to: `/services/${s.id}`, people: s.people })),
  ]
  for (const inst of groups) {
    for (const p of inst.people) {
      if (!p.name) continue
      const parts = p.name.replace(/,.*$/, '').split(/\s+/).filter((w) => !/^[A-Z]\.$/.test(w))
      const first = parts[0]
      const last = parts.slice(1).join(' ')
      const key = `${first} ${last}`.toLowerCase()
      const entry = byKey.get(key) ?? { name: p.name, sortKey: `${last} ${first}`.toLowerCase(), seats: [] }
      if (p.name.length > entry.name.length) entry.name = p.name
      entry.seats.push({ instId: inst.id, instName: inst.name, role: p.role, to: inst.to })
      byKey.set(key, entry)
    }
  }
  return [...byKey.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey))
}

const PEOPLE = buildIndex()

export default function PeoplePage() {
  useTitle('People index')
  const [query, setQuery] = useState('')
  const [multiOnly, setMultiOnly] = useState(false)
  const q = query.trim().toLowerCase()
  const shown = PEOPLE.filter(
    (p) =>
      (!multiOnly || new Set(p.seats.map((s) => s.instId)).size > 1) &&
      (!q || p.name.toLowerCase().includes(q) || p.seats.some((s) => `${s.role} ${s.instName}`.toLowerCase().includes(q))),
  )

  return (
    <div className="container section stack">
      <nav aria-label="Breadcrumb" className="fine">
        <Link className="text-link" to="/">
          Home
        </Link>{' '}
        › People
      </nav>
      <div className="stack stack--sm">
        <h1>People index</h1>
        <p className="lede">
          Everyone named on an institution page, in one list, so you can see who serves on more than one body.
        </p>
        <p className="fine">
          Only officials and staff named in official sources are listed. Each role links to the page that gives its
          source. Entries are matched by name, so two people who share a name would appear as one.
        </p>
      </div>

      <div className="search">
        <label htmlFor="people-q">Search by name, role or body</label>
        <input id="people-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="chips">
        <button type="button" className="chip" aria-pressed={multiOnly} onClick={() => setMultiOnly(!multiOnly)}>
          On more than one body
        </button>
      </div>
      <p className="fine" aria-live="polite">
        {shown.length} of {PEOPLE.length} people
      </p>

      {shown.length > 0 ? (
        <div className="table-wrap">
          <table>
            <caption className="visually-hidden">People and the roles they hold</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Roles</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.sortKey}>
                  <th scope="row">{p.name}</th>
                  <td>
                    <ul className="seat-list">
                      {p.seats.map((s) => (
                        <li key={s.instId + s.role}>
                          {s.role},{' '}
                          <Link className="text-link" to={s.to}>
                            {s.instName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">Nobody matches that search.</p>
      )}
    </div>
  )
}
