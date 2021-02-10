import fs from "fs";
import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { terser } from "rollup-plugin-terser";

const output_dir = "./dist";

const is_publish = !!process.env.PUBLISH;

const ts_plugin = is_publish
  ? typescript({
      target: "es5",
      include: "src/**",
      outDir: output_dir,
      typescript: require("typescript"),
    })
  : sucrase({
      exclude: ['node_modules/**'],
      transforms: ["typescript"],
    });

const dump = (file) => path.join(output_dir, file);

const copy = (files) =>
  files.forEach((file) => fs.copyFileSync(file, dump(file)));

const rmdir = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);

    if (files.length > 0) {
      files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          rmdir(dir + "/" + file);
        } else {
          fs.unlinkSync(path.join(dir, file));
        }
      });
    }
  }
};

const mkdir = (dir) => !(fs.existsSync(dir) && fs.statSync(dir).isDirectory()) && fs.mkdirSync(dir);


const types = (dest = "index.d.ts", src = "../types/index", module = "*") => {
  return {
    writeBundle() {
      fs.writeFileSync(dump(dest), `export ${module} from "${src}";`);
    },
  };
};

const main = {
  input: "src/index.ts",
  output: [
    {
      file: dump("index.js"),
      format: "cjs"
    }
  ],
  plugins: [
    ts_plugin,
    resolve(),
    rmdir(output_dir),
    mkdir(output_dir),
    copy(["package.json", "README.md", "LICENSE"]),
    types("index.d.ts", "./types/index", "*"),
  ],
  external: [
    "magic-string",
    "windicss"
  ]
};

const browser = {
  input: "src/index.ts",
  output: [
    {
      file: dump("browser.js"),
      format: "cjs"
    }
  ],
  plugins: [
    ts_plugin,
    resolve(),
    nodePolyfills(),
    terser()
  ]
};

export default is_publish? [ main, browser ] : main;