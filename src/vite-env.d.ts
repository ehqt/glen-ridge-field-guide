type FieldGuideInstitution = import('./schema').Institution
type FieldGuidePlanned = import('./schema').Planned
type FieldGuideBudget = import('./schema').Budget
type FieldGuideCalendarItem = import('./schema').CalendarItem
type FieldGuideGuide = import('./schema').Guide
type FieldGuideService = import('./schema').Service

declare module 'virtual:field-guide-data' {
  export const institutions: FieldGuideInstitution[]
  export const services: FieldGuideService[]
  export const planned: FieldGuidePlanned[]
  export const budget: FieldGuideBudget
  export const calendar: FieldGuideCalendarItem[]
  export const guide: FieldGuideGuide
}
