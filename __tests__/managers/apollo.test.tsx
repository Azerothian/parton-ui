import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import "vitest-fetch-mock";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
import ApolloManager from "../../src/managers/apollo";
describe("managers/apollo", () => {
  it("loading of jdt schema", () => {
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

    expect(screen.getByText("Loaded")).toBeTruthy();
  });
});
