import { expect, it, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom/vitest";
import "vitest-fetch-mock";

import PartonUIConfigManager, {
  configDefaults,
} from "../../src/managers/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { CborEncoder } from "@jsonjoy.com/json-pack/lib/cbor";

describe("managers/config", () => {
  it("loading of jdt schema", async () => {
    fetchMock.mockOnceIf("http://localhost/graphql.jdt", () => {
      const encoder = new CborEncoder();
      const val = encoder.encode({});
      return new Response(val);
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
