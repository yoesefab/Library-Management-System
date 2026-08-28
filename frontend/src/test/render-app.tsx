import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { App } from "../App";
import { AppProviders } from "../app/providers";
import { queryClient } from "../app/query-client";
import { resetCsrfToken } from "../api/client";

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
export const page = <T,>(content: T[]) => ({
  content,
  page: 0,
  size: 20,
  totalElements: content.length,
  totalPages: content.length ? 1 : 0,
  first: true,
  last: true,
});
export function renderApp(path = "/") {
  window.history.replaceState({}, "", path);
  return render(
    <AppProviders>
      <App />
    </AppProviders>,
  );
}

beforeEach(() => {
  queryClient.clear();
  resetCsrfToken();
  vi.restoreAllMocks();
});
afterEach(() => cleanup());
