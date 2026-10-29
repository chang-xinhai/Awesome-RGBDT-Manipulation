# Coverage and evidence boundary

Review cutoff: 2026-10-30. 767 unique records; 54 benchmark records; 644 policy records; 59 models; 9 surveys; 14 supporting resources. Collection and category counts overlap. Models have representation/prediction interfaces, surveys have review scope, and neither adds to the executable-policy count.

## Search areas

- Visuo-Tactile Benchmarks: 22 records with this classification.
- Precision and Assembly: 26 records with this classification.
- Dexterous Manipulation: 14 records with this classification.
- General Manipulation: 14 records with this classification.
- Robustness and Evaluation: 16 records with this classification.
- Supporting Tools and Data: 14 records with this classification.
- Visuo-Tactile Policy Learning: 84 records with this classification.
- Tactile VLA and World-Action Models: 112 records with this classification.
- RGB-D and 3D Policies: 183 records with this classification.
- Tactile Representations and Pretraining: 45 records with this classification.
- Geometry and Predictive Models: 26 records with this classification.
- Visual Precision and Reinforcement Learning: 50 records with this classification.
- Agent / RSI / ICL: 274 records with this classification.
- Generalist Policy Foundations: 161 records with this classification.

## Benchmark-to-policy source audit

Paper baselines, leaderboard participants and adapter registries are distinct sources. Integration support does not establish an evaluated result. Counts below refer to named source aliases, with overlaps and version aliases retained; multiple names may map to one canonical work. Full mappings are stored in [data/policy-source-audit.json](data/policy-source-audit.json).

