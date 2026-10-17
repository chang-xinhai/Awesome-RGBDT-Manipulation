import { sitePath } from "../lib/paths";
import {
  CATEGORIES,
  BENCH_FIELDS,
  POLICY_FIELDS,
  SURVEY_FIELDS,
  MODEL_FIELDS,
  recordTypeLabel,
  display,
  isUnknown,
  nameFor,
  releaseFor,
  resourceLabel,
  summaryFor,
  artifactLinks,
  type Collection,
  type Work,
  type Figure,
} from "../lib/schema";
import {
  emptyView,
  matches,
  values,
  fromParams,
  toParams,
  FACETS,
  type ViewState,
} from "../lib/filters";

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id)! as T;
const esc = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const safeUrl = (s: string) => (/^https?:\/\//.test(s) ? s : "#");
const external = (url: string, label: string, extra = "") =>
  `<a href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer" ${extra}>${esc(label)}</a>`;
const search = $<HTMLInputElement>("catalog-search"),
  sort = $<HTMLSelectElement>("sort-order"),
  results = $("catalog-results");
const detail = $<HTMLDialogElement>("detail-dialog"),
  compare = $<HTMLDialogElement>("compare-dialog"),
  figure = $<HTMLDialogElement>("figure-dialog");
let reviewed = "";
let works: Work[] = [],
  byId = new Map<string, Work>(),
  media: Record<string, Partial<Record<Collection, Figure>>> = {};
const initial = new URLSearchParams(location.search);
let collection: Collection =
  initial.get("collection") === "policy" ? "policy" : "benchmark";
let view = fromParams(initial, collection),
  selected = new Set(
    (initial.get("compare") ?? "").split(",").filter(Boolean).slice(0, 4),
  );
const views = new Map<Collection, ViewState>(),
  selections = new Map<Collection, Set<string>>();
let saved = new Set<string>();
try {
  saved = new Set(JSON.parse(localStorage.getItem("rgbdt-saved-v1") ?? "[]"));
} catch {}
let current: Work[] = [],
  cursor = 0,
  generation = 0,
  busy = false;
const dialogFocus = new Map<HTMLDialogElement, HTMLElement | null>();
const filterInert = new Map<HTMLElement, boolean>();
const filterHome = $("library-toolbar");
let observer: IntersectionObserver | undefined;
const PAGE = 12;
function toast(message: string) {
  $("toast").textContent = message;
  $("toast").hidden = false;
  window.setTimeout(() => ($("toast").hidden = true), 2800);
}
function syncUrl() {
  const p = toParams(
    collection,
    view,
    [...selected],
    detail.open ? detail.dataset.work : undefined,
  );
  history.replaceState(
    null,
    "",
    location.pathname + (p.size ? "?" + p : "") + location.hash,
  );
}
function dialogOpen(d: HTMLDialogElement) {
  dialogFocus.set(d, document.activeElement as HTMLElement);
  d.showModal();
  document.body.classList.add("dialog-open");
}
function dialogClose(d: HTMLDialogElement) {
  d.close();
  if (!document.querySelector("dialog[open]"))
    document.body.classList.remove("dialog-open");
  dialogFocus.get(d)?.focus({ preventScroll: true });
  dialogFocus.delete(d);
  if (d === detail) {
    delete detail.dataset.work;
    syncUrl();
  }
}
function imageFor(w: Work, c = collection) {
  return media[w.id]?.[c];
}
function cite(w: Work, key: string) {
  const ids = w.evidence
    .map((s, i) => ({ s, i }))
    .filter(({ s }) =>
      (s.fields ?? []).some(
        (f) =>
          key === f ||
          key.startsWith(f + ".") ||
          f === key.split(".")[0] ||
          f === "all",
      ),
    );
  return ids.length
    ? `<sup class="citations">${ids
        .slice(0, 3)
        .map(({ s, i }) =>
          external(s.url, `[${i + 1}]`, `title="${esc(s.label)}"`),
        )
        .join("")}</sup>`
    : "";
}
function factRows(
  w: Work,
  prefix: string,
  fields: [string, string][],
  obj: Record<string, unknown>,
) {
  return fields
    .map(
      ([key, label]) =>
        `<div><dt>${esc(label)}</dt><dd class="${isUnknown(obj[key]) ? "unknown" : ""}">${esc(display(obj[key]))}${isUnknown(obj[key]) ? "" : cite(w, `${prefix ? prefix + "." : ""}${key}`)}</dd></div>`,
    )
    .join("");
}
function factSection(
  w: Work,
  title: string,
  prefix: string,
  fields: [string, string][],
  obj: Record<string, unknown>,
) {
  return `<section class="detail-section"><h3>${esc(title)}</h3><dl class="facts">${factRows(w, prefix, fields, obj)}</dl></section>`;
}
function card(w: Work) {
  const f = imageFor(w),
    s = selected.has(w.id),
    items = w.survey
      ? ["Survey", display(w.survey.scope)]
      : collection === "benchmark"
        ? [display(w.benchmark?.simulator), display(w.benchmark?.taskCount)]
        : w.model
          ? ["Model · " + display(w.model.family), display(w.model.baseModel)]
          : [display(w.policy?.family), display(w.policy?.baseModel)];
  const cover = f
    ? `<img src="${esc(sitePath(f.path))}" alt="${esc(f.alt)}" width="640" height="360" loading="lazy" decoding="async"/>`
    : `<span class="text-cover"><small>${w.survey ? "Research survey" : collection === "benchmark" ? "Research benchmark" : w.model ? "Representation / world model" : "Manipulation policy"}</small><strong>${esc(nameFor(w, collection))}</strong><span>View primary-source details ↗</span></span>`;
  return `<article class="library-card feed-enter${s ? " is-selected" : ""}" data-id="${esc(w.id)}"><button type="button" class="card-cover" data-detail="${esc(w.id)}" aria-label="View ${esc(nameFor(w, collection))}">${cover}</button><div class="card-copy"><p class="card-meta">${esc(w.institution)}<span>·</span>${w.year || "Undated"}</p><h2><button type="button" data-detail="${esc(w.id)}" title="${esc(w.title)}">${esc(nameFor(w, collection))}</button></h2><p class="card-description">${esc(summaryFor(w, collection))}</p><div class="card-facts">${items.map((x) => `<span title="${esc(x)}">${esc(x)}</span>`).join("")}</div><div class="card-tags">${resourceLabel(w, collection) ? `<span>${esc(resourceLabel(w, collection))}</span>` : ""}${w.modalities
    .filter((x) => !["Proprioception", "Language"].includes(x))
    .map((x) => `<span>${esc(x)}</span>`)
    .join(
      "",
    )}</div><div class="card-actions"><button type="button" data-detail="${esc(w.id)}">Details <span aria-hidden="true">↗</span></button><button type="button" class="compare-toggle" data-compare="${esc(w.id)}" aria-pressed="${s}" aria-label="${s ? "Remove" : "Compare"} ${esc(nameFor(w, collection))}"><span aria-hidden="true">${s ? "✓" : "+"}</span> Compare</button></div></div></article>`;
}
function filtered() {
  return works
    .filter((w) => matches(w, collection, view, saved))
    .sort((a, b) =>
      view.sort === "name"
        ? nameFor(a, collection).localeCompare(nameFor(b, collection))
        : view.sort === "oldest"
          ? (a.date || "9999").localeCompare(b.date || "9999")
          : (b.date || "").localeCompare(a.date || "") ||
            nameFor(a, collection).localeCompare(nameFor(b, collection)),
    );
}
function indexTable() {
  const isBench = collection === "benchmark";
  return `<div class="index-wrap"><table class="index-table"><thead><tr><th>Work</th><th>${isBench ? "Simulator" : "Type / architecture"}</th><th>${isBench ? "Tasks & scope" : "Inputs / review scope"}</th><th>${isBench ? "Evaluation domain" : "Data / literature corpus"}</th>${isBench ? "<th>Data collection</th>" : ""}<th>Code</th><th>Compare</th></tr></thead><tbody>${current.map((w) => `<tr><td><button class="index-title" type="button" data-detail="${esc(w.id)}">${esc(nameFor(w, collection))}</button><small>${esc(w.date || "Undated")} · ${esc(w.venue)}</small></td><td>${esc(display(w.survey ? "Survey" : isBench ? w.benchmark?.simulator : w.model ? "Model · " + display(w.model.family) : w.policy?.family))}</td><td>${esc(display(w.survey ? w.survey.scope : isBench ? w.benchmark?.taskCount : (w.model?.inputs ?? w.policy?.inputs)))}</td><td>${esc(display(w.survey ? w.survey.corpus : isBench ? w.environments : (w.model?.trainingData ?? w.policy?.trainingData)))}</td>${isBench ? `<td>${esc(display(w.benchmark?.dataCollection))}</td>` : ""}<td>${esc(releaseFor(w, collection).code)}</td><td><button type="button" class="compare-toggle" data-compare="${esc(w.id)}" aria-pressed="${selected.has(w.id)}">${selected.has(w.id) ? "✓" : "+"} Compare</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderCategories() {
  const nav = $("category-options"),
    focused = (document.activeElement as HTMLElement)?.dataset.category;
  const allState = { ...view, category: "all" };
  const options = [
    {
      id: "all",
      label:
        collection === "benchmark" ? "All benchmarks" : "All policy research",
      description: "All curated works in this collection.",
    },
    ...CATEGORIES[collection],
  ];
  nav.innerHTML = options
    .map(
      (c) =>
        `<button type="button" data-category="${esc(c.id)}" aria-pressed="${view.category === c.id}" title="${esc(c.description)}">${esc(c.label)}<span>${works.filter((w) => matches(w, collection, { ...allState, category: c.id }, saved)).length}</span></button>`,
    )
    .join("");
  nav.parentElement!.setAttribute(
    "aria-label",
    `${collection === "benchmark" ? "Benchmark" : "Policy"} categories`,
  );
  if (focused)
    nav
      .querySelector<HTMLButtonElement>(`[data-category="${focused}"]`)
      ?.focus({ preventScroll: true });
}
function renderFilters() {
  const focused =
    document.activeElement instanceof HTMLSelectElement
      ? document.activeElement.dataset.facet
      : undefined;
  const modalityFocus =
    document.activeElement instanceof HTMLInputElement &&
    document.activeElement.name === "modality"
      ? document.activeElement.value
      : undefined;
  const body = $("filter-fields").parentElement!,
    scroll = body.scrollTop;
  $("filter-panel-title").textContent =
    collection === "benchmark" ? "Benchmark filters" : "Policy filters";
  $("modality-label").textContent =
    collection === "benchmark"
      ? "Available observations / benchmark setting"
      : "Policy / model inputs";
  $("filter-note").textContent =
    collection === "benchmark"
      ? "A listed sensor or simulator channel does not mean every evaluated policy used it. Counts and versions retain their paper or release scope."
      : "Measured depth, inferred geometry, tactile sensing and wrist force/torque are recorded separately. Models retain their encoder or prediction inputs; policies retain deployment inputs. Training cost and control rates retain their reported scope.";
  $("filter-fields").innerHTML = FACETS[collection]
    .map((f) => {
      const pool = works.filter((w) =>
        matches(w, collection, view, saved, f.key),
      );
      const opts = [
        ...new Set(pool.flatMap((w) => values(w, f.key, collection))),
      ].sort((a, b) =>
        f.key === "year" ? b.localeCompare(a) : a.localeCompare(b),
      );
      if (view.filters[f.key] && !opts.includes(view.filters[f.key]))
        opts.push(view.filters[f.key]);
      return `<label>${esc(f.label)}<select data-facet="${f.key}" id="${f.key}-filter"><option value="all">Any</option>${opts.map((x) => `<option value="${esc(x)}"${view.filters[f.key] === x ? " selected" : ""}>${esc(x === "0" ? "Undated" : x)} (${pool.filter((w) => values(w, f.key, collection).includes(x)).length})</option>`).join("")}</select></label>`;
    })
    .join("");
  const pool = works.filter((w) =>
    matches(w, collection, { ...view, modalities: [] }, saved),
  );
  const mods = [
    ...new Set([...pool.flatMap((w) => w.modalities), ...view.modalities]),
  ].sort();
  $("modality-options").innerHTML = mods
    .map(
      (x) =>
        `<label><input type="checkbox" name="modality" value="${esc(x)}"${view.modalities.includes(x) ? " checked" : ""}/><span>${esc(x)}</span></label>`,
    )
    .join("");
  if (focused)
    $("filter-fields")
      .querySelector<HTMLSelectElement>(`[data-facet="${focused}"]`)
      ?.focus({ preventScroll: true });
  if (modalityFocus)
    Array.from(
      document.querySelectorAll<HTMLInputElement>("input[name=modality]"),
    )
      .find((x) => x.value === modalityFocus)
      ?.focus({ preventScroll: true });
  body.scrollTop = scroll;
  const count =
    Object.values(view.filters).filter((x) => x && x !== "all").length +
    view.modalities.length;
  $("filter-count").hidden = !count;
  $("filter-count").textContent = String(count);
}
function renderChips() {
  const chips: [string, string][] = [];
  if (view.category !== "all")
    chips.push([
      "category",
      CATEGORIES[collection].find((x) => x.id === view.category)?.label ??
        view.category,
    ]);
  for (const { key, label } of FACETS[collection])
    if (view.filters[key] && view.filters[key] !== "all")
      chips.push([key, `${label}: ${view.filters[key]}`]);
  view.modalities.forEach((m) => chips.push(["modality:" + m, m]));
  if (view.saved) chips.push(["saved", "Saved papers"]);
  $("active-filters").innerHTML = chips
    .map(
      ([k, l]) =>
        `<button type="button" data-remove-filter="${esc(k)}">${esc(l)} <span aria-hidden="true">×</span></button>`,
    )
    .join("");
}
function renderTray() {
  selected = new Set(
    [...selected].filter((id) =>
      byId.get(id)?.collections.includes(collection),
    ),
  );
  const n = selected.size;
  $("compare-tray").hidden = !n;
  $("compare-count").textContent = `${n} selected`;
  $("compare-names").textContent = [...selected]
    .map((id) => nameFor(byId.get(id)!, collection))
    .join(" · ");
  $<HTMLButtonElement>("open-compare").disabled = n < 2;
  document.querySelectorAll<HTMLElement>("[data-compare]").forEach((el) => {
    const on = selected.has(el.dataset.compare!);
    el.setAttribute("aria-pressed", String(on));
    const symbol = el.querySelector("span");
    if (symbol) symbol.textContent = on ? "✓" : "+";
  });
  document
    .querySelectorAll<HTMLElement>(".library-card")
    .forEach((el) =>
      el.classList.toggle("is-selected", selected.has(el.dataset.id!)),
    );
}
function render() {
  generation++;
  busy = false;
  observer?.disconnect();
  current = filtered();
  cursor = 0;
  document
    .querySelectorAll<HTMLElement>("[data-collection]")
    .forEach((el) =>
      el.setAttribute(
        "aria-pressed",
        String(el.dataset.collection === collection),
      ),
    );
  search.value = view.query;
  sort.value = view.sort;
  $("saved-toggle").setAttribute("aria-pressed", String(view.saved));
  $("saved-count").textContent = String(saved.size);
  $("view-toggle").setAttribute(
    "aria-pressed",
    String(view.layout === "index"),
  );
  $("view-toggle").textContent =
    view.layout === "index" ? "Card view" : "Index view";
  renderCategories();
  renderFilters();
  renderChips();
  const label =
    collection === "benchmark"
      ? view.category === "supporting-resources"
        ? "supporting resources"
        : current.some((w) => w.categories.includes("supporting-resources"))
          ? "research resources"
          : "benchmarks"
      : "policies";
  const surveyCount = current.filter((w) => w.resourceType === "survey").length;
  const modelCount =
    collection === "policy" ? current.filter((w) => !!w.model).length : 0;
  $("result-count").textContent =
    surveyCount || modelCount
      ? `${current.length} records · ${current.length - surveyCount - modelCount} ${label}${modelCount ? ` · ${modelCount} ${modelCount === 1 ? "model" : "models"}` : ""}${surveyCount ? ` · ${surveyCount} ${surveyCount === 1 ? "survey" : "surveys"}` : ""}`
      : `${current.length} ${label}`;
  $("catalog-empty").hidden = current.length > 0;
  $("feed-error").hidden = true;
  $("feed-end").hidden = true;
  results.setAttribute("aria-busy", "false");
  results.innerHTML =
    view.layout === "index" && current.length ? indexTable() : "";
  if (view.layout === "cards") appendBatch();
  else {
    $("feed-end").hidden = !current.length;
    $("loading-dots").hidden = true;
    $("load-more").hidden = true;
  }
  renderTray();
  syncUrl();
}
function appendBatch() {
  if (busy || view.layout !== "cards") return;
  const slice = current.slice(cursor, cursor + PAGE);
  if (!slice.length) {
    $("feed-end").hidden = !current.length;
    $("loading-dots").hidden = true;
    $("load-more").hidden = true;
    return;
  }
  busy = true;
  results.setAttribute("aria-busy", "true");
  $("loading-dots").hidden = false;
  const batch = document.createElement("div");
  batch.className = "feed-batch";
  batch.innerHTML = slice.map(card).join("");
  results.append(batch);
  cursor += slice.length;
  busy = false;
  results.setAttribute("aria-busy", "false");
  $("loading-dots").hidden = true;
  $("feed-end").hidden = cursor < current.length;
  $("load-more").hidden = cursor >= current.length;
  observer?.disconnect();
  if (cursor < current.length) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) appendBatch();
      },
      { rootMargin: "0px 0px 600px 0px" },
    );
    observer.observe($("feed-boundary"));
  }
}
function switchCollection(next: Collection) {
  if (next === collection) return;
  views.set(collection, structuredClone(view));
  selections.set(collection, new Set(selected));
  collection = next;
  view = views.get(next) ?? emptyView();
  selected = selections.get(next) ?? new Set();
  closeFilters();
  render();
}
function caption(f: Figure) {
  return `<p class="figure-caption">${esc(f.kind.replaceAll("-", " "))} · ${esc(f.credit)}<br>${external(f.page, "Figure source ↗")} · Original rights retained.${f.note ? `<span class="figure-note">${esc(f.note)}</span>` : ""}</p>`;
}
function figureLabel(w: Work, f: Figure) {
  const specific: Record<string, string> = {
    "implementation-preview": "Published implementation interface",
    "system-overview": "Author system overview",
    "representation-overview": "Representation learning overview",
    "agent-rollout": "Author agent execution example",
    "interaction-overview": "In-context prompting interface",
    "data-pipeline": "Data collection & learning pipeline",
    "data-collection-process": "Author data collection process",
    "conceptual-pipeline": "Author conceptual pipeline",
    "source-excerpt": "Published source text preview",
  };
  return (
    specific[f.kind] ??
    (w.survey
      ? "Survey taxonomy & conceptual framework"
      : collection === "benchmark"
        ? "Task coverage & benchmark overview"
        : w.model
          ? "Model architecture & representation pipeline"
          : "Policy architecture & pipeline")
  );
}
function tasksHtml(w: Work) {
  const b = w.benchmark;
  if (!b) return "";
  const tasks = Array.isArray(b.tasks) ? b.tasks : [];
  return `<section class="detail-section"><h3>Published tasks ${tasks.length ? `(${tasks.length} listed)` : ""}</h3><p class="task-scope">${esc(display(b.taskListScope))}${cite(w, "benchmark.tasks")}</p>${
    tasks.length
      ? `<ul class="task-list">${tasks
          .slice(0, 16)
          .map((t) => `<li>${esc(t)}</li>`)
          .join("")}</ul>${
          tasks.length > 16
            ? `<details class="detail-secondary"><summary>Show all ${tasks.length} listed tasks</summary><ul class="task-list">${tasks
                .slice(16)
                .map((t) => `<li>${esc(t)}</li>`)
                .join("")}</ul></details>`
            : ""
        }`
      : '<p class="task-scope">Task names are not reported or not yet verified in the cited public sources.</p>'
  }</section>`;
}
function benchmarkSections(w: Work) {
  if (!w.benchmark) return "";
  return (
    factSection(
      w,
      "Suite & simulator",
      "benchmark",
      BENCH_FIELDS.slice(0, 4),
      w.benchmark,
    ) +
    tasksHtml(w) +
    factSection(
      w,
      "Capabilities & physical setup",
      "benchmark",
      BENCH_FIELDS.slice(4, 8),
      w.benchmark,
    ) +
    factSection(
      w,
      "Data & evaluation",
      "benchmark",
      BENCH_FIELDS.slice(8),
      w.benchmark,
    )
  );
}
function policySections(w: Work) {
  if (w.survey)
    return (
      factSection(
        w,
        "Survey scope & taxonomy",
        "survey",
        SURVEY_FIELDS.slice(0, 4),
        w.survey,
      ) +
      factSection(
        w,
        "Review evidence & boundaries",
        "survey",
        SURVEY_FIELDS.slice(4),
        w.survey,
      ) +
      (w.surveyAuditId
        ? `<section class="detail-section"><h3>Follow the literature</h3><p class="detail-summary">${external(location.origin + sitePath("coverage/#survey-source-audit"), "Browse the reference-to-record audit ↗")}</p><p class="task-scope">Citation mappings identify indexed methods, adjacent resources and exclusions. Each indexed method retains evidence from its own primary sources.</p></section>`
        : "")
    );
  if (w.model)
    return (
      factSection(
        w,
        "Model role, architecture & interfaces",
        "model",
        MODEL_FIELDS.slice(0, 6),
        w.model,
      ) +
      factSection(
        w,
        "Pretraining & resources",
        "model",
        MODEL_FIELDS.slice(6, 10),
        w.model,
      ) +
      factSection(
        w,
        "Inference & downstream evidence",
        "model",
        MODEL_FIELDS.slice(10),
        w.model,
      )
    );
  if (!w.policy) return "";
  return (
    factSection(
      w,
      "Architecture & deployment",
      "policy",
      POLICY_FIELDS.slice(0, 5),
      w.policy,
    ) +
    factSection(
      w,
      "Learning & training resources",
      "policy",
      POLICY_FIELDS.slice(5, 10),
      w.policy,
    ) +
    factSection(w, "Evaluation", "policy", POLICY_FIELDS.slice(10), w.policy)
  );
}
function openDetail(id: string, restore = false) {
  const w = byId.get(id);
  if (!w) return;
  if (!w.collections.includes(collection)) switchCollection(w.collections[0]);
  const f = imageFor(w),
    related = works.filter(
      (x) => w.relatedIds?.includes(x.id) || x.relatedIds?.includes(w.id),
    );
  const fields =
    collection === "benchmark" ? benchmarkSections(w) : policySections(w);
  const secondary =
    collection === "benchmark" && (w.policy || w.model)
      ? `<details class="detail-secondary"><summary>${w.model ? "Model" : "Policy"} introduced in this work</summary>${policySections(w)}</details>`
      : collection === "policy" && w.benchmark
        ? `<details class="detail-secondary"><summary>Benchmark introduced in this work</summary>${benchmarkSections(w)}</details>`
        : "";
  $("detail-content").innerHTML =
    `<div class="detail-layout"><aside class="detail-media">${f ? `<p class="media-label">${esc(figureLabel(w, f))}</p><button type="button" data-figure="${esc(w.id)}" aria-label="Enlarge ${esc(nameFor(w, collection))} figure"><img src="${esc(sitePath(f.path))}" alt="${esc(f.alt)}"/></button>${caption(f)}` : `<p class="media-label">Primary-source research record</p><div class="text-cover"><strong>${esc(nameFor(w, collection))}</strong><span>A suitable official figure has not been verified.</span></div>`}<p class="detail-summary">${esc(summaryFor(w, collection))}</p>${w.survey ? '<p class="media-label">Survey · literature review, without a new executable policy</p>' : ""}<dl class="facts">${factRows(
      w,
      "",
      w.survey
        ? [
            ["resourceType", "Record type"],
            ["environments", "Review format"],
          ]
        : [
            [
              "modalities",
              collection === "benchmark"
                ? "Listed observations"
                : w.model
                  ? "Model inputs"
                  : "Deployment modalities",
            ],
            ["environments", "Evaluation domain"],
            ["embodiments", "Embodiment"],
          ],
      {
        ...w,
        embodiments:
          w.model && !w.embodiments.length
            ? "Not applicable — no robot controller"
            : w.embodiments,
      } as unknown as Record<string, unknown>,
    )}</dl>${related.length ? `<div class="detail-related"><strong>Related research record</strong>${related.map((x) => `<button type="button" data-related="${esc(x.id)}">${esc(nameFor(x, collection))} ↗</button>`).join("<br>")}</div>` : ""}</aside><div class="detail-copy"><p class="detail-kicker">${esc(w.venue)} · ${esc(w.date || "Undated")} · ${esc(w.institution)}</p><h2>${esc(nameFor(w, collection))}</h2><p class="detail-paper-title">${esc(w.title)}</p><div class="detail-links">${artifactLinks(
      w.links,
    )
      .map(([key, url]) =>
        external(
          url,
          (
            {
              paper: "Paper",
              project: "Project",
              code: "Code",
              data: "Data",
              weights: "Weights",
              repository: "Repository",
              report: "Report",
              blog: "Blog",
              demo: "Demo",
              video: "Video",
              documentation: "Documentation",
            } as Record<string, string>
          )[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
        ),
      )
      .join(
        "",
      )}<button type="button" data-save="${esc(w.id)}" aria-pressed="${saved.has(w.id)}">${saved.has(w.id) ? "Saved ✓" : "Save"}</button><button type="button" data-copy-item="${esc(w.id)}">Copy link</button></div>${fields}${secondary}${factSection(
      w,
      "Release & access",
      "release",
      [
        ["code", "Code"],
        ["weights", "Weights"],
        ["data", "Data"],
        ["license", "License & artifact scope"],
        ["notes", "Release details"],
      ],
      releaseFor(w, collection),
    )}${w.caveats.length ? `<section class="detail-section"><h3>Scope & qualifications</h3><ul class="caveats">${w.caveats.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}<details class="detail-sources" open><summary>Primary-source evidence (${w.evidence.length})</summary><ol>${w.evidence.map((s, i) => `<li id="evidence-${i + 1}">${external(s.url, s.label)}${s.note ? `<p>${esc(s.note)}</p>` : ""}</li>`).join("")}</ol><p>Last reviewed ${esc(w.verified)}. “Not reported” means the cited sources do not disclose the value; “Not verified” means it remains unresolved.</p></details></div></div>`;
  detail.dataset.work = id;
  if (!detail.open) dialogOpen(detail);
  detail.scrollTop = 0;
  if (!restore) syncUrl();
}
function toggleCompare(id: string) {
  if (selected.has(id)) selected.delete(id);
  else {
    if (selected.size === 4) {
      toast("Compare up to four works in this collection.");
      return;
    }
    selected.add(id);
  }
  renderTray();
  syncUrl();
}
function openCompare() {
  const list = [...selected].map((id) => byId.get(id)!).filter(Boolean);
  if (list.length < 2) return;
  const c = collection,
    hasSurveys = list.some((w) => !!w.survey),
    hasModels = c === "policy" && list.some((w) => !!w.model),
    groups: [string, [string, string][]][] =
      c === "benchmark"
        ? [["benchmark", [...BENCH_FIELDS, ["tasks", "Published task names"]]]]
        : [
            ...(list.some((w) => !!w.policy)
              ? [["policy", POLICY_FIELDS] as [string, [string, string][]]]
              : []),
            ...(hasModels
              ? [["model", MODEL_FIELDS] as [string, [string, string][]]]
              : []),
            ...(hasSurveys
              ? [["survey", SURVEY_FIELDS] as [string, [string, string][]]]
              : []),
          ],
    fieldList = groups.flatMap(([prefix, fields]) =>
      fields.map(([key, label]) => [
        prefix,
        key,
        groups.length > 1
          ? `${prefix === "policy" ? "Policy" : prefix === "model" ? "Model" : "Survey"}: ${label}`
          : label,
      ]),
    );
  const row = (label: string, fn: (w: Work) => string) =>
    `<tr><th scope="row">${esc(label)}</th>${list.map((w) => `<td>${fn(w)}</td>`).join("")}</tr>`;
  $("compare-content").innerHTML =
    `<div class="compare-heading"><h2>${hasSurveys || hasModels ? "Compare research" : c === "benchmark" ? "Compare benchmarks" : "Compare policies"}</h2><p>${hasSurveys || hasModels ? "Surveys describe literature, models provide representations or predictions, and policies produce actions. Fields that do not apply remain labeled." : c === "benchmark" ? "Task counts, simulator versions and protocols retain their paper or release scope." : "Architecture, deployment observations and training resources are compared separately."} Different evaluation settings do not form a common performance ranking.</p></div><div class="compare-table-wrap"><table class="comparison-table" style="min-width:${(155 + list.length * 245) / 16}rem"><thead><tr><th scope="col">${hasSurveys || hasModels ? "Research record" : c === "benchmark" ? "Benchmark" : "Policy"}</th>${list
      .map((w) => {
        const f = imageFor(w);
        return `<th scope="col">${f ? `<img src="${esc(sitePath(f.path))}" alt="${esc(f.alt)}"/>` : ""}<strong>${esc(nameFor(w, collection))}</strong><span>${esc(w.date || "Undated")} · ${esc(w.venue)}</span></th>`;
      })
      .join(
        "",
      )}</tr></thead><tbody>${row("Record type", (w) => esc(recordTypeLabel(w, c)))}${row("Policy / model inputs", (w) => (w.survey ? "Not applicable — survey" : esc(w.modalities.join(" · "))))}${row("Evaluation domain", (w) => esc(w.environments.join(" · ")))}${row("Embodiment", (w) => (w.survey ? "Not applicable — survey" : esc(w.embodiments.join(" · "))))}${fieldList
      .map(([prefix, key, label]) =>
        row(label, (w) => {
          const obj =
            prefix === "survey"
              ? w.survey
              : prefix === "model"
                ? w.model
                : prefix === "benchmark"
                  ? w.benchmark
                  : w.policy;
          if (!obj)
            return `<span class="unknown">Not applicable — ${w.survey ? "survey" : w.model ? "model record" : "method record"}</span>`;
          const val = obj[key];
          return `<span class="${isUnknown(val) ? "unknown" : ""}">${esc(display(val))}</span>${isUnknown(val) ? "" : cite(w, `${prefix}.${key}`)}`;
        }),
      )
      .join(
        "",
      )}${["code", "weights", "data", "license"].map((key) => row("Release: " + key, (w) => esc(releaseFor(w, collection)[key] ?? "Not verified") + cite(w, "release." + key))).join("")}${row("Primary source", (w) => external(w.links.paper || w.links.project || w.evidence[0].url, "Open primary source ↗"))}</tbody></table></div><p class="compare-footnote">Unknown values are left explicit. Training duration, GPU count, model size and control rate are only comparable when their measurement scope matches.</p>`;
  dialogOpen(compare);
}
function closeFilters(restoreFocus = false) {
  const panel = $("filter-panel"),
    wasOpen = !panel.hidden;
  panel.hidden = true;
  panel.removeAttribute("role");
  panel.removeAttribute("aria-modal");
  for (const [element, value] of filterInert) element.inert = value;
  filterInert.clear();
  panel.classList.remove("filter-modal");
  if (panel.parentElement !== filterHome) filterHome.append(panel);
  if (!document.querySelector("dialog[open]"))
    document.body.classList.remove("dialog-open");
  $("filters-toggle").setAttribute("aria-expanded", "false");
  if (wasOpen && restoreFocus) $("filters-toggle").focus();
}
function openFilters() {
  const panel = $("filter-panel");
  panel.hidden = false;
  panel.setAttribute("aria-labelledby", "filter-panel-title");
  $("filters-toggle").setAttribute("aria-expanded", "true");
  if (matchMedia("(max-width:600px), (max-height:600px)").matches) {
    document.body.append(panel);
    panel.classList.add("filter-modal");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    document.body.classList.add("dialog-open");
    for (
      let node: HTMLElement | null = panel;
      node?.parentElement && node !== document.body;
      node = node.parentElement
    ) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling !== node && sibling instanceof HTMLElement) {
          filterInert.set(sibling, sibling.inert);
          sibling.inert = true;
        }
      }
    }
  } else panel.setAttribute("role", "region");
  panel
    .querySelector<HTMLSelectElement>("select")
    ?.focus({ preventScroll: true });
}
function reset() {
  const layout = view.layout;
  view = emptyView();
  view.layout = layout;
  render();
}
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Link copied.");
  } catch {
    toast("Copy this page’s URL from the address bar.");
  }
}
async function load() {
  try {
    const response = await fetch(sitePath("catalog.json"));
    if (!response.ok) throw Error(String(response.status));
    const data = await response.json();
    reviewed = data.reviewed;
    works = data.works;
    media = data.figures;
    byId = new Map(works.map((w) => [w.id, w]));
    selected = new Set([...selected].filter((id) => byId.has(id)));
    render();
    const id =
      new URLSearchParams(location.search).get("item") ?? initial.get("item");
    if (id && byId.has(id)) openDetail(id);
  } catch (error) {
    console.error("Catalog load failed", error);
    $("feed-error").hidden = false;
    $("loading-dots").hidden = true;
    results.setAttribute("aria-busy", "false");
  }
}
document.addEventListener("click", (event) => {
  const t = event.target as HTMLElement,
    button = t.closest<HTMLElement>(
      "[data-collection],[data-category],[data-detail],[data-compare],[data-close],[data-save],[data-copy-item],[data-figure],[data-related],[data-remove-filter]",
    );
  if (button) {
    if (button.dataset.collection)
      switchCollection(button.dataset.collection as Collection);
    else if (button.dataset.category) {
      view.category = button.dataset.category;
      render();
    } else if (button.dataset.detail) openDetail(button.dataset.detail);
    else if (button.dataset.compare) toggleCompare(button.dataset.compare);
    else if (button.hasAttribute("data-close"))
      dialogClose(button.closest("dialog")!);
    else if (button.dataset.save) {
      const id = button.dataset.save;
      saved.has(id) ? saved.delete(id) : saved.add(id);
      try {
        localStorage.setItem("rgbdt-saved-v1", JSON.stringify([...saved]));
      } catch {}
      button.setAttribute("aria-pressed", String(saved.has(id)));
      button.textContent = saved.has(id) ? "Saved ✓" : "Save";
      $("saved-count").textContent = String(saved.size);
      if (view.saved) {
        const active = detail.dataset.work;
        render();
        if (active) detail.dataset.work = active;
      }
    } else if (button.dataset.copyItem) {
      syncUrl();
      void copy(location.href);
    } else if (button.dataset.figure) {
      const f = imageFor(byId.get(button.dataset.figure)!);
      if (f) {
        $("figure-content").innerHTML =
          `<img src="${esc(sitePath(f.path))}" alt="${esc(f.alt)}"/>${caption(f)}`;
        dialogOpen(figure);
      }
    } else if (button.dataset.related) {
      const id = button.dataset.related;
      dialogClose(detail);
      const w = byId.get(id)!;
      if (!w.collections.includes(collection))
        switchCollection(w.collections[0]);
      openDetail(id);
    } else if (button.dataset.removeFilter) {
      const key = button.dataset.removeFilter;
      if (key === "category") view.category = "all";
      else if (key === "saved") view.saved = false;
      else if (key.startsWith("modality:"))
        view.modalities = view.modalities.filter((x) => x !== key.slice(9));
      else delete view.filters[key];
      render();
    }
  }
  if (!t.closest("#filter-panel") && !t.closest("#filters-toggle"))
    closeFilters();
});
let searchTimer: number | undefined;
search.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    view.query = search.value;
    render();
  }, 130);
});
sort.addEventListener("change", () => {
  view.sort = sort.value;
  render();
});
$("filter-fields").addEventListener("change", (event) => {
  const t = event.target as HTMLSelectElement;
  if (t.dataset.facet) {
    view.filters[t.dataset.facet] = t.value;
    render();
  }
});
$("modality-options").addEventListener("change", () => {
  view.modalities = Array.from(
    document.querySelectorAll<HTMLInputElement>("input[name=modality]:checked"),
  ).map((x) => x.value);
  render();
});
$("filters-toggle").addEventListener("click", () => {
  $("filter-panel").hidden ? openFilters() : closeFilters(true);
});
$("apply-filters").addEventListener("click", () => {
  closeFilters();
  $("filters-toggle").focus();
});
$("reset-filters").addEventListener("click", () => {
  view.filters = {};
  view.modalities = [];
  render();
});
$("empty-reset").addEventListener("click", reset);
$("saved-toggle").addEventListener("click", () => {
  view.saved = !view.saved;
  render();
});
$("view-toggle").addEventListener("click", () => {
  view.layout = view.layout === "cards" ? "index" : "cards";
  render();
});
$("share-view").addEventListener("click", () => {
  syncUrl();
  void copy(location.href);
});
$("load-more").addEventListener("click", appendBatch);
$("clear-compare").addEventListener("click", () => {
  selected.clear();
  renderTray();
  syncUrl();
});
$("open-compare").addEventListener("click", openCompare);
$("retry-load").addEventListener("click", () => void load());
$("export-view").addEventListener("click", () => {
  const hasSurveys = current.some((w) => !!w.survey),
    hasModels = current.some((w) => !!w.model);
  const fields: [string, string, string][] =
    collection === "benchmark"
      ? [
          ...BENCH_FIELDS,
          ["tasks", "Published task names"] as [string, string],
        ].map(([key, label]) => ["benchmark", key, label])
      : [
          ...POLICY_FIELDS.map(
            ([key, label]) =>
              ["policy", key, label] as [string, string, string],
          ),
          ...(hasModels
            ? MODEL_FIELDS.map(
                ([key, label]) =>
                  ["model", key, "Model: " + label] as [string, string, string],
              )
            : []),
          ...(hasSurveys
            ? SURVEY_FIELDS.map(
                ([key, label]) =>
                  ["survey", key, label] as [string, string, string],
              )
            : []),
        ];
  const quote = (x: unknown) => '"' + display(x).replaceAll('"', '""') + '"';
  const lines = [
    [
      "Name",
      "Title",
      "Record type",
      "Publication date",
      "Paper",
      "Project",
      "Code",
      "Data",
      "Weights",
      "Modalities",
      ...fields.map((f) => f[2]),
    ],
    ...current.map((w) => [
      nameFor(w, collection),
      w.title,
      recordTypeLabel(w, collection),
      w.date || "Undated",
      w.links.paper || "",
      w.links.project || "",
      w.links.code || "",
      w.links.data || "",
      w.links.weights || "",
      w.modalities.join("; "),
      ...fields.map(([prefix, key]) => {
        const obj =
          prefix === "survey"
            ? w.survey
            : prefix === "model"
              ? w.model
              : prefix === "benchmark"
                ? w.benchmark
                : w.policy;
        return obj?.[key] ?? (!obj ? "Not applicable" : "Not reported");
      }),
    ]),
  ];
  const blob = new Blob(
      ["\uFEFF" + lines.map((row) => row.map(quote).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    ),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `rgbdt-${collection}-${reviewed || "catalog"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`Exported ${current.length} records.`);
});
for (const d of [detail, compare, figure]) {
  d.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialogClose(d);
  });
  d.addEventListener("click", (event) => {
    if (event.target === d) {
      const r = d.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialogClose(d);
    }
  });
}
document.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement,
    panel = $("filter-panel");
  if (
    event.key === "/" &&
    !target.closest("input,textarea,select,[contenteditable]") &&
    !document.querySelector("dialog[open]") &&
    panel.hidden
  ) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape" && !panel.hidden) {
    event.preventDefault();
    closeFilters(true);
  }
  if (
    event.key === "Tab" &&
    !panel.hidden &&
    panel.getAttribute("aria-modal") === "true"
  ) {
    const nodes = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button,input,select,a[href],[tabindex="0"]',
      ),
    ).filter(
      (el) => !el.hasAttribute("disabled") && el.getClientRects().length,
    );
    const first = nodes[0],
      last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});
window.addEventListener("popstate", () => {
  const p = new URLSearchParams(location.search);
  collection = p.get("collection") === "policy" ? "policy" : "benchmark";
  view = fromParams(p, collection);
  selected = new Set(
    (p.get("compare") ?? "").split(",").filter(Boolean).slice(0, 4),
  );
  if (detail.open) dialogClose(detail);
  render();
  if (p.get("item")) openDetail(p.get("item")!);
});
void load();
