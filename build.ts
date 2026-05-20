import tailwind from "bun-plugin-tailwind";

await Bun.$`rm -rf ./dist`;

await Bun.build({
  entrypoints: ["./public/index.html"],
  publicPath: "/",
  outdir: "./dist",
  env: "inline",
  plugins: [
    tailwind,
    {
      name: "keep-env-js",
      setup(build) {
        build.onResolve({ filter: /env\.js$/ }, (args) => ({
          path: args.path,
          external: true,  // tells bun: don't touch this
        }));
      },
    },
  ],
});
