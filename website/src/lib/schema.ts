export type Collection = "benchmark" | "policy";
export interface Evidence {
  url: string;
  label: string;
  fields: string[];
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
        "Imitation, diffusion, ACT and reactive policies using tactile observations.",
    },
    {
      id: "tactile-foundation",
      label: "Tactile VLA & WAM",
      description:
        "Language-conditioned, foundation and world-action policies using touch.",
    },
    {
      id: "rgbd-3d",
      label: "RGBD & 3D",
      description:
        "Policies using observed depth or 3D representations. Measured and predicted geometry are distinguished in details.",
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
        "Robot agents, recursive or feedback-driven self-improvement, and in-context adaptation. Each record identifies what changes and how robot actions are executed.",
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
export const display = (v: unknown): string =>
  Array.isArray(v)
    ? v.join(" · ")
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

export const resourceLabel = (w: Work) =>
  w.categories.includes("supporting-resources")
    ? {
        dataset: "Supporting dataset",
        simulator: "Supporting simulator",
        benchmark: "Perception benchmark",
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
