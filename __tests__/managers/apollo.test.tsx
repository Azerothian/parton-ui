import { expect, it, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
import ApolloManager from "../../src/managers/apollo";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
describe("managers/apollo", () => {
  it("loading of jdt schema", async () => {
    fetchMock.mockOnceIf("/graphql.jdt", () => {
      return {
        body: JSON.stringify({
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
        }),
      };
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
