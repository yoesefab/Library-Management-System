import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test("connexion, catalogue, inventaire et déconnexion", async ({ page }) => {
  test.skip(
    !email || !password,
    "Définir E2E_EMAIL et E2E_PASSWORD pour le backend synthétique local.",
  );
  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill(email!);
  await page.getByLabel("Mot de passe").fill(password!);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Tableau de bord" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Produits", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Produits" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Inventaire", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "État de l’inventaire" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /se déconnecter/i }).click();
  await expect(
    page.getByRole("heading", { name: /connectez-vous/i }),
  ).toBeVisible();
});
