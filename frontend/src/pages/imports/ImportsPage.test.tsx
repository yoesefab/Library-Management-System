import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, page, renderApp } from "../../test/render-app";

describe("imports CSV", () => {
  it("affiche les erreurs de prévisualisation et bloque la confirmation", async () => {
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
        if (
          url.includes("/api/imports/sales/preview") &&
          init?.method === "POST"
        )
          return jsonResponse({
            id: 8,
            fileName: "ventes.csv",
            checksum: "1234567890abcdef",
            status: "VALIDATED",
            totalRows: 2,
            successfulRows: 1,
            failedRows: 1,
            errors: [
              {
                rowNumber: 2,
                field: "quantity",
                code: "INVALID_QUANTITY",
                message: "La quantité doit être positive.",
                rejectedValue: "-3",
              },
            ],
            startedAt: "2026-08-28T10:00:00Z",
            completedAt: null,
          });
        if (url.includes("/api/imports")) return jsonResponse(page([]));
        return jsonResponse({});
      });

    const { container } = renderApp("/imports");
    const input = await waitFor(
      () => {
        const element =
          container.querySelector<HTMLInputElement>('input[type="file"]');
        expect(element).not.toBeNull();
        return element as HTMLInputElement;
      },
      { timeout: 10_000 },
    );
    await userEvent.upload(
      input,
      new File(["sku,quantity\nLIV-1,-3"], "ventes.csv", { type: "text/csv" }),
    );

    expect(
      await screen.findByText("La quantité doit être positive."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmer l’import" }),
    ).toBeDisabled();
    expect(
      fetchMock.mock.calls.some(
        ([request, init]) =>
          String(request).includes("/api/imports/sales/preview") &&
          init?.method === "POST",
      ),
    ).toBe(true);
  });
});
