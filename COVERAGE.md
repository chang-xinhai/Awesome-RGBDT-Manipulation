# Coverage and evidence boundary

Review cutoff: 2026-10-17. 164 unique records; 42 benchmark records; 114 policy records; 12 supporting resources. Collection and category counts overlap.

## Search areas

- Visuo-Tactile Benchmarks: 18 records with this classification.
- Precision and Assembly: 23 records with this classification.
- Dexterous Manipulation: 10 records with this classification.
- General Manipulation: 10 records with this classification.
- Robustness and Evaluation: 10 records with this classification.
- Supporting Tools and Data: 12 records with this classification.
- Visuo-Tactile Policy Learning: 32 records with this classification.
- Tactile VLA and World-Action Models: 29 records with this classification.
- RGB-D and 3D Policies: 33 records with this classification.
- Visual Precision and Reinforcement Learning: 8 records with this classification.
- Generalist Policy Foundations: 22 records with this classification.

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
