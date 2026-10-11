export const CATEGORIES = {
  'borough-government': 'Borough government',
  'land-use': 'Land use',
  schools: 'Schools',
  services: 'Services',
  'county-state': 'County and state',
  'civic-groups': 'Civic groups',
} as const

export type CategoryId = keyof typeof CATEGORIES
