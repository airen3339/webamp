import { defineConfig } from "vite";
import { getPlugins } from "./scripts/rollupPlugins.mjs";

export default defineConfig({
  build: {
    outDir: "../dist/demo-site",
  },
  root: "demo",
  // Used only by the demo site, not the library
  assetsInclude: ["**/*.wsz", "**/*.mp3"],
  optimizeDeps: {
    include: ["winamp-eqf"],
  },
  rollup: {},
  plugins: [
    ...getPlugins({ minify: true, outputFile: "foo", vite: true }),
    /*
    replace({
      // Ensure we don't use the dev build of React
      values: { "process.env.NODE_ENV": JSON.stringify("production") },
      preventAssignment: true,
    }),
    nodeResolve(),
    typescript({
      compilerOptions: {
        jsx: "react-jsx",
        module: "esnext",
        declarationDir: "dist/declarations",
      },
    }),
    commonjs(),
    babel({ babelHelpers: "bundled" }),
    */
  ],
  worker: {
    rollupOptions: {},
  },
});
