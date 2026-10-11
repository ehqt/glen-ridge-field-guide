import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useTitle } from '../data'
import { REPORT_EMAIL } from '../site'

export default function ReportError() {
  useTitle('Report an error')
  const about: string = useLocation().state?.about ?? ''
  const [page, setPage] = useState(about)
  const [what, setWhat] = useState('')
  const [source, setSource] = useState('')

  function openEmail(e: FormEvent) {
    e.preventDefault()
    const subject = `Field Guide correction${page ? `: ${page}` : ''}`
    const body = [`Page: ${page || '(not given)'}`, '', 'What needs fixing:', what, '', `Official source: ${source || '(not given)'}`].join('\n')
    window.location.href = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="container section stack">
      <h1>Report an error</h1>
      <p className="lede">
        Something out of date or wrong? Tell us, and include a link to the official source if you have one.
      </p>

      {REPORT_EMAIL === null ? (
        <div className="placeholder">Error reporting is not set up yet.</div>
      ) : (
        <form className="form stack" onSubmit={openEmail}>
          <div className="field">
            <label htmlFor="report-page">Which page or institution?</label>
            <input id="report-page" type="text" value={page} onChange={(e) => setPage(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="report-what">What needs fixing?</label>
            <textarea id="report-what" rows={5} required value={what} onChange={(e) => setWhat(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="report-source">Link to an official source (optional)</label>
            <input id="report-source" type="url" value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
          <button type="submit" className="button">
            Open email to send
          </button>
          <p className="fine">
            This opens your own email app with the report filled in, addressed to {REPORT_EMAIL}. Nothing is sent
            until you press send there, and this site stores nothing you type.
          </p>
        </form>
      )}
    </div>
  )
}
