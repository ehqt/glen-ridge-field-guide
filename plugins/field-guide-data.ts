// Reads and validates the YAML in data/ at build time and exposes it as
// `virtual:field-guide-data`. Any invalid file fails the build, including
// one with no `sources` or no `last_verified`.
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { parse } from 'yaml'
import { z } from 'zod'
import { budgetSchema, institutionSchema, plannedSchema } from '../src/schema.ts'

const VIRTUAL_ID = 'virtual:field-guide-data'
const RESOLVED_ID = '\0' + VIRTUAL_ID

function check<T extends z.ZodType>(schema: T, file: string, errors: string[]): z.infer<T> | undefined {
  let raw: unknown
  try {
    raw = parse(readFileSync(file, 'utf8'))
  } catch (e) {
    errors.push(`${file}\n  - not valid YAML: ${(e as Error).message}`)
    return undefined
  }
  const result = schema.safeParse(raw)
  if (result.success) return result.data
  const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(file)'}: ${i.message}`)
  errors.push(`${file}\n${lines.join('\n')}`)
  return undefined
}

export function loadFieldGuideData(root: string) {
  const dir = join(root, 'data', 'institutions')
  const errors: string[] = []

  const institutions = readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .flatMap((f) => {
      const file = join(dir, f)
      const inst = check(institutionSchema, file, errors)
      if (!inst) return []
      if (inst.id !== basename(f, '.yaml')) {
        errors.push(`${file}\n  - id: "${inst.id}" must match the file name`)
      }
      return [inst]
    })

  const plannedFile = join(root, 'data', 'planned.yaml')
  const planned = check(plannedSchema, plannedFile, errors) ?? []

  const seen = new Set(institutions.map((i) => i.id))
  for (const p of planned) {
    if (seen.has(p.id)) errors.push(`${plannedFile}\n  - id: "${p.id}" is used more than once`)
    seen.add(p.id)
  }

  const budgetFile = join(root, 'data', 'budget.yaml')
  const budget = check(budgetSchema, budgetFile, errors)
  for (const share of budget?.shares ?? []) {
    // Lines are rounded to the dollar, so allow a dollar of drift per line.
    const sum = share.lines.reduce((n, l) => n + l.levy, 0)
    if (Math.abs(sum - share.levy) > share.lines.length) {
      errors.push(`${budgetFile}\n  - shares.${share.id}: lines add up to ${sum}, not the levy ${share.levy}`)
    }
    if (share.institution && !seen.has(share.institution)) {
      errors.push(`${budgetFile}\n  - shares.${share.id}.institution: no institution or planned entry "${share.institution}"`)
    }
  }

  if (errors.length) {
    throw new Error(`Field guide data is invalid:\n\n${errors.join('\n\n')}\n`)
  }
  return { institutions, planned, budget: budget! }
}

export function fieldGuideData(): Plugin {
  let root = process.cwd()
  return {
    name: 'field-guide-data',
    configResolved(config) {
      root = config.root
    },
    resolveId(source) {
      return source === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(moduleId) {
      if (moduleId !== RESOLVED_ID) return undefined
      const data = loadFieldGuideData(root)
      return `export const institutions = ${JSON.stringify(data.institutions)}\nexport const planned = ${JSON.stringify(data.planned)}\nexport const budget = ${JSON.stringify(data.budget)}\n`
    },
    configureServer(server) {
      const dataDir = resolve(root, 'data')
      server.watcher.add(dataDir)
      const reload = (file: string) => {
        if (!file.startsWith(dataDir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('change', reload).on('add', reload).on('unlink', reload)
    },
  }
}