| Primary source | Source type | Aliases mapped |
| :-- | :-- | :-- |
| [RoboTwin 2.0 paper policy comparison](https://arxiv.org/abs/2506.18088) | paper-baselines | 5 / 5 |
| [RoboTwin2 leaderboard: joint 50-task](https://robotwin-platform.github.io/data/robotwin_leaderboard.json) | leaderboard | 19 / 20 |
| [RoboTwin2 leaderboard: single-task](https://robotwin-platform.github.io/data/robotwin_leaderboard.json) | leaderboard | 5 / 5 |
| [RoboDojo paper: simulation baselines](https://arxiv.org/abs/2607.04434) | paper-baselines | 30 / 30 |
| [RoboDojo paper: real-robot baselines](https://arxiv.org/abs/2607.04434) | paper-baselines | 10 / 10 |
| [RoboDojo live leaderboard: simulation](https://robodojo-benchmark.com/data/leaderboard.generated.json) | leaderboard | 61 / 62 |
| [RoboDojo live leaderboard: real robots](https://robodojo-benchmark.com/data/leaderboard.generated.json) | leaderboard | 12 / 12 |
| [XPolicyLab integrated adapter registry](https://github.com/XPolicyLab/XPolicyLab/tree/5d0be1499634d3176258c8f2e31f5fe816497b0a/policy) | adapter-registry | 69 / 73 |
| [N₀-Foundation NeoReal / NeoSim baseline rosters](https://arxiv.org/html/2608.29601v2#S6) | paper-baselines | 9 / 9 |
| [Evo-DexBench evaluated policies and No-Touch ablation](https://arxiv.org/abs/2610.21180) | paper-baselines | 6 / 6 |
| [ForceBench simulation comparison](https://arxiv.org/abs/2610.19604) | paper-baselines | 9 / 10 |
| [SparkArena simulation / hardware paper baselines](https://arxiv.org/abs/2610.22342) | paper-baselines | 11 / 13 |
| [RoboDojo official Agent / Agent+VLA / Agent+WAM track](https://robodojo-benchmark.com/leaderboard) | leaderboard | 10 / 10 |

## Survey citation trails

Surveys are reading resources with their own taxonomy and evidence boundaries, not additional executable policies. Reference mappings retain indexed records, scope exclusions, background, adjacent data resources and candidates for separate review. A survey citation is discovery provenance; method specifications use original sources. Full mappings: [data/survey-source-audit.json](data/survey-source-audit.json).

| Survey | References reconciled | Indexed canonical links |
| :-- | :-- | :-- |
| [In-Context Learning for Robots: Methods and Applications](https://arxiv.org/abs/2609.36012) | 412 | 239 |
| [Tactile-Guided Robot Learning: From Representation Learning to Foundation Models](https://arxiv.org/abs/2610.20134) | 195 | 72 |
| [Tactile-based Multimodal Fusion in Embodied Intelligence: A Survey of Vision, Language, and Contact-Driven Paradigms](https://arxiv.org/abs/2605.17336) | 119 | 28 |
| [Towards Forceful Robotic Foundation Models: a Literature Survey](https://arxiv.org/abs/2504.11827) | 109 | 25 |

## Tactile and geometry discovery audit

Source aliases are discovery provenance, not primary method evidence. Indexed mappings, scope exclusions and unverified candidates are retained in [data/sensing-source-audit.json](data/sensing-source-audit.json). Counts overlap across sources.

| Discovery source and scoped branch | Indexed / source aliases |
| :-- | :-- |
| [N₀-Foundation original report and official release](https://github.com/neoteai/N0-Foundation) | 1 / 1 |
| [Awesome-Touch / Visual-Tactile](https://github.com/linchangyi1/Awesome-Touch) | 4 / 19 |
| [Awesome-Touch / Data Collection](https://github.com/linchangyi1/Awesome-Touch) | 24 / 37 |
| [Awesome-Touch / VLA/WM/LLM/VLM](https://github.com/linchangyi1/Awesome-Touch) | 30 / 31 |
| [Awesome-Touch / Dexterous Manipulation](https://github.com/linchangyi1/Awesome-Touch) | 16 / 21 |
| [Awesome-Touch / Manipulation/Grasping](https://github.com/linchangyi1/Awesome-Touch) | 30 / 111 |
| [User seed](https://xsparkai.com/Spark-0/) | 1 / 1 |
| [Primary source expansion / representation cross-review](https://arxiv.org/abs/2607.07287) | 4 / 5 |
| [Primary expansion / official author site](https://arxiv.org/abs/2602.13833) | 2 / 2 |
| [Awesome-Touch representations / reviews and primary-source expansion](https://github.com/linchangyi1/Awesome-Touch) | 38 / 67 |
| [RynnWorld-4D, geometry surveys and original method bibliographies](https://alibaba-damo-academy.github.io/RynnWorld-4D.github.io/) | 54 / 61 |
| [World Models for Robotic Manipulation — geometry reference subset](https://onlinelibrary.wiley.com/doi/10.1002/smb2.70053) | 8 / 8 |
| [Tactile survey representation/control gaps](https://arxiv.org/abs/2605.17336) | 8 / 8 |
| [Tactile-guided survey control gaps](https://arxiv.org/abs/2610.20134) | 10 / 10 |
| [Evo-DexBench KineDex baseline — original policy](https://arxiv.org/abs/2610.21180) | 1 / 1 |
| [Recent official arXiv — scoped sensing/contact additions](https://export.arxiv.org/api/query?search_query=cat%3Acs.RO&sortBy=submittedDate&sortOrder=descending) | 3 / 8 |
| [19 October update: arXiv, Awesome-Touch and official release follow-up](https://github.com/linchangyi1/Awesome-Touch) | 14 / 17 |
| [October21 primary manipulation expansion and independent Agent/RGB-D review](https://arxiv.org/list/cs.RO/recent) | 23 / 26 |
| [Fresh Agent/RGB-D/visual–tactile primary expansion](https://arxiv.org/list/cs.RO/recent) | 26 / 27 |

## Evidence methodology

Search recent and foundational work independently across benchmark and policy families. Follow public citation chains, official task registries, repository installation instructions, release branches, model cards, appendices and actual license files. Cross-review simulator versions, real-vs-simulation claims, task scope, deployed sensing and resource accounting.

## Explicit boundaries

Tactile representation/pretraining and manipulation-relevant geometry models are included with separate model fields. Standalone sensor hardware, medical palpation, locomotion, haptics and generic depth-estimation literature remain outside comprehensive coverage. Selected supporting resources contextualize manipulation work.

Task labels can refer to distinct suites, released registries, evaluated subsets or examples. They are never pooled into a global count of independent tasks. A paper can introduce both a benchmark and a policy without becoming two unique paper records.

Training cost and component sizes are often undisclosed. Not reported and Not verified remain visible. No missing value is estimated from another implementation.

## Figures

Main benchmark figures show task sets, capability taxonomies or physical evaluation setups. Main policy figures show architecture, learning/control pipelines or the author system diagram. Figure provenance is stored in data/media.json.

## Maintenance

Edit the structured source, retain field evidence and scope, regenerate README, run data/build/browser checks, then review the resulting diff. scripts/discover.py can retrieve candidate papers from the official arXiv API; it never adds unreviewed results to the public catalog.
