import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";
describe("pagination", () => {
  it("navigue et protège les bornes", async () => {
    const onChange = vi.fn();
    render(
      <Pagination
        page={0}
        totalPages={3}
        totalElements={41}
        onChange={onChange}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Page précédente" }),
    ).toBeDisabled();
    await userEvent.click(
      screen.getByRole("button", { name: "Page suivante" }),
    );
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
