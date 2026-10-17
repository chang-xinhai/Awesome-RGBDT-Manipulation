import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  emptyView,
  matches,
  fromParams,
  toParams,
  values,
} from "../src/lib/filters.ts";
import {
  inCollection,
  nameFor,
  releaseFor,
  artifactLinks,
  CATEGORIES,
} from "../src/lib/schema.ts";
const works = JSON.parse(
  fs.readFileSync(new URL("../../data/works.json", import.meta.url), "utf8"),
);
const w = (id) => {
  const v = works.find((x) => x.id === id);
  assert.ok(v, `Missing source record ${id}`);
  return v;
};
test("Task-name search traverses scoped task lists", () => {
  const v = { ...emptyView(), query: "Insert HDMI" };
  assert.ok(matches(w("univtac"), "benchmark", v));
  assert.ok(!matches(w("univtac"), "policy", v));
});
test("Supporting resources require their explicit benchmark route", () => {
  const x = works.find((x) => x.categories.includes("supporting-resources"));
  assert.ok(x);
  assert.equal(inCollection(x, "benchmark"), false);
  assert.equal(inCollection(x, "benchmark", "supporting-resources"), true);
});
test("One canonical paper retains benchmark and policy identities", () => {
  const x = w("openvitac");
  assert.ok(
    x.collections.includes("benchmark") && x.collections.includes("policy"),
  );
  assert.equal(nameFor(x, "policy"), "OpenVTLA");
  assert.equal(nameFor(x, "benchmark"), "OpenViTac");
  assert.ok(x.benchmark.taskCount && x.policy.inputs);
});
test("Benchmark and policy release scopes do not overwrite each other", () => {
  const x = w("openvitac");
  assert.equal(
    values(x, "code", "benchmark")[0],
    releaseFor(x, "benchmark").code,
  );
  assert.equal(values(x, "code", "policy")[0], releaseFor(x, "policy").code);
});
test("Predicted geometry is not automatically observed depth", () => {
  const x = w("spatialvla");
  assert.ok(!x.modalities.includes("Depth"));
  assert.match(x.policy.inputs, /RGB|image/i);
});
test("Multimodal filtering requires every selected input", () => {
  const x = w("3d-vitac");
  assert.ok(
    matches(x, "policy", { ...emptyView(), modalities: ["Depth", "Tactile"] }),
  );
  const y = w("act");
  assert.ok(
    !matches(y, "policy", { ...emptyView(), modalities: ["Depth", "Tactile"] }),
  );
});
test("Saved view uses local record IDs without changing the bibliography", () => {
  const v = { ...emptyView(), saved: true };
  assert.equal(matches(w("act"), "policy", v, new Set()), false);
  assert.equal(matches(w("act"), "policy", v, new Set(["act"])), true);
});
test("View URLs preserve branch-specific facets and comparison", () => {
  const v = {
    ...emptyView(),
    query: "contact & force",
    category: "tactile-il",
    sort: "oldest",
    filters: { family: "Diffusion", year: "2026" },
    modalities: ["RGB", "Tactile"],
    saved: true,
    layout: "index",
  };
  const p = toParams("policy", v, ["pace", "ftp-1"], "pace");
  assert.equal(p.get("collection"), "policy");
  assert.equal(p.get("item"), "pace");
  assert.deepEqual(fromParams(p, "policy"), v);
});
test("Unexpected category/sort cannot inject a navigation state", () => {
  const v = fromParams(
    new URLSearchParams("category=made-up&sort=invalid"),
    "benchmark",
  );
  assert.equal(v.category, "all");
  assert.equal(v.sort, "newest");
});
test("Undated anonymous projects do not acquire a discovery publication date", () => {
  assert.equal(w("t-wla").date, "");
  assert.equal(w("t-wla").year, 0);
});
test("Artifact links keep Paper first regardless of source insertion order", () => {
  const unordered = {
    weights: "w",
    data: "d",
    code: "c",
    project: "s",
    paper: "p",
  };
  assert.deepEqual(
    artifactLinks(unordered).map(([key]) => key),
    ["paper", "project", "code", "data", "weights"],
  );
});
test("Missing artifacts fall back to the next available source before extras", () => {
  assert.deepEqual(
    artifactLinks({
      video: "v",
      data: "d",
      paper: "",
      project: "s",
      code: "c",
      appendix: "a",
    }).map(([key]) => key),
    ["project", "code", "data", "appendix", "video"],
  );
  assert.equal(artifactLinks({ data: "d", code: "c" })[0][0], "code");
});
test("Agent / RSI / ICL is an addressable policy route", () => {
  assert.ok(CATEGORIES.policy.some((x) => x.id === "agent-rsi-icl"));
  assert.equal(
    fromParams(new URLSearchParams("category=agent-rsi-icl"), "policy")
      .category,
    "agent-rsi-icl",
  );
  assert.equal(
    fromParams(new URLSearchParams("category=agent-rsi-icl"), "benchmark")
      .category,
    "all",
  );
});
test("Common model spellings resolve punctuation and Greek names", () => {
  assert.ok(
    matches(w("roboprobe"), "policy", { ...emptyView(), query: "GPT6" }),
  );
  assert.ok(matches(w("pi05"), "policy", { ...emptyView(), query: "pi0.5" }));
  assert.ok(
    matches(w("vpp2"), "policy", { ...emptyView(), query: "VPP2 Preview" }),
  );
});
test("Surveys retain a research route without claiming executable policy fields", () => {
  const x = w("robot-icl-survey");
  assert.equal(x.resourceType, "survey");
  assert.ok(x.survey.taxonomy.length === 4);
  assert.equal(x.policy, undefined);
  assert.ok(inCollection(x, "policy", "agent-rsi-icl"));
  assert.ok(!inCollection(x, "benchmark"));
  assert.deepEqual(values(x, "type", "policy"), ["Survey"]);
  assert.deepEqual(values(x, "family", "policy"), ["Survey"]);
  assert.ok(!matches(x, "policy", { ...emptyView(), modalities: ["Depth"] }));
});
test("Survey-specific scope search and type filter survive URL state", () => {
  const v = {
    ...emptyView(),
    category: "agent-rsi-icl",
    query: "geometric demonstration transfer",
    filters: { type: "Survey" },
  };
  assert.ok(matches(w("robot-icl-survey"), "policy", v));
  assert.ok(!matches(w("roboicl"), "policy", { ...v, query: "" }));
  assert.deepEqual(fromParams(toParams("policy", v), "policy"), v);
  assert.ok(
    matches(w("robot-icl-survey"), "policy", {
      ...emptyView(),
      query: "2609.36012",
    }),
  );
});
