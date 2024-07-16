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
  it("loading of jdt schema", async () => {
    vi.stubGlobal("fetch", (target: string) => {
      expect(target).toBe("/graphql.jdt");

      return new Promise((resolve) => {
        return resolve({
          json: () => Promise.resolve({}),
        });
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
