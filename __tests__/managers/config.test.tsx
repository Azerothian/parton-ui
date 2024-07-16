import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
describe("managers/config", () => {
  it("loading of jdt schema", () => {
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

    expect(screen.getByText("Loaded")).toBeTruthy();
  });
});
