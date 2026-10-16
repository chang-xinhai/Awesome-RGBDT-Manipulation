# Local visual atlas

An Astro static website generated from `../data/works.json`, with separate
benchmark and policy discovery, evidence, figures and comparison fields.

```sh
cd website
npm ci
npm run dev -- --host 127.0.0.1 --port 4345
```

Local preview: <http://127.0.0.1:4345>.

```sh
npm test
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4346
```

The production build is static and needs no credentials or API keys. Research
figures and fonts are stored locally; the catalog requires no external image or
data requests to render. External paper, project and code links open their
original sources.

Search includes published task names, simulators, models, deployment inputs,
training data and resources. Each collection retains its own query, facets,
sort, view and comparison while switching. Shared URLs restore the active view
and selected detail. Saved records stay in this browser's local storage.

Benchmark figures show task coverage or taxonomy; policy figures show method
architecture. Click figures to enlarge. Supporting resources are a distinct
category. Cost and simulator fields preserve the source's version and scope.

This checkout is local only. There is no GitHub repository, remote, publication
workflow, hosting configuration or automatic external deployment.
