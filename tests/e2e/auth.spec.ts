import { test, expect } from '@playwright/test'

/**
 * Tests E2E pour l'authentification
 * - Inscription
 * - Connexion
 * - Déconnexion
 * - Routes protégées
 */

test.describe('Authentification', () => {
  test('Landing page affiche les liens auth', async ({ page }) => {
    await page.goto('/')

    // Vérifier que la page landing se charge
    await expect(page).toHaveTitle(/Planningo/)

    // Vérifier présence du lien connexion dans le header
    const loginLink = page.locator('a[href="/auth"]')
    await expect(loginLink).toBeVisible()
  })

  test('Page auth affiche le formulaire de connexion', async ({ page }) => {
    await page.goto('/auth')

    // Vérifier que les champs sont présents
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/mot de passe/i)).toBeVisible()

    // Vérifier les boutons
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
    await expect(page.getByText(/mot de passe oublié/i)).toBeVisible()
  })

  test('Routes protégées redirigent vers /auth si non connecté', async ({ page }) => {
    // Tenter d'accéder au dashboard sans être connecté
    await page.goto('/dashboard')

    // Devrait rediriger vers /auth
    await page.waitForURL('**/auth')
    await expect(page.url()).toContain('/auth')
  })

  test('Validation email côté client', async ({ page }) => {
    await page.goto('/auth')

    // Entrer un email invalide
    await page.getByPlaceholder(/email/i).fill('invalidemail')
    await page.getByPlaceholder(/mot de passe/i).fill('password123')
    await page.getByRole('button', { name: /se connecter/i }).click()

    // Vérifier qu'une erreur de validation HTML5 est affichée
    const emailInput = page.getByPlaceholder(/email/i)
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage)
    expect(validationMessage).toBeTruthy()
  })

  test('Lien "Mot de passe oublié" redirige vers reset-password', async ({ page }) => {
    await page.goto('/auth')

    // Cliquer sur "Mot de passe oublié"
    await page.getByText(/mot de passe oublié/i).click()

    // Vérifier redirection vers /auth/reset-password
    await page.waitForURL('**/auth/reset-password')
    await expect(page.url()).toContain('/auth/reset-password')

    // Vérifier présence du champ email
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
  })
})
