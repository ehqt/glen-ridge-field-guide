type FieldGuideInstitution = import('./schema').Institution
type FieldGuidePlanned = import('./schema').Planned
type FieldGuideBudget = import('./schema').Budget
type FieldGuideCalendarItem = import('./schema').CalendarItem

declare module 'virtual:field-guide-data' {
  export const institutions: FieldGuideInstitution[]
  export const planned: FieldGuidePlanned[]
  export const budget: FieldGuideBudget
  export const calendar: FieldGuideCalendarItem[]
}
