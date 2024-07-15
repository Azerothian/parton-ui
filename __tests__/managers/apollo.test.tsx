import { vi, expect, it, describe, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
// import { userEvent } from "@testing-library/user-event";
// import Link from "../components/Link.jsx";
import React from "react";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
import ApolloManager from "../../src/managers/apollo";
describe("managers/apollo", () => {
  // beforeEach(() => {
  //   // reset the state of in-memory fs
  //   vol.reset();
  // });
  it("loading of jdt schema", async () => {
    vi.stubGlobal("fetch", (target) => {
      switch (target) {
        case "/graphql.jdt":
          return () =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  def: {},
                }),
            });
        default:
          return Promise.resolve({
            json: () => act(() => Promise.resolve({})),
          });
      }
    });
    act(() => {
      render(
        <PartonUIConfigManager config={configDefaults}>
          <ApolloManager>{"Loaded"}</ApolloManager>
        </PartonUIConfigManager>,
      );
    });

    expect(screen.getByText("Loaded")).toBeTruthy();
  });
});
