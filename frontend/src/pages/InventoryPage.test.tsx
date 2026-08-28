import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../test/render-app";

describe("mouvement de stock", () => {
  it("bloque un stock résultant négatif avant la mutation", async () => {
    const fetchMock = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (input) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me"))
          return jsonResponse({
            id: 1,
            fullName: "Nadia",
            email: "nadia@example.test",
            role: "MANAGER",
          });
        if (url.includes("/api/inventory"))
          return jsonResponse(
            page([
              {
                productId: 1,
                sku: "LIV-1",
                title: "Livre test",
                currentStock: 2,
                minimumThreshold: 1,
                active: true,
              },
            ]),
          );
        return jsonResponse({});
      });
    renderApp("/inventory");
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /enregistrer un mouvement/i }),
    );
    await user.click(screen.getByLabelText("Type de mouvement"));
    await user.click(await screen.findByRole("option", { name: "Endommagé" }));
    await user.type(screen.getByLabelText("Quantité"), "3");
    await user.type(screen.getByLabelText("Raison"), "Inventaire physique");
    expect(screen.getByText(/stock négatif/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Vérifier le mouvement" }),
    ).toBeDisabled();
    expect(
      fetchMock.mock.calls.some(([, init]) => init?.method === "POST"),
    ).toBe(false);
  });
});
