import { test, expect } from '@playwright/test'

/**
 * Tests E2E pour le Dashboard (utilisateur connecté)
 *
 * Note: Ces tests nécessitent un utilisateur de test dans Supabase
 * Pour l'instant, ils testent uniquement l'accès au dashboard sans authentification réelle
 */

test.describe('Dashboard (accès)', () => {
  test('Dashboard redirige vers /auth si non connecté', async ({ page }) => {
    await page.goto('/dashboard')

    // Devrait rediriger vers /auth via middleware (vérifier juste le chemin)
    await page.waitForLoadState('networkidle')
    await expect(page.url()).toContain('/auth')
  })

  test('Page pricing affiche les 3 plans', async ({ page }) => {
    await page.goto('/pricing')

    // Vérifier présence des 3 plans (utiliser .first() pour éviter strict mode)
    await expect(page.getByRole('heading', { name: /mode test/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /^gratuit$/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /^pro$/i })).toBeVisible()

    // Vérifier le prix Pro
    await expect(page.getByText(/5€/i).first()).toBeVisible()
  })

  test('Bouton checkout Stripe visible sur pricing', async ({ page }) => {
    await page.goto('/pricing')

    // Chercher le bouton Pro
    const proButton = page.getByRole('button', { name: /commencer|essayer|choisir pro/i })
    await expect(proButton.first()).toBeVisible()
  })
})

test.describe('Dashboard (avec auth mock)', () => {
  // Ces tests nécessiteraient un setup d'authentification de test
  // Pour l'instant, on les marque comme skip et on les implémentera plus tard

  test.skip('Utilisateur connecté peut voir ses agendas', async ({ page }) => {
    // TODO: Implémenter avec fixture d'auth Supabase
  })

  test.skip('Peut créer un nouvel agenda depuis dashboard', async ({ page }) => {
    // TODO: Implémenter avec fixture d'auth
  })

  test.skip('Peut supprimer un agenda existant', async ({ page }) => {
    // TODO: Implémenter avec fixture d'auth
  })
})
