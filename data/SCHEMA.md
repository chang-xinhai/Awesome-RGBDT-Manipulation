# Structured record format

`works.json` is an array of canonical research records. `media.json` maps a
record ID to separate `benchmark` and/or `policy` figures. The schema is checked
by `scripts/validate.py`; the website also has strict TypeScript interfaces.

`policy-source-audit.json` maps benchmark source aliases to canonical policy
records. Each source has `id`, optional `benchmarkId`, `label`, primary `url`,
`kind` (`paper-baselines`, `leaderboard`, `adapter-registry`), measurement
`scope` and `entries`. An entry has its source `name`, resolved `workId` and/or
a qualifying `note`. An unresolved alias requires a note and does not create
a speculative policy record. Source alias counts are not unique-paper counts.

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

Surveys use `resourceType: survey`, retain the relevant existing collection and
categories, and have a `survey` object instead of `policy` / `benchmark` fields:
`scope`, `taxonomy`, `adaptationRegimes`, `contextSources`, `evaluationAxes`,
`corpus`, `reviewMethod`, and `coverageLimits`. They have no deployment modality
or robot embodiment claim. Their figures may be taxonomy diagrams. Survey
counts are separate from policy counts; mixed comparisons and CSV exports
retain the record type and mark inapplicable fields.

Optional `surveyAuditId` links a survey to a source in
`survey-source-audit.json`. Each source identifies its author inventory,
snapshot and scope. Reference entries retain their original key, number,
title, URL, role, optional method family and disposition (`indexed`,
`outside-scope`, `background`, `adjacent-resource`, `candidate`). Indexed entries
link to a canonical `workId`; every other disposition requires an explanation.
A citation match is discovery provenance, not evidence for a policy's resource
or performance claims.

`sensing-source-audit.json` tracks scoped tactile-list sections, geometry survey
subsets and primary bibliography/release expansion. Its sources retain `id`,
`label`, `url`, `kind`, `scope`, optional `snapshot` and `entries`. Each entry has
`name`, `url`, `status`, `note`, and a `workId` only when indexed. States are
`indexed`, `outside-scope`, `background`, `adjacent-resource`, `candidate` and
`unresolved`. Alias counts can overlap and are not unique-paper totals.

Policy categories include `agent-rsi-icl` for robot agents, feedback-driven
self-improvement and in-context adaptation. These are overlapping routes:
in-context examples, persistent code/memory, prompt optimization and gradient
updates describe different mechanisms. Record the mechanism, deployed action
interface, adaptation/test split and frozen/trainable components in the policy
fields and source qualifications; do not equate all agent work with RSI.

Artifact links are presented in this order: `paper`, `project`, `code`, `data`,
then `weights` and other artifacts. Highlight the first available link. The
website and generator enforce this independently of JSON key insertion order.

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

Supporting representations and predictive models use `resourceType: model` under
Policies, with `model` fields: `role`, `family`, `baseModel`, `modelSize`, `inputs`,
`outputs`, `trainingMethod`, `trainingData`, `trainingTime`, `trainingHardware`,
`inference`, and `evaluation`. These describe the encoder/predictor interface and
its downstream evidence, not fabricated actions or servo rates. A canonical
model paper can also have a `benchmark` role. Models are counted separately from
executable policies. Dedicated routes are `tactile-representation` and
`geometry-models`, with overlap in related categories where useful.
