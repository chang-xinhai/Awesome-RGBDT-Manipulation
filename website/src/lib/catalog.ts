import meta from "../../../data/meta.json";
import records from "../../../data/works.json";
import media from "../../../data/media.json";
import policyAudit from "../../../data/policy-source-audit.json";
import type { Work, Collection, Figure } from "./schema";
export * from "./schema";
export const works = (records as unknown as Work[]).sort(
  (a, b) =>
    (b.date || "").localeCompare(a.date || "") || a.name.localeCompare(b.name),
);
export const figures = media as Record<
  string,
  Partial<Record<Collection, Figure>>
>;
export interface PolicySourceAudit {
  reviewed: string;
  sources: {
    id: string;
    benchmarkId?: string;
    label: string;
    url: string;
    kind: "paper-baselines" | "leaderboard" | "adapter-registry";
    scope: string;
    entries: { name: string; workId?: string; note?: string }[];
  }[];
}
export const policySourceAudit = policyAudit as PolicySourceAudit;
export const figureFor = (w: Work, c: Collection) => figures[w.id]?.[c];
export const REVIEWED = meta.reviewed;
export const REVIEW_LABEL = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(meta.reviewed + "T00:00:00Z"));
