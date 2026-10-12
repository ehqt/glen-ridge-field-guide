import type { ReactNode } from 'react'
import type { CategoryId } from '../categories'

// Simple line icons, one per body, drawn on a 24px grid. They are
// decoration only: the name always sits beside them, so they are hidden
// from screen readers.
const ICONS: Record<string, ReactNode> = {
  // Columned hall
  'mayor-and-council': (
    <>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 20h18" />
    </>
  ),
  // Mortarboard
  'board-of-education': (
    <>
      <path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" />
      <path d="M6.5 11.8V16c1.5 1.4 3.4 2 5.5 2s4-.6 5.5-2v-4.2" />
      <path d="M22 9.5V15" />
    </>
  ),
  // Balance scale
  'board-of-adjustment': (
    <>
      <path d="M12 4v16M7 20h10M5 7h14" />
      <path d="M5 7 2.5 13a2.6 2.6 0 0 0 5 0L5 7ZM19 7l-2.5 6a2.6 2.6 0 0 0 5 0L19 7Z" />
    </>
  ),
  // Folded map
  'planning-board': (
    <>
      <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </>
  ),
  // Gabled house
  'historic-preservation-commission': (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v10h13V10" />
      <path d="M10 20v-5.5h4V20M12 8.5v1.5" />
    </>
  ),
  // Tree
  'shade-tree-commission': (
    <>
      <path d="M12 21v-7" />
      <path d="M12 3a5 5 0 0 0-4.6 7A4 4 0 0 0 9 16h6a4 4 0 0 0 1.6-6A5 5 0 0 0 12 3Z" />
      <path d="M12 14.5 14.5 12" />
    </>
  ),
  // Heart with a pulse line
  'board-of-health': (
    <>
      <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
      <path d="M7.5 12h2.5l1.5-2.5 1.5 4 1-1.5h2.5" />
    </>
  ),
  // Open book
  'library-board-of-trustees': (
    <>
      <path d="M12 6.5C10.3 5.2 7.5 4.8 4 5v13c3.5-.2 6.3.2 8 1.5 1.7-1.3 4.5-1.7 8-1.5V5c-3.5-.2-6.3.2-8 1.5Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  // Courthouse dome
  'essex-county': (
    <>
      <path d="M6 11a6 6 0 0 1 12 0" />
      <path d="M12 3v2M4 11h16M6 11v7M10 11v7M14 11v7M18 11v7M3 20h18" />
    </>
  ),
  // Shield
  police: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 2.9 7.7 7 9.5 4.1-1.8 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </>
  ),
  // Flame
  fire: (
    <>
      <path d="M12 3c.5 3.5-4.5 5.5-4.5 10.5a4.5 4.5 0 0 0 9 0c0-2-1-3.5-2-4.5-.2 1.5-1 2.5-2 3 .5-3-.5-6.5-.5-9Z" />
    </>
  ),
}

const BY_CATEGORY: Record<CategoryId, string> = {
  'borough-government': 'mayor-and-council',
  'land-use': 'planning-board',
  schools: 'board-of-education',
  services: 'police',
  'county-state': 'essex-county',
  'civic-groups': 'library-board-of-trustees',
}

/** The icon for a body, by its id, falling back to one for its category. */
export default function Icon({ id, category, size = 'md' }: { id: string; category: CategoryId; size?: 'md' | 'lg' }) {
  return (
    <span className={`icon icon--${size} icon--${category}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[id] ?? ICONS[BY_CATEGORY[category]]}
      </svg>
    </span>
  )
}
