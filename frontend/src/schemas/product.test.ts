import { describe, expect, it } from "vitest";
import { productSchema } from "./product";
describe("validation produit", () => {
  it("refuse un SKU et un prix invalides", () => {
    const result = productSchema.safeParse({
      sku: "SKU interdit!",
      title: "",
      language: "fr",
      sellingPrice: -1,
      minimumStockThreshold: 0,
      authorIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["sku", "title", "sellingPrice"]),
      );
  });
});
