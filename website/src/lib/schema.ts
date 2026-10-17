export type Collection = "benchmark" | "policy";
export interface Evidence {
  url: string;
  label: string;
  fields: string[];
  sourceType?: "primary" | "secondary";
  note?: string;
}
export interface Figure {
  path: string;
  original: string;
  page: string;
  credit: string;
  alt: string;
  kind: string;
  reviewed: string;
  note?: string;
  width?: number;
  height?: number;
}
export interface Work {
  id: string;
  name: string;
  title: string;
  date: string;
  year: number;
  policyName?: string;
  benchmarkName?: string;
  collections: Collection[];
  categories: string[];
  resourceType: string;
  summary: string;
  policySummary?: string;
  benchmarkSummary?: string;
  institution: string;
  venue: string;
  modalities: string[];
  environments: string[];
  embodiments: string[];
  links: Record<string, string>;
  benchmark?: Record<string, string | string[]>;
  policy?: Record<string, string | string[]>;
  model?: Record<string, string | string[]>;
  survey?: Record<string, string | string[]>;
  surveyAuditId?: string;
  release: Record<string, string>;
  releaseByCollection?: Partial<Record<Collection, Record<string, string>>>;
  evidence: Evidence[];
  caveats: string[];
  relatedIds?: string[];
  verified: string;
  imageCandidates?: unknown[];
}
export const CATEGORIES: Record<
  Collection,
  { id: string; label: string; description: string }[]
> = {
  benchmark: [
    {
      id: "tactile-benchmarks",
      label: "Visuo-tactile",
      description:
        "Benchmarks explicitly evaluating touch-conditioned perception or control.",
    },
    {
      id: "precision-assembly",
      label: "Precision & assembly",
      description:
        "Insertion, assembly, tolerance and contact-intensive evaluation.",
    },
    {
      id: "dexterous-benchmarks",
      label: "Dexterous",
      description: "Multi-finger, in-hand and dexterous bimanual evaluation.",
    },
    {
      id: "general-manipulation",
      label: "General manipulation",
      description:
        "Broader manipulation suites with relevant tasks and evaluation infrastructure.",
    },
    {
      id: "robustness-evaluation",
      label: "Robustness",
      description:
        "Generalization, perturbation, memory and evaluation diagnostics.",
    },
    {
      id: "supporting-resources",
      label: "Tools & data",
      description:
        "Supporting simulators, datasets and perception resources; not counted as closed-loop benchmarks.",
    },
  ],
  policy: [
    {
      id: "tactile-il",
      label: "Visuo-tactile learning",
      description:
        "Imitation, diffusion, ACT and reactive policies using touch or force feedback. Cutaneous tactile and wrist force/torque remain distinct inputs.",
    },
    {
      id: "tactile-foundation",
      label: "Tactile VLA & WAM",
      description:
        "Language-conditioned, foundation and world-action methods using touch or force. Training-only supervision and deployment observations remain distinct.",
    },
    {
      id: "rgbd-3d",
      label: "RGBD & 3D",
      description:
        "Policies using observed depth or 3D representations. Measured and predicted geometry are distinguished in details.",
    },
    {
      id: "tactile-representation",
      label: "Tactile representations",
      description:
        "Tactile encoders, multimodal representations and pretraining models. Their downstream use is distinguished from an executable action policy.",
    },
    {
      id: "geometry-models",
      label: "Geometry & world models",
      description:
        "Depth, spatial and predictive models relevant to manipulation. Measured inputs, estimated geometry and generated futures retain their separate roles.",
    },
    {
      id: "visual-precision-rl",
      label: "Visual precision & RL",
      description:
        "Visual precision policies, reinforcement learning and policy refinement.",
    },
    {
      id: "agent-rsi-icl",
      label: "Agent / RSI / ICL",
      description:
        "Robot agents, feedback-driven self-improvement, in-context adaptation and related surveys. Method records identify what changes and how robot actions are executed; surveys describe their literature scope.",
    },
    {
      id: "generalist-foundation",
      label: "Generalist foundations",
      description:
        "Selected VLA and world-action foundations relevant to manipulation evaluation.",
    },
  ],
};
export const BENCH_FIELDS: [string, string][] = [
  ["simulator", "Simulator"],
  ["simulatorVersion", "Simulator version & scope"],
  ["taskCount", "Task count & scope"],
  ["taskListScope", "Task list coverage"],
  ["capabilities", "Capability dimensions"],
  ["metrics", "Evaluation metrics"],
  ["robots", "Robots & embodiments"],
  ["sensors", "Sensors & observations"],
  ["dataCollection", "Data collection method"],
  ["data", "Demonstrations & data"],
  ["protocol", "Evaluation protocol"],
  ["baselines", "Evaluated baselines"],
];
export const POLICY_FIELDS: [string, string][] = [
  ["family", "Policy family"],
  ["baseModel", "Base model & architecture"],
  ["modelSize", "Model size & component"],
  ["inputs", "Deployment inputs"],
  ["outputs", "Action outputs & horizon"],
  ["trainingMethod", "Training method"],
  ["trainingData", "Training data & scale"],
  ["trainingTime", "Training duration"],
  ["trainingHardware", "Training hardware"],
  ["controlRate", "Inference & control rates"],
  ["evaluation", "Evaluation scope"],
];
export const SURVEY_FIELDS: [string, string][] = [
  ["scope", "Review scope"],
  ["taxonomy", "Organizing taxonomy"],
  ["adaptationRegimes", "Adaptation mechanisms"],
  ["contextSources", "Context and evidence"],
  ["evaluationAxes", "Evaluation dimensions"],
  ["corpus", "Literature corpus and snapshot"],
  ["reviewMethod", "Literature selection"],
  ["coverageLimits", "Coverage boundaries"],
];
export const MODEL_FIELDS: [string, string][] = [
  ["role", "Model role & downstream interface"],
  ["family", "Model family"],
  ["baseModel", "Model architecture"],
  ["modelSize", "Model size & component"],
  ["inputs", "Model inputs"],
  ["outputs", "Model outputs"],
  ["trainingMethod", "Training method"],
  ["trainingData", "Training data & scale"],
  ["trainingTime", "Training duration"],
  ["trainingHardware", "Training hardware"],
  ["inference", "Inference setting & runtime"],
  ["evaluation", "Downstream evaluation & scope"],
];
export const isExecutablePolicy = (w: Work) =>
  w.collections.includes("policy") && !!w.policy;
