import { vi, expect, it, describe, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
// import { userEvent } from "@testing-library/user-event";
// import Link from "../components/Link.jsx";
import React from "react";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
describe("managers/config", () => {
  // beforeEach(() => {
  //   // reset the state of in-memory fs
  //   vol.reset();
  // });
  it("loading of jdt schema", async () => {
    vi.stubGlobal("fetch", (target) => {
      expect(target).toBe("/graphql.jdt");
      return Promise.resolve({
        json: () => {
          act(() => Promise.resolve({}));
        },
      });
    });
    act(() => {
      render(
        <PartonUIConfigManager config={configDefaults}>
          {"Loaded"}
        </PartonUIConfigManager>,
      );
    });

    expect(screen.getByText("Loaded")).toBeTruthy();
  });
});
