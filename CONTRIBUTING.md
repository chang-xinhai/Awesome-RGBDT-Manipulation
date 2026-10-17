# Contributing

The structured source is `data/works.json`. The README and website are two views
of the same research records. Do not maintain a second, divergent bibliography.

## Add or update a record

1. Update the review cutoff in `data/meta.json` when advancing the snapshot, then find the original paper and official project, repository or model card.
2. Identify the canonical work. Merge a paper's benchmark and policy roles into
   one record, using `benchmarkName` / `policyName` when the contributions have
   different names. Give a new model version its own record only when a distinct
   primary source and contribution justify it.
3. Verify the first public publication date. Use a partial date if that is the
   available precision. Undated works use `date: ""`, `year: 0`.
4. Fill the common metadata and every field in the applicable benchmark and/or
   policy object. Explicitly use `Not reported` or `Not verified`; do not infer
   costs, versions, parameters or sensor use from a neighboring model.
5. Attach primary evidence with the fields it supports. Retain the relevant
   setting, source version and paper/release distinction.
6. Verify code, weights, data and their licenses separately. Use
   `releaseByCollection` when a benchmark and its policy have different release
   scopes.
7. Select an actual author task/taxonomy figure for benchmarks and an actual
   architecture/pipeline figure for policies. Save an optimized local image,
   inspect it visually, and record attribution in `data/media.json`.
8. Regenerate, validate and inspect the changed pages.

When expanding policy coverage, audit benchmark paper tables, official
leaderboards and adapter registries separately. Record which is the source of
each alias; integration alone is not evidence of an evaluated result. Follow
the missing model's original paper/project before adding its factual fields.
Present artifact links as Paper → Project → Code → Data → other artifacts,
highlighting the first available link.

Include relevant surveys in the existing categories using the survey resource
type and review-specific fields. Use their conceptual taxonomy figures; do not
invent model size, deployment inputs or training costs for a literature review.
Reconcile citation trails in `data/survey-source-audit.json`, and return to each
original method paper before adding its technical record. Keep adjacent data,
background references and unreviewed candidates explicitly distinct.

```sh
python3 scripts/generate.py
python3 scripts/validate.py
cd website
npm test
npm run check
npm run build
```

## Review checklist

- Actual deployment inputs versus labels, privileged state or predicted geometry.
- Skin tactile versus wrist force/torque, joint torque and visual contact inference.
- Full task suite versus evaluated subset, code registry and example tasks.
- Reported data scale versus released data; avoid summing overlapping sources.
- Model component size, training setting, inference hardware and control-rate scope.
- Paper simulator versions versus current repository instructions and checkpoints.
- Current paper revisions and renamed manuscripts versus stale project summaries.
- Agent base model versus robot execution harness; in-context learning versus
  code/memory changes versus weight updates, and adaptation/test scene separation.
- Figure contents, crop, legibility, source URL, author credit and original rights.
- Search by task name; collection-specific filters, detail links, comparison,
  saved records, CSV and mobile dialogs.

## Future-paper discovery

`scripts/discover.py` queries the official arXiv API and writes a separate local
candidate file. It does not add or publish records. API rate limits and source errors return a nonzero status with explicit errors in the output; an empty candidate list is not evidence that no new work exists. Review each candidate using
the workflow above. Official source watch links are listed in
`data/watchlist.json`; they provide additional paths for non-arXiv releases.

```sh
python3 scripts/discover.py --since 2026-10-17 --output /tmp/rgbdt-candidates.json
```

The collection is public research reference material. Keep unpublished project
plans, proposed experiments, internal task choices and private communications
out of its records and prose. Repository publication is a separate action;
the current checkout and preview are local only.
