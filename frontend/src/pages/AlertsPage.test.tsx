import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../test/render-app";

describe("alertes de stock", () => {
  it("résout une alerte ouverte via la mutation protégée", async () => {
    const fetchMock = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (input, init) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me"))
          return jsonResponse({
            id: 1,
            fullName: "Nadia",
            email: "nadia@example.test",
            role: "MANAGER",
          });
        if (url.endsWith("/api/auth/csrf"))
          return jsonResponse({ headerName: "X-CSRF-TOKEN", token: "token" });
        if (url.includes("/api/alerts/4/resolve") && init?.method === "POST")
          return jsonResponse({ id: 4, status: "RESOLVED" });
        if (url.includes("/api/alerts"))
          return jsonResponse(
            page([
              {
                id: 4,
                productId: 9,
                sku: "LIV-9",
                productTitle: "Le Pain nu",
                type: "LOW_STOCK",
                severity: "WARNING",
                explanation: "Le stock a franchi le seuil minimum.",
                status: "OPEN",
                createdAt: "2026-08-28T10:00:00Z",
                acknowledgedAt: null,
                resolvedAt: null,
              },
            ]),
          );
        return jsonResponse({});
      });

    renderApp("/alerts");
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole(
        "button",
        { name: "Résoudre" },
        { timeout: 10_000 },
      ),
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([request, init]) =>
            String(request).includes("/api/alerts/4/resolve") &&
            init?.method === "POST",
        ),
      ).toBe(true),
    );
  });
});
