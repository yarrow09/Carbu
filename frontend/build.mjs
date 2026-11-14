// Construit le bundle unique servi par l'intégration.
import { readFileSync } from "node:fs";

import * as esbuild from "esbuild";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));

const options = {
  entryPoints: ["src/index.ts"],
  outfile: "../custom_components/carbu/www/carbu-cards.js",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  sourcemap: false,
  legalComments: "eof",
  logLevel: "info",
  define: { __CARBU_VERSION__: JSON.stringify(version) },
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
