import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../test/render-app";

describe("prévisions", () => {
  it("affiche explicitement le modèle de repli fourni par le backend", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async (input, init) => {
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
      if (url.includes("/api/products"))
        return jsonResponse(
          page([
            {
              id: 7,
              sku: "LIV-7",
              title: "Livre test",
              language: "fr",
              sellingPrice: 80,
              category: "Roman",
              publisher: "Maarif",
              active: true,
            },
          ]),
        );
      if (url.includes("/api/forecasting/recommendations"))
        return jsonResponse(page([]));
      if (
        url.includes("/api/forecasting/products/7/generate") &&
        init?.method === "POST"
      )
        return jsonResponse({
          id: 2,
          productId: 7,
          sku: "LIV-7",
          title: "Livre test",
          periodStart: "2026-09-01",
          periodEnd: "2026-09-30",
          method: "MOVING_AVERAGE_FALLBACK",
          predictedDemand: 12,
          accuracyMetric: "MAE",
          accuracyValue: 2.1,
          generatedAt: "2026-08-28T10:00:00Z",
          parameters: "window=3",
          explanation: "Modèle de repli utilisé faute d’historique suffisant.",
        });
      return jsonResponse({});
    });

    renderApp("/forecasting");
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole(
        "button",
        { name: "Générer la prévision" },
        { timeout: 10_000 },
      ),
    );
    expect(
      await screen.findByText(
        "Modèle de repli utilisé faute d’historique suffisant.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("moving average fallback")).toBeInTheDocument();
  });
});
