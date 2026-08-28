import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { jsonResponse, renderApp } from "../test/render-app";

describe("rapports", () => {
  it("télécharge le CSV avec le nom renvoyé par le backend", async () => {
    const createObjectUrl = vi.fn(() => "blob:test");
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectUrl,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectUrl,
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
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
        if (url.includes("/api/reports/inventory.csv"))
          return new Response("sku,stock\nLIV-1,3", {
            status: 200,
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition":
                'attachment; filename="inventaire-2026.csv"',
            },
          });
        return jsonResponse({});
      });

    renderApp("/reports");
    const user = userEvent.setup();
    const option = (
      await screen.findByRole(
        "heading",
        { name: "Inventaire complet" },
        { timeout: 10_000 },
      )
    ).closest(".report-option");
    expect(option).not.toBeNull();
    await user.click(
      within(option as HTMLElement).getByRole("button", { name: "CSV" }),
    );

    await waitFor(() => expect(click).toHaveBeenCalled());
    expect(
      fetchMock.mock.calls.some(([request]) =>
        String(request).includes("/api/reports/inventory.csv"),
      ),
    ).toBe(true);
    expect(createObjectUrl).toHaveBeenCalled();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:test");
  });
});
