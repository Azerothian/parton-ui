import { expect, it, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

describe("managers/config", () => {
  it("loading of jdt schema", async () => {
    fetchMock.mockOnceIf("/graphql.jdt", () => {
      return {
        body: JSON.stringify({}),
      };
    });
    act(() => {
      render(
        <PartonUIConfigManager config={configDefaults}>
          {"Loaded"}
        </PartonUIConfigManager>,
      );
    });

    const element = await waitFor(() => screen.getByText("Loaded"));
    expect(element).toBeInTheDocument();
  });
});
