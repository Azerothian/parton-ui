import { vi, expect, it, describe, beforeEach } from "vitest";
import { createFsFromVolume, vol } from "memfs";
import { buildComponentsFile } from "../../src/tools/build.ts";
import path from "path";

const buildOutput = `
/* eslint-disable camelcase */
/* eslint-disable eol-last */
import React from "react";

export default {
  "/prefix/components/main": React.lazy(() => import("./prefix/components/main")),
};
`;

const fs = createFsFromVolume(vol);

vi.mock("node:fs", () => createFsFromVolume(vol));
vi.mock("node:fs/promises", () => ({
  default: createFsFromVolume(vol).promises,
}));

vi.mock("globby", () => ({
  globby: async () => {
    return ["components/", "components/main.tsx"];
  },
}));
// vi.mock('fs/promises');

describe("tools/build", () => {
  beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset();
  });
  it("buildComponentsFile - test", async () => {
    const cwd = "/project";
    vol.mkdirSync(path.resolve(cwd, "./src"), { recursive: true });
    vol.fromJSON(
      {
        "src/components/main.tsx": "Main Component",
      },
      // default cwd
      cwd,
    );
    // console.log("cwd", cwd);
    // console.log("vol", vol.toJSON());

    try {
      await buildComponentsFile(
        cwd,
        "./src/components",
        "./src/component.ts",
        "/prefix",
      );
    } catch (error) {
      console.error(error);
      expect(false).toBeTruthy();
    }

    const content = await fs.promises.readFile(
      "/project/src/component.ts",
      "utf-8",
    );
    expect(content).toBe(`
/* eslint-disable camelcase */
/* eslint-disable eol-last */
import React from "react";

export default {
  "/prefix/components/main": React.lazy(() => import("./prefix/components/main")),
};
`);
  });
});
