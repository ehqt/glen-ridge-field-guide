import { useEffect } from 'react'
import { budget, calendar, guide, institutions, planned, services } from 'virtual:field-guide-data'
import type { Institution } from './schema'

export { budget, calendar, guide, institutions, planned, services }

export const NOT_CONFIRMED = 'Not yet confirmed'
export const SITE_NAME = 'Glen Ridge Field Guide'

/** Set the browser tab title for a page; the home page passes nothing. */
export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [title])
}

export function findInstitution(id: string | undefined): Institution | undefined {
  return institutions.find((i) => i.id === id)
}

/** Members with a sourced name. Placeholder seats (name: null) are not counted. */
export function namedMembers(inst: Institution) {
  return inst.members.filter((m) => m.name !== null)
}

export function isElected(inst: Institution): boolean {
  return /^elected\b/i.test(inst.how_seated ?? '')
}

/** Appointed, per a sourced appointed_by in the institution's file. */
export function isAppointed(inst: Institution): boolean {
  return !isElected(inst) && Boolean(inst.appointed_by)
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** The oldest last_verified across all institution files. */
export function oldestVerified(): string | undefined {
  return [...institutions, ...services].map((i) => i.last_verified).sort()[0]
}

export function matchesQuery(inst: Institution, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    inst.name,
    ...inst.aliases,
    inst.summary,
    ...inst.powers,
    ...[...inst.members, ...inst.professionals].map((p) => p.name ?? ''),
  ]
  return haystack.some((s) => s.toLowerCase().includes(q))
}
