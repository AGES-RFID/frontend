import tailwind from "bun-plugin-tailwind";

await Bun.$`rm -rf ./dist`;

await Bun.build({
  entrypoints: ["./public/index.html"],
  publicPath: "/",
  plugins: [tailwind],
  outdir: "./dist",
  env: "inline",
});
