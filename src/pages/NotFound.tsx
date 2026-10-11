import { Link } from 'react-router-dom'
import { useTitle } from '../data'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="container section stack">
      <h1>Page not found</h1>
      <p className="lede">That page isn’t in the guide.</p>
      <p>
        <Link className="text-link" to="/">
          Back to the home page →
        </Link>
      </p>
    </div>
  )
}
