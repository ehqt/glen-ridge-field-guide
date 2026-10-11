import { Link } from 'react-router-dom'
import { CATEGORIES } from '../categories'
import { formatDate, institutions, NOT_CONFIRMED, oldestVerified, useTitle } from '../data'
import type { Institution } from '../schema'

/** The first phone and email in the file's contact block, whatever their keys. */
function contactLines(inst: Institution): string[] {
  const entries = Object.entries(inst.how_to_engage.contact ?? {}).filter((e): e is [string, string] => e[1] !== null)
  const phone = entries.find(([key]) => key.includes('phone'))?.[1]
  const email = entries.find(([key]) => key.includes('email'))?.[1]
  return [phone, email].filter((x): x is string => Boolean(x))
}

export default function OnePager() {
  useTitle('Glen Ridge at a glance')
  const verified = oldestVerified()
  const sorted = [...institutions].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

  return (
    <div className="container section stack one-pager">
      <div className="stack stack--sm">
        <h1>Glen Ridge at a glance</h1>
        <p className="lede">Who decides what, when they meet, and how to reach them, on one page.</p>
        <p className="fine">
          An unofficial guide, not affiliated with the Borough of Glen Ridge or the Glen Ridge Public Schools.
          {verified && <> Verified {formatDate(verified)} or later.</>} Meeting times can change, so check the official
          source before you go.
        </p>
        <button type="button" className="button no-print" onClick={() => window.print()}>
          Print this page
        </button>
      </div>

      <div className="table-wrap">
        <table className="one-pager__table">
          <caption className="visually-hidden">Glen Ridge institutions, what they do, when they meet and how to reach them</caption>
          <thead>
            <tr>
              <th scope="col">Body</th>
              <th scope="col">What it does</th>
              <th scope="col">Meets</th>
              <th scope="col">Contact</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((inst) => {
              const contact = contactLines(inst)
              return (
                <tr key={inst.id}>
                  <th scope="row">
                    <Link to={`/institutions/${inst.id}`}>{inst.name}</Link>
                    <span className="one-pager__category">{CATEGORIES[inst.category]}</span>
                  </th>
                  <td>{inst.summary}</td>
                  <td>
                    {inst.meets.schedule ?? <span className="unconfirmed">{NOT_CONFIRMED}</span>}
                    {inst.meets.location && <span className="one-pager__where">{inst.meets.location}</span>}
                  </td>
                  <td>
                    {contact.length ? (
                      contact.map((line) => (
                        <span key={line} className="one-pager__line">
                          {line}
                        </span>
                      ))
                    ) : (
                      <span className="unconfirmed">{NOT_CONFIRMED}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
