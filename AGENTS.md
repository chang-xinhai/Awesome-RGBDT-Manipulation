# Awesome RGBDT Manipulation

Maintain a public-facing research reference, never a private project plan.

## Scope and structure
- Exactly two main collections: Benchmarks and Policies. A canonical work may have both roles.
- `data/works.json` is the single structured source. `README.md`, the complete generated pages under `docs/records/`, and the static website derive from it; regenerate with `python3 scripts/generate.py`.
- `data/media.json` stores per-collection figures and source provenance. Benchmark covers show task coverage/taxonomy; policy covers show architecture/pipeline.
- Supporting simulators, datasets and perception tests have explicit resource types under Benchmarks / Tools & data. Do not count them as closed-loop manipulation benchmarks.
- Surveys use `resourceType: survey` and a `survey` scope/taxonomy object within relevant existing categories. Do not give them fictional policy, training or deployment fields or add them to executable-policy counts. Survey figures may show conceptual taxonomies.
- Scope includes precise/contact-rich manipulation, tactile and force policies, observed RGB-D/3D policies, and relevant generalist/visual/RL foundations. Avoid a generic CV bibliography.
- No unpublished proposed tasks, project-specific guidance, internal meetings, private notes, people assignments or paper strategy.

## Evidence rules
- Public primary paper, official project, repository or model card required. Secondary collections discover candidates only.
- Every quantitative or implementation field must retain source and setting scope. First public paper date; never use discovery/verification date as publication date. Undated = empty date and year 0.
- Never guess simulator versions, hardware, training time, model size, data scale, venue or institution. Use Not reported / Not verified explicitly.
- Separate actual deployment observations from training labels, privileged state and predicted geometry. RGB-inferred geometry is not a measured depth stream. Skin tactile is not wrist F/T or joint torque.
- Separate task registry totals, evaluated subsets, demos and released data; tasks must retain list scope. Do not aggregate overlapping corpora.
- Preserve paper vs current release differences. Version-specific checkpoints, licenses and install instructions matter.
- Code, weights and data releases are independent. Actual LICENSE files outrank contradictory README summaries. Per-collection release fields preserve policy/benchmark differences.
- Audit benchmark paper baselines, official leaderboard participants and adapter registries separately; an integration is not an evaluated result. Map aliases to canonical works.
- Use survey bibliographies to discover and reconcile methods. Store citation dispositions in `data/survey-source-audit.json`; a survey citation does not replace evidence from the original method paper.
- Agent / RSI / ICL records distinguish in-context feedback, code/prompt/memory adaptation and weight updates. Describe the executable robot agent, not only its base LLM.
- Present artifacts as Paper, Project, Code, Data, then other links. Highlight the first available artifact; insertion order must not change this.
- Figures retain source URL, credit and original rights; use real official figures, inspect them visually and optimize local copies. Never synthesize scientific results or pipeline diagrams.

## UI and checks
Preserve the established Ego/UMI atlas design: white background, Source Serif 4 headline, restrained system UI, collection-specific filters/details/comparison, readable figures, keyboard access, responsive layout and reduced motion.
Run `python3 scripts/validate.py`, `npm test`, `npm run check`, `npm run build` and desktop/mobile browser checks. Test search through task names, filter-state restoration, detail deep links, branch-specific comparison, large task lists, figure enlargement, exports and saved records.
When the user requests extensive parallel work, use independent research and cross-review; keep provisional evidence outside public source until resolved.

## Publication
The user authorized GitHub publication and deployment on 2026-10-17 after aligning the atlas with Awesome-Ego-Robotics's approved 80% desktop scale. The public repository is `chang-xinhai/Awesome-RGBDT-Manipulation`; deploy the static website to its GitHub Pages project path. Preserve compact/mobile sizing, use base-aware routes and assets, and run data/build/browser checks before publication. Candidate discovery remains separate from reviewed source; no scheduled research publication is configured.
