import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../test/render-app";

const manager = {
  id: 1,
  fullName: "Nadia El Mansouri",
  email: "nadia@example.test",
  role: "MANAGER",
};

const dashboard = {
  totalRevenue: 12500,
  numberOfOrders: 42,
  unitsSold: 58,
  averageOrderValue: 297.62,
  currentStockQuantity: 900,
  inventoryValue: 45000,
  lowStockProducts: 3,
  outOfStockProducts: 2,
  stockTurnover: 1.2,
  estimatedDaysRemaining: 40,
  bestsellingProducts: [],
  slowMovingProducts: [],
  salesByCategory: [],
  salesByLanguage: [],
  revenueTrend: [],
};

describe("tableau de bord", () => {
  it("affiche un squelette pendant le chargement des indicateurs", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/api/auth/me")) return jsonResponse(manager);
      if (url.includes("/api/catalog/")) return jsonResponse(page([]));
      if (url.includes("/api/dashboard"))
        return new Promise<Response>(() => undefined);
      return jsonResponse({});
    });

    renderApp("/dashboard");

    expect(
      await screen.findByRole(
        "status",
        {
          name: "Chargement du tableau de bord",
        },
        { timeout: 10_000 },
      ),
    ).toBeInTheDocument();
  });

  it("transmet les filtres auteur et les bornes en heure de Casablanca", async () => {
    const fetchMock = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (input) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) return jsonResponse(manager);
        if (url.includes("/api/catalog/authors"))
          return jsonResponse(page([{ id: 12, name: "Fatima Mernissi" }]));
        if (url.includes("/api/catalog/")) return jsonResponse(page([]));
        if (url.includes("/api/dashboard")) return jsonResponse(dashboard);
        return jsonResponse({});
      });

    renderApp("/dashboard");
    const user = userEvent.setup();
    await screen.findByText("Chiffre d’affaires", {}, { timeout: 10_000 });
    await user.clear(screen.getByLabelText("Du"));
    await user.type(screen.getByLabelText("Du"), "2026-08-10");
    await user.click(screen.getByLabelText("Auteur"));
    await user.click(
      await screen.findByRole("option", { name: "Fatima Mernissi" }),
    );

    await waitFor(() => {
      const request = fetchMock.mock.calls.find(([input]) => {
        const url = decodeURIComponent(String(input));
        return (
          url.includes("/api/dashboard") &&
          url.includes("authorId=12") &&
          url.includes("start=2026-08-09T23:00:00.000Z")
        );
      });
      expect(request).toBeDefined();
    });
  });
});
