# Structured record format

`works.json` is an array of canonical research records. `media.json` maps a
record ID to separate `benchmark` and/or `policy` figures. The schema is checked
by `scripts/validate.py`; the website also has strict TypeScript interfaces.

Common metadata: `id`, `name`, optional `benchmarkName` / `policyName`, exact
`title`, first-public `date`, `year`, `collections`, overlapping `categories`,
`resourceType`, `summary`, optional collection-specific `benchmarkSummary` / `policySummary`, `institution`, `venue`, actual/listed `modalities`,
`environments`, `embodiments`, public `links`, `release`, `evidence`, `caveats`,
optional `relatedIds`, and `verified`.

Benchmark fields: `simulator`, `simulatorVersion`, `taskCount`, `tasks`,
`taskListScope`, `capabilities`, `metrics`, `robots`, `sensors`, `data`,
`protocol`, `baselines`.

Policy fields: `family`, `baseModel`, `modelSize`, `inputs`, `outputs`,
`trainingMethod`, `trainingData`, `trainingTime`, `trainingHardware`,
`controlRate`, `evaluation`.

Release fields: `code`, `weights`, `data`, `license`, `notes`. Optional
`releaseByCollection` preserves differences between a suite and its associated
policy implementation. It has the same fields for each applicable collection.

Each evidence item has a primary `url`, readable `label`, supported `fields`
using dotted paths, and optional source-location/measurement-scope `note`.
For example `policy.trainingHardware` identifies a specific field; `policy`
supports the policy section with the stated source's scope.

Figure fields: local `path`, `original` URL, source `page`, author `credit`,
descriptive `alt`, `kind`, `reviewed`, `width`, `height`, and scope/crop `note`.
Some downloads retain `sourceSha256`. Images are optimized local copies, not a
claim to own or relicense the source image.

The `imageCandidates` list records public discovery provenance for future
figure maintenance. The served website catalog omits this working list and
serves only the chosen figure provenance.

Date precision may be `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Genuinely undated
records use an empty date and year zero; the UI renders them as Undated and
sorts them last. All unreported or unresolved values remain explicit strings;
no cost, model size or training-duration estimates are silently filled in.
