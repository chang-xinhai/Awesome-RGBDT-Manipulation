# RGBDT visual atlas

An Astro static website generated from `../data/works.json`, with separate
benchmark and policy discovery, evidence, figures and comparison fields.

```sh
cd website
npm ci
npm run dev -- --host 127.0.0.1 --port 4345
```

Local preview: <http://127.0.0.1:4345/Awesome-RGBDT-Manipulation/>.

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
architecture. Surveys appear within relevant categories, use conceptual
taxonomy figures, and have scope/corpus fields instead of policy training
specifications. The Record type filter separates surveys and methods; surveys
do not increase the executable-policy count. Citation trails and scope
decisions are available under Coverage. Click figures to enlarge. Supporting resources are a distinct
category. Cost and simulator fields preserve the source's version and scope.

Public website: <https://chang-xinhai.github.io/Awesome-RGBDT-Manipulation/>.
Repository: <https://github.com/chang-xinhai/Awesome-RGBDT-Manipulation>.

The approved Ego atlas scale is shared: desktop viewports from 901 CSS pixels use
an 80% root design scale; viewports from 1280 pixels show four cards across.
Compact and mobile layouts keep their original type and control sizes. All
internal routes and assets resolve under the configured GitHub Pages base path.

`.github/workflows/deploy-website.yml` validates the generated catalog, runs the
website checks and deploys successful main-branch builds to GitHub Pages.
Pull requests run the same checks without deployment. Candidate discovery never
adds or publishes records automatically.