export const recordTypeLabel = (w: Work, c: Collection) =>
  w.survey
    ? "Survey"
    : c === "policy" && w.model
      ? "Model"
      : c === "policy"
        ? "Policy"
        : resourceLabel(w, c) || "Benchmark";
export const display = (v: unknown): string =>
  Array.isArray(v)
    ? v.join(" · ") || "Not reported"
    : v === undefined || v === null || v === ""
      ? "Not reported"
      : String(v);
export const nameFor = (w: Work, c: Collection) =>
  c === "policy" ? w.policyName || w.name : w.benchmarkName || w.name;
export const isUnknown = (v: unknown) =>
  /^not (reported|verified|applicable)|^unknown|^—$/i.test(display(v));
export function inCollection(w: Work, c: Collection, category = "all") {
  return (
    w.collections.includes(c) &&
    (category === "all"
      ? !(c === "benchmark" && w.categories.includes("supporting-resources"))
      : w.categories.includes(category))
  );
}

export const releaseFor = (w: Work, c: Collection) =>
  w.releaseByCollection?.[c] || w.release;

export const resourceLabel = (w: Work, c: Collection = "policy") =>
  w.resourceType === "survey"
    ? "Survey"
    : c === "policy" && w.model
      ? "Model"
      : w.categories.includes("supporting-resources")
        ? {
            dataset: "Supporting dataset",
            simulator: "Supporting simulator",
            benchmark: "Perception benchmark",
            model: "Perception benchmark",
            "evaluation-tool": "Supporting evaluation tool",
          }[w.resourceType] || "Supporting resource"
        : "";

export const summaryFor = (w: Work, c: Collection) =>
  c === "policy"
    ? w.policySummary || w.summary
    : w.benchmarkSummary || w.summary;

// Artifact presentation must not depend on JSON key insertion order.
export const ARTIFACT_ORDER = [
  "paper",
  "project",
  "code",
  "data",
  "weights",
] as const;
export function artifactLinks(links: Record<string, string>) {
  const rank = (key: string) => {
    const index = (ARTIFACT_ORDER as readonly string[]).indexOf(key);
    return index < 0 ? ARTIFACT_ORDER.length : index;
  };
  return Object.entries(links)
    .filter(([, url]) => !!url)
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));
}
