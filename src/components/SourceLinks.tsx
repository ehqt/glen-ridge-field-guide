import type { Source } from '../schema'

export default function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <span className="fine">
      Source:{' '}
      {sources.map((s, i) => (
        <span key={s.url}>
          {i > 0 && ' · '}
          <a className="text-link" href={s.url}>
            {s.title}
          </a>
        </span>
      ))}
    </span>
  )
}
