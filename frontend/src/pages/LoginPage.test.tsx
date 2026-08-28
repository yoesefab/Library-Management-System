import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, renderApp } from "../test/render-app";

describe("authentification", () => {
  it("connecte un gestionnaire et restaure la destination", async () => {
    const fetchMock = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (input, init) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me"))
          return jsonResponse(
            {
              status: 401,
              code: "AUTHENTICATION_REQUIRED",
              message: "Accès refusé.",
            },
            401,
          );
        if (url.endsWith("/api/auth/login") && init?.method === "POST")
          return jsonResponse({
            id: 1,
            fullName: "Nadia El Mansouri",
            email: "nadia@example.test",
            role: "MANAGER",
          });
        if (url.includes("/api/dashboard"))
          return jsonResponse({
            totalRevenue: 0,
            numberOfOrders: 0,
            unitsSold: 0,
            averageOrderValue: 0,
            currentStockQuantity: 0,
            inventoryValue: 0,
            lowStockProducts: 0,
            outOfStockProducts: 0,
            stockTurnover: 0,
            estimatedDaysRemaining: 0,
            bestsellingProducts: [],
            slowMovingProducts: [],
            salesByCategory: [],
            salesByLanguage: [],
            revenueTrend: [],
          });
        if (url.includes("/api/catalog/")) return jsonResponse({ content: [] });
        return jsonResponse({});
      });
    renderApp("/login");
    const user = userEvent.setup();
    await screen.findByRole("heading", { name: /connectez-vous/i });
    await user.type(
      screen.getByLabelText("Adresse e-mail"),
      "nadia@example.test",
    );
    await user.type(screen.getByLabelText("Mot de passe"), "mot-de-passe-test");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(
      await screen.findByText("Nadia El Mansouri", {}, { timeout: 10_000 }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("présente l’erreur d’identifiants sans simuler de succès", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async (input) =>
      String(input).endsWith("/api/auth/me")
        ? jsonResponse({}, 401)
        : jsonResponse(
            { status: 401, code: "BAD_CREDENTIALS", message: "Accès refusé." },
            401,
          ),
    );
    renderApp("/login");
    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText("Adresse e-mail"),
      "nadia@example.test",
    );
    await user.type(
      screen.getByLabelText("Mot de passe"),
      "incorrect-password",
    );
    await user.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(
      (await screen.findAllByText("Adresse e-mail ou mot de passe incorrect."))
        .length,
    ).toBeGreaterThan(1);
  });

  it("valide les champs avant le réseau", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(jsonResponse({}, 401));
    renderApp("/login");
    await userEvent.click(
      await screen.findByRole("button", { name: "Se connecter" }),
    );
    expect(
      await screen.findByText("L’adresse e-mail est requise."),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Le mot de passe est requis.").length,
    ).toBeGreaterThan(0);
  });

  it("restaure une session après rechargement", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/api/auth/me"))
        return jsonResponse({
          id: 1,
          fullName: "Nadia El Mansouri",
          email: "nadia@example.test",
          role: "MANAGER",
        });
      if (url.includes("/api/products"))
        return jsonResponse({
          content: [],
          page: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
        });
      if (url.includes("/api/catalog/categories"))
        return jsonResponse({ content: [] });
      return jsonResponse({});
    });
    renderApp("/products");
    expect(await screen.findByText("Nadia El Mansouri")).toBeInTheDocument();
    await waitFor(() => expect(window.location.pathname).toBe("/products"));
  });
});
