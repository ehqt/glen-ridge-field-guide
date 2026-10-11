# Glen Ridge Field Guide

An unofficial, nonpartisan guide to who runs what in Glen Ridge, NJ: what each
board, commission and office does, who sits on it, when it meets, and where to
go for what. Not affiliated with the Borough of Glen Ridge or the Glen Ridge
Public Schools.

Live site: https://ehqt.github.io/glen-ridge-field-guide/

## How it works

A static React + Vite + TypeScript site. All content is hand-curated YAML in
`data/`, read and validated at build time:

- `data/institutions/*.yaml`: one file per institution.
- `data/planned.yaml`: institutions that do not have a page yet.
- `data/budget.yaml`: the property tax split and the budget process.

Every file must list its `sources` and a `last_verified` date, or the build
fails. A field set to `null` means "not yet confirmed from a source" and is
shown that way on the page. Nothing is filled in from memory.

## Develop

```
npm install
npm run dev      # local preview
npm run build    # typecheck, validate the data, build to dist/
```

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Corrections

Use the "Report an error" link on the site, or open an issue here.
