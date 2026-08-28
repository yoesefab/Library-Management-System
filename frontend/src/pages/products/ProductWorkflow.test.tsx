import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../../test/render-app";

const administrator = {
  id: 1,
  fullName: "Nadia El Mansouri",
  email: "nadia@example.test",
  role: "ADMINISTRATOR",
};

describe("catalogue produits", () => {
  it("charge les produits, le stock et préserve le sens du titre arabe", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/api/auth/me")) return jsonResponse(administrator);
      if (url.includes("/api/catalog/categories"))
        return jsonResponse(page([]));
      if (url.includes("/api/inventory"))
        return jsonResponse(
          page([
            {
              productId: 7,
              sku: "LIV-000704",
              title: "طفولة في مراكش",
              currentStock: 24,
              minimumThreshold: 7,
              active: true,
            },
          ]),
        );
      if (url.includes("/api/products"))
        return jsonResponse(
          page([
            {
              id: 7,
              sku: "LIV-000704",
              isbn: null,
              title: "طفولة في مراكش",
              language: "ar",
              sellingPrice: 64,
              category: "Roman",
              publisher: "Maison Maarif",
              active: true,
            },
          ]),
        );
      return jsonResponse({});
    });

    renderApp("/products");

    const title = await screen.findByText(
      "طفولة في مراكش",
      {},
      { timeout: 10_000 },
    );
    expect(title.closest("td")).toHaveAttribute("dir", "rtl");
    expect(
      await screen.findByText("24", {}, { timeout: 10_000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechercher" })).toBeEnabled();
  });

  it("soumet le formulaire typé au backend avec le jeton CSRF", async () => {
    const fetchMock = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (input, init) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) return jsonResponse(administrator);
        if (url.includes("/api/catalog/")) return jsonResponse(page([]));
        if (url.endsWith("/api/auth/csrf"))
          return jsonResponse({
            headerName: "X-CSRF-TOKEN",
            token: "test-token",
          });
        if (url.endsWith("/api/products") && init?.method === "POST")
          return jsonResponse({
            id: 99,
            sku: "LIV-TEST",
            title: "Livre de test",
            language: "fr",
            sellingPrice: 0,
            minimumStockThreshold: 0,
            authors: [],
            active: true,
          });
        if (url.includes("/api/products/99"))
          return jsonResponse({
            id: 99,
            sku: "LIV-TEST",
            title: "Livre de test",
            language: "fr",
            sellingPrice: 0,
            minimumStockThreshold: 0,
            authors: [],
            active: true,
          });
        if (url.includes("/api/inventory/products/99/movements"))
          return jsonResponse(page([]));
        return jsonResponse({});
      });

    renderApp("/products/new");
    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText("SKU *", {}, { timeout: 10_000 }),
      "LIV-TEST",
    );
    await user.type(screen.getByLabelText("Titre *"), "Livre de test");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([input, init]) =>
            String(input).endsWith("/api/products") && init?.method === "POST",
        ),
      ).toBe(true),
    );
    expect(
      fetchMock.mock.calls.some(([input]) =>
        String(input).endsWith("/api/auth/csrf"),
      ),
    ).toBe(true);
  });
});
