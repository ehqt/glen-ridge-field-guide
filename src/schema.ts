// Shape of the hand-curated YAML in data/. Used by the build-time loader
// (plugins/field-guide-data.ts) and, for types only, by the app.
//
// null means "not yet confirmed from a source". Fields stay in the schema
// as null rather than being dropped, and pages show them as placeholders.
import { z } from 'zod'
import { CATEGORIES, type CategoryId } from './categories.ts'

const categoryIds = Object.keys(CATEGORIES) as [CategoryId, ...CategoryId[]]

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'use lowercase-kebab-case')
const text = z.string().trim().min(1)
const maybe = text.nullable()

const person = z.looseObject({
  name: maybe,
  role: text,
  credentials: text.optional(),
  seated_by: maybe.optional(),
  term_ends: z.union([text, z.number()]).nullable().optional(),
})

// Strict: an unquoted comma in a YAML flow mapping silently splits a title
// into extra keys, and this catches it.
const source = z.strictObject({ title: text, url: z.url() })

export const institutionSchema = z.looseObject({
  id,
  name: text,
  aliases: z.array(text).default([]),
  category: z.enum(categoryIds),

  summary: text,
  powers: z.array(text),
  limits: z.array(maybe),

  // Relationship fields drive the map. All may be null until sourced.
  how_seated: text.optional(),
  // The source behind how_seated / appointed_by; shown under the map.
  seated_source: source.optional(),
  appointed_by: maybe.optional(),
  reports_to: maybe.optional(),
  appoints: z.array(text).nullable().optional(),

  members: z.array(person),
  professionals: z.array(person).default([]),
  roster_as_of: z.union([text, z.number()]).optional(),

  meets: z.looseObject({
    schedule: maybe,
    schedule_note: text.optional(),
    location: maybe,
    location_note: text.optional(),
    quorum: z.number().int().positive().nullable().optional(),
  }),

  how_to_engage: z.looseObject({
    public_comment: maybe,
    written_comment: text.optional(),
    notice: text.optional(),
    apply: z
      .looseObject({
        where: text.optional(),
        format: text.optional(),
        fees: text.optional(),
        rules: z.array(text).optional(),
      })
      .optional(),
    transcripts: text.optional(),
    contact: z.record(z.string(), maybe).optional(),
  }),

  links: z.record(z.string(), z.url().nullable()),

  // Required: the build fails without both.
  last_verified: z.iso.date('last_verified must be a YYYY-MM-DD date'),
  verification_level: text.optional(),
  sources: z.array(source).min(1, 'at least one source is required'),
  needs_verification: z.array(text).default([]),
})

export const plannedSchema = z.array(
  z
    .strictObject({
      id,
      name: text,
      category: z.enum(categoryIds),
      layer: z.enum(['appointed', 'department', 'contracted', 'above']).nullable(),
      source: source.optional(),
    })
    .refine((p) => p.layer === null || p.source !== undefined, {
      message: 'an entry with a layer needs the source that backs it',
      path: ['source'],
    }),
)

const dollars = z.number().int().positive()
const rate = z.number().positive()

export const budgetSchema = z.strictObject({
  tax_year: z.number().int(),
  last_verified: z.iso.date('last_verified must be a YYYY-MM-DD date'),
  sources: z.array(source).min(1, 'at least one source is required'),
  net_valuation_taxable: dollars,
  total_rate: rate,
  average_residential_value: dollars,
  average_total_taxes: dollars,
  shares: z
    .array(
      z.strictObject({
        id,
        name: text,
        set_by: text,
        institution: id.nullable(),
        pays: text,
        pays_source: source,
        levy: dollars,
        rate,
        average_taxes: dollars,
        lines: z.array(z.strictObject({ name: text, levy: dollars })).min(1),
      }),
    )
    .min(1),
  latest_note: z.strictObject({ text, source }).optional(),
  process: z.array(z.strictObject({ title: text, body: text, sources: z.array(source).min(1) })).min(1),
  process_note: text.optional(),
  needs_verification: z.array(text).default([]),
})

export type Source = z.infer<typeof source>
export type Budget = z.infer<typeof budgetSchema>
export type Institution = z.infer<typeof institutionSchema>
export type Person = z.infer<typeof person>
export type Planned = z.infer<typeof plannedSchema>[number]
