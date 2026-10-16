import { works, figures, REVIEWED } from "../lib/catalog";
export const GET = () =>
  new Response(
    JSON.stringify({
      reviewed: REVIEWED,
      works: works.map(({ imageCandidates, ...w }) => w),
      figures,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
