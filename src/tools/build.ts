/// <reference types="@types/node" />
import path from "path";
import { globby } from "globby";
import fs from "node:fs/promises";

function isFolder(f: string) {
  return path.extname(f) === "";
}
export async function buildComponentsFile(cwd = process.cwd(), input = "./src/components/", output = "./src/component.ts", base = "/components") {
  const header: string[] = [];
  const expt: string[] = [];
  const dir = path.resolve(cwd, input);
  const results =  await globby("**/*", {
    expandDirectories: true,
    onlyFiles: true,
    markDirectories: false,
    cwd: dir,
  });
  const directories = results.sort(function (a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  directories.forEach((file, index) => {
    const f = `/${file}`;
    let d = path.dirname(f);
    if (d === "/") {
      d = "";
    }
    const name = path.basename(f, path.extname(f));
    const p = `${base}${d}/${name}`;
    if (!isFolder(f)) {
      expt.push(`  "${p}": React.lazy(() => import(".${p}")),`);
    }
  });
  const txt = `
/* eslint-disable camelcase */
/* eslint-disable eol-last */
import React from "react";
${header.join("\n")}
export default {
${expt.join("\n")}
};
`;
  const target = path.resolve(cwd, output);
  await fs.writeFile(target, txt, {
    encoding: "utf-8",
  });
  // console.log("output", target)
}
