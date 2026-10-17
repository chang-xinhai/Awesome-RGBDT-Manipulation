# Curation methodology

Surveys are reading resources within the existing research categories. Their
details describe literature scope, taxonomy, selection and evidence boundaries,
and their conceptual diagrams are labeled accordingly. They do not introduce
deployment observations or increase the executable-policy count. Survey
reference audits preserve indexed methods, scope exclusions, background,
adjacent data resources and candidates; method specifications still require
original primary sources.

## Research boundary

The main collections are **Benchmarks** and **Policies** for precise and
contact-rich robotic manipulation. They cover RGB, depth, tactile sensing and
force feedback, relevant visual/3D/RL foundations, and generalist policies that
can contextualize manipulation evaluation. Selected supporting simulators,
datasets and perception tests are explicitly labeled.

Categories are discovery routes, not mutually exclusive scientific variables.
Environment, embodiment, observation modality, policy family, release and date
are stored independently. A paper can contribute a benchmark and a policy while
remaining one canonical work.

## Source hierarchy

1. Primary paper, proceedings, journal or technical report.
2. Official author, laboratory or company project and repository.
3. Official model cards, data cards, versioned documentation and actual licenses.

Secondary awesome lists and paper feeds discover candidates. They do not prove
versions, capabilities, licensing, costs or release availability. Bibliographic
dates use the first public paper version when verified; later revisions can
support corrected technical facts without changing that date.

## Benchmark records

Record the suite's simulator and version, task count and task-list scope,
published task names, capability dimensions, physical setup, sensors, data,
metrics, evaluation protocol and baselines. Preserve full-suite, tested-subset,
code-registry and released-data distinctions. A sensor supported by a simulator
is not automatically a policy input. A replay, perception dataset or physical
kit is not automatically a closed-loop action-policy benchmark.

## Policy records

Record family, base model, model/component size, deployment inputs, action
outputs, learning method, training data, duration, hardware, control/inference
rates and evaluation scope. Distinguish:

- Observed depth, reconstructed depth, RGB-inferred geometry and simulator GT.
- Cutaneous tactile images/arrays, wrist F/T, joint torque and tactile labels.
- Training-time supervisors and deployment-time observations.
- Total parameters, trainable parameters and one component's parameter count.
- Policy inference, action throughput, asynchronous sensory updates and
  low-level servo frequency.
- Full pretraining, downstream fine-tuning and extra adaptation to a variation.
- In-context demonstrations, within-episode interaction history, transferred
  memory/code/prompt changes and parameter updates. These mechanisms do not all
  constitute recursive self-improvement.
- A base language model and an executable robot-agent configuration. Preserve
  the model variant, reasoning effort, tool/action interface, supplied skills
  and adaptation/test protocol when disclosed.

Costs and rates retain experiment qualifiers. Results across different tasks,
data budgets, controllers and embodiments are not a unified leaderboard.

## Representation and predictive models

Tactile encoders, multimodal tactile-language models and manipulation-relevant
depth/3D/4D predictors appear within Policies as **Model** records. Record their
actual inputs, representation or prediction outputs, pretraining resources and
downstream evidence. Keep these interfaces separate from robot actions and
controller frequencies. An encoder used by a downstream policy does not itself
increase the executable-policy count; a model paper can independently introduce
a benchmark. General-purpose vision models need direct manipulation or tactile
representation evidence to fall within this atlas's scope.

## Unknowns and release state

`Not reported` denotes a missing disclosure in the inspected sources.
`Not verified` denotes an unresolved public fact. `Not applicable` is used only
when the artifact or field does not apply. These are not zero values or evidence
that an artifact is closed source. Code, weights and data are assessed
independently, with version and licensing scope retained.

## Figures

Benchmark figures prioritize task coverage and capability taxonomy. Policy
figures prioritize architecture, learning and control pipelines. A system figure
is used when that is the author-provided method overview. Actual video frames
are labeled as such, including whether a demonstration is teleoperated.

Local optimization and cropping preserve the scientific contents. Each figure
records source page, original URL, author credit, visual role, dimensions and
review date. Third-party rights are retained; repository licensing does not
relicense those images.

## Review and maintenance

Research benchmark and policy families independently, expand through citations
and official links, and cross-review the merged records. Audit benchmark paper
baselines, current leaderboard participants and implementation adapters as
separate discovery sources. An adapter establishes integration support, not an
evaluated result. Preserve named aliases and map them to canonical works rather
than making each checkpoint or recipe a duplicate paper.

`data/sensing-source-audit.json` retains tactile-list sections, scoped survey
subsets, recent method bibliographies and official-release discovery trails.
Source aliases may overlap. Indexed records, adjacent sensing/data resources,
scope exclusions and unreviewed candidates remain distinct. Bibliography
extraction is not a claim that every reference has completed primary-source
review; matches require a verified artifact identity or a checked bibliographic
alias, and must never resolve a missing reference URL to its containing survey.

Artifact links always follow Paper, Project, Code, Data, then other artifacts;
the first available artifact is highlighted. Validate schema,
canonical IDs, publication boundaries, sources, local figure files and generated
README consistency. Separately verify rendered search/filter/detail/comparison,
keyboard behavior and desktop/mobile layout. See `COVERAGE.md` for the current
snapshot and `CONTRIBUTING.md` for update commands.
