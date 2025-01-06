import { expect, it, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom/vitest";
import "vitest-fetch-mock";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
import ApolloManager from "../../src/managers/apollo";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { CborEncoder } from "@jsonjoy.com/json-pack/lib/cbor";
describe("managers/apollo", () => {
  it("loading of jdt schema", async () => {
    fetchMock.mockOnceIf("http://localhost/graphql.jdt", (request) => {
      const encoder = new CborEncoder();
      const val = encoder.encode({
        def: {
          User: {
            p: {},
          },
          UserEdge: {
            p: {
              node: {
                ref: "User",
              },
            },
          },
          UserList: {
            p: {
              edges: {
                el: {
                  ref: "UserEdge",
                },
              },
            },
          },
          QueryModels: {
            p: {
              User: {
                ref: "UserList",
              },
            },
          },
        },
      });
      return new Response(val);
    });
    act(() => {
      render(
        <PartonUIConfigManager config={configDefaults}>
          <ApolloManager>{"Loaded"}</ApolloManager>
        </PartonUIConfigManager>,
      );
    });
    const element = await waitFor(() => screen.getByText("Loaded"));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(element).toBeInTheDocument();
  });
});
