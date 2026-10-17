import {
  CATEGORIES,
  display,
  inCollection,
  releaseFor,
  recordTypeLabel,
  type Collection,
  type Work,
} from "./schema.ts";
export interface ViewState {
  query: string;
  category: string;
  sort: string;
  filters: Record<string, string>;
  modalities: string[];
  saved: boolean;
  layout: "cards" | "index";
}
export const emptyView = (): ViewState => ({
  query: "",
  category: "all",
  sort: "newest",
  filters: {},
  modalities: [],
  saved: false,
  layout: "cards",
});
export const FACETS: Record<Collection, { key: string; label: string }[]> = {
  benchmark: [
    { key: "environment", label: "Evaluation domain" },
    { key: "simulator", label: "Simulator" },
    { key: "embodiment", label: "Embodiment" },
    { key: "code", label: "Code release" },
    { key: "year", label: "Year" },
  ],
  policy: [
    { key: "type", label: "Record type" },
    { key: "family", label: "Policy family" },
    { key: "environment", label: "Evaluation domain" },
    { key: "embodiment", label: "Embodiment" },
    { key: "code", label: "Code release" },
    { key: "year", label: "Year" },
  ],
};
export function values(
  w: Work,
  key: string,
  c: Collection = "benchmark",
): string[] {
  if (key === "environment") return w.environments;
  if (key === "embodiment") return w.embodiments;
  if (key === "year") return [String(w.year)];
  if (key === "code") return [releaseFor(w, c).code || "Not verified"];
  if (key === "type") return [recordTypeLabel(w, c)];
  if (key === "family")
    return [
      w.resourceType === "survey"
        ? "Survey"
        : display(w.model?.family ?? w.policy?.family),
    ];
  if (key === "simulator") {
    const s = display(w.benchmark?.simulator);
    const known = [
      "Isaac Sim",
      "Isaac Gym",
      "Isaac Lab",
      "MuJoCo",
      "SAPIEN",
      "PyBullet",
      "CoppeliaSim",
      "Bullet",
      "Unity",
      "Gazebo",
      "Newton",
    ];
    const out = known.filter((k) => s.toLowerCase().includes(k.toLowerCase()));
    return out.length
      ? out
      : [
          /^not |real.world|physical.only|none|not applicable/i.test(s)
            ? "Not applicable / not reported"
            : s,
        ];
  }
  return [];
}
export function matches(
  w: Work,
  c: Collection,
  v: ViewState,
  saved: Set<string> = new Set(),
  ignore?: string,
): boolean {
  if (!inCollection(w, c, v.category)) return false;
  if (v.saved && !saved.has(w.id)) return false;
  if (v.modalities.some((m) => !w.modalities.includes(m))) return false;
  if (
    Object.entries(v.filters).some(
      ([k, x]) => k !== ignore && x !== "all" && !values(w, k, c).includes(x),
    )
  )
    return false;
  const fold = (text: string) =>
    text
      .normalize("NFKC")
      .toLowerCase()
      .replaceAll("π", "pi")
      .replace(/[-‐‑–—_/]/g, "");
  const q = fold(v.query).trim();
  if (q) {
    const corpus = fold(
      JSON.stringify([
        w.id,
        w.name,
        w.policyName,
        w.benchmarkName,
        w.title,
        w.links.paper,
        w.summary,
        w.policySummary,
        w.benchmarkSummary,
        w.institution,
        w.categories,
        w.resourceType,
        w.modalities,
        w.environments,
        w.embodiments,
        w.benchmark,
        w.policy,
        w.model,
        w.survey,
        w.release,
        w.caveats,
      ]),
    );
    if (!q.split(/\s+/).every((t) => corpus.includes(t))) return false;
  }
  return true;
}
export function fromParams(p: URLSearchParams, c: Collection): ViewState {
  const v = emptyView();
  v.query = p.get("q") ?? "";
  v.category = CATEGORIES[c].some((x) => x.id === p.get("category"))
    ? p.get("category")!
    : "all";
  v.sort = ["newest", "oldest", "name"].includes(p.get("sort") ?? "")
    ? p.get("sort")!
    : "newest";
  v.modalities = (p.get("modalities") ?? "").split(",").filter(Boolean);
  v.saved = p.get("saved") === "1";
  v.layout = p.get("view") === "index" ? "index" : "cards";
  for (const f of FACETS[c]) if (p.get(f.key)) v.filters[f.key] = p.get(f.key)!;
  return v;
}
export function toParams(
  c: Collection,
  v: ViewState,
  compare: string[] = [],
  item?: string,
): URLSearchParams {
  const p = new URLSearchParams();
  if (c !== "benchmark") p.set("collection", c);
  if (v.category !== "all") p.set("category", v.category);
  if (v.query.trim()) p.set("q", v.query.trim());
  if (v.sort !== "newest") p.set("sort", v.sort);
  for (const { key } of FACETS[c])
    if (v.filters[key] && v.filters[key] !== "all") p.set(key, v.filters[key]);
  if (v.modalities.length) p.set("modalities", v.modalities.join(","));
  if (v.saved) p.set("saved", "1");
  if (v.layout === "index") p.set("view", "index");
  if (compare.length) p.set("compare", compare.slice(0, 4).join(","));
  if (item) p.set("item", item);
  return p;
}
