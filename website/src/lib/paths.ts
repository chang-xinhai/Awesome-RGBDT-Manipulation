/** Resolve a local asset or route under Astro's configured deployment base. */
export function sitePath(path = ""): string {
  return (
    import.meta.env.BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "")
  );
}
