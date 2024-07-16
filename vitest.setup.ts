import "@testing-library/jest-dom/vitest";
import "vitest-fetch-mock";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  // if you have an existing `beforeEach` just add the following line to it
  fetchMocker.doMock();
});

afterEach(() => {
  cleanup();
});
