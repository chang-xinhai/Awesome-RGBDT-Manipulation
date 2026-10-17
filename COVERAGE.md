# Coverage and evidence boundary

Review cutoff: 2026-10-17. 333 unique records; 43 benchmark records; 284 policy records; 12 supporting resources. Collection and category counts overlap.

## Search areas

- Visuo-Tactile Benchmarks: 18 records with this classification.
- Precision and Assembly: 23 records with this classification.
- Dexterous Manipulation: 10 records with this classification.
- General Manipulation: 10 records with this classification.
- Robustness and Evaluation: 11 records with this classification.
- Supporting Tools and Data: 12 records with this classification.
- Visuo-Tactile Policy Learning: 33 records with this classification.
- Tactile VLA and World-Action Models: 31 records with this classification.
- RGB-D and 3D Policies: 65 records with this classification.
- Visual Precision and Reinforcement Learning: 13 records with this classification.
- Agent / RSI / ICL: 88 records with this classification.
- Generalist Policy Foundations: 105 records with this classification.

## Benchmark-to-policy source audit

Paper baselines, leaderboard participants and adapter registries are distinct sources. Integration support does not establish an evaluated result. Counts below refer to named source aliases, with overlaps and version aliases retained; multiple names may map to one canonical work. Full mappings are stored in [data/policy-source-audit.json](data/policy-source-audit.json).

| Primary source | Source type | Aliases mapped |
| :-- | :-- | :-- |
| [RoboTwin 2.0 paper policy comparison](https://arxiv.org/abs/2506.18088) | paper-baselines | 5 / 5 |
| [RoboTwin2 leaderboard: joint 50-task](https://robotwin-platform.github.io/data/robotwin_leaderboard.json) | leaderboard | 19 / 20 |
| [RoboTwin2 leaderboard: single-task](https://robotwin-platform.github.io/data/robotwin_leaderboard.json) | leaderboard | 5 / 5 |
| [RoboDojo paper: simulation baselines](https://arxiv.org/abs/2607.04434) | paper-baselines | 30 / 30 |
| [RoboDojo paper: real-robot baselines](https://arxiv.org/abs/2607.04434) | paper-baselines | 10 / 10 |
| [RoboDojo live leaderboard: simulation](https://robodojo-benchmark.com/data/leaderboard.generated.json) | leaderboard | 56 / 58 |
| [RoboDojo live leaderboard: real robots](https://robodojo-benchmark.com/data/leaderboard.generated.json) | leaderboard | 11 / 11 |
| [XPolicyLab integrated adapter registry](https://github.com/XPolicyLab/XPolicyLab) | adapter-registry | 63 / 63 |

## Evidence methodology

Search recent and foundational work independently across benchmark and policy families. Follow public citation chains, official task registries, repository installation instructions, release branches, model cards, appendices and actual license files. Cross-review simulator versions, real-vs-simulation claims, task scope, deployed sensing and resource accounting.

## Explicit boundaries

Standalone sensor hardware, representation-only pretraining, medical palpation, locomotion, haptics and generic depth-estimation literature are not exhaustively indexed. Selected supporting resources contextualize manipulation work.

Task labels can refer to distinct suites, released registries, evaluated subsets or examples. They are never pooled into a global count of independent tasks. A paper can introduce both a benchmark and a policy without becoming two unique paper records.

Training cost and component sizes are often undisclosed. Not reported and Not verified remain visible. No missing value is estimated from another implementation.

## Figures

Main benchmark figures show task sets, capability taxonomies or physical evaluation setups. Main policy figures show architecture, learning/control pipelines or the author system diagram. Figure provenance is stored in data/media.json.

## Maintenance

Edit the structured source, retain field evidence and scope, regenerate README, run data/build/browser checks, then review the resulting diff. scripts/discover.py can retrieve candidate papers from the official arXiv API; it never adds unreviewed results to the public catalog.
