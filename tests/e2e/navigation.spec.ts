import { test, expect } from '@playwright/test'

/**
 * Tests E2E pour la navigation générale
 * - Pages principales accessibles
 * - Header navigation
 * - Footer liens
 * - Responsive
 */

test.describe('Navigation générale', () => {
  test('Landing page se charge correctement', async ({ page }) => {
    await page.goto('/')

    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Planningo/)

    // Vérifier présence du logo/titre principal
    await expect(page.getByText(/planningo/i).first()).toBeVisible()

    // Vérifier présence des CTA
    await expect(page.getByRole('link', { name: /essayer|commencer/i }).first()).toBeVisible()
  })

  test('Header contient les liens principaux', async ({ page }) => {
    await page.goto('/')

    // Attendre que le header soit chargé
    const header = page.locator('header, nav').first()
    await expect(header).toBeVisible()

    // Vérifier les liens principaux (Pricing, Auth)
    await expect(page.getByRole('link', { name: /tarifs|pricing/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /connexion|se connecter/i })).toBeVisible()
  })

  test('Navigation vers page pricing fonctionne', async ({ page }) => {
    await page.goto('/')

    // Cliquer sur le lien Pricing
    await page.getByRole('link', { name: /tarifs|pricing/i }).click()

    // Vérifier redirection vers /pricing
    await page.waitForURL('**/pricing')
    await expect(page.url()).toContain('/pricing')
  })

  test('Navigation vers page auth fonctionne', async ({ page }) => {
    await page.goto('/')

    // Cliquer sur le lien Connexion
    await page.getByRole('link', { name: /connexion|se connecter/i }).click()

    // Vérifier redirection vers /auth
    await page.waitForURL('**/auth')
    await expect(page.url()).toContain('/auth')
  })

  test('Page 404 fonctionne pour route inexistante', async ({ page }) => {
    const response = await page.goto('/route-inexistante-test-123')

    // Vérifier status 404
    expect(response?.status()).toBe(404)
  })
})

test.describe('Responsive design', () => {
  test('Mobile: menu navigation accessible', async ({ page }) => {
    // Définir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Le header devrait toujours être visible (même si compact)
    const header = page.locator('header, nav').first()
    await expect(header).toBeVisible()
  })

  test('Desktop: navigation complète visible', async ({ page }) => {
    // Définir viewport desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Tous les liens du header devraient être visibles
    await expect(page.getByRole('link', { name: /tarifs|pricing/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /connexion|se connecter/i })).toBeVisible()
  })
})
