import { defineConfig } from "astro/config";
export default defineConfig({
  output: "static",
  site: "https://chang-xinhai.github.io",
  base: "/Awesome-RGBDT-Manipulation",
  trailingSlash: "always",
  build: { format: "directory" },
  server: { host: "127.0.0.1", port: 4345 },
  devToolbar: { enabled: false },
});
