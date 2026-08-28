import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../../test/render-app";

describe("autorisation par rôle", () => {
  it("masque la navigation de gestion pour un employé de stock", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/api/auth/me"))
        return jsonResponse({
          id: 2,
          fullName: "Employé Stock",
          email: "stock@example.test",
          role: "STOCK_EMPLOYEE",
        });
      if (url.includes("/api/inventory")) return jsonResponse(page([]));
      return jsonResponse(page([]));
    });
    renderApp("/inventory");
    expect(await screen.findByText("Employé Stock")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Tableau de bord" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Administration" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Inventaire" }),
    ).toBeInTheDocument();
  });

  it("redirige une route protégée vers la connexion", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(jsonResponse({}, 401));
    renderApp("/products");
    expect(
      await screen.findByRole("heading", { name: /connectez-vous/i }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });
});
