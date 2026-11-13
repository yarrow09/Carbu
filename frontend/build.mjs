// Construit le bundle unique servi par l'intégration.
import * as esbuild from "esbuild";

const options = {
  entryPoints: ["src/index.ts"],
  outfile: "../custom_components/vehicle_log/www/vehicle-log-cards.js",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  sourcemap: false,
  legalComments: "eof",
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
