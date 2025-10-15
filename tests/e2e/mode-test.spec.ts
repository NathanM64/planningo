import { test, expect } from '@playwright/test'

/**
 * Tests E2E pour le mode Test (sans compte)
 * - Création agenda
 * - Ajout membres
 * - Ajout créneaux
 * - Limites mode Test (2 membres max)
 */

test.describe('Mode Test (sans compte)', () => {
  test('Utilisateur peut créer un agenda en mode Test', async ({ page }) => {
    await page.goto('/')

    // Cliquer sur "Essayer sans compte" ou accéder directement à /editor
    await page.goto('/editor')

    // Vérifier que l'éditeur se charge
    await expect(page.getByText(/planningo/i)).toBeVisible()

    // Vérifier présence du badge "Test"
    await expect(page.getByText(/test/i)).toBeVisible()
  })

  test('Peut ajouter un membre en mode Test', async ({ page }) => {
    await page.goto('/editor')

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle')

    // Ouvrir la modal d'ajout de membre (chercher bouton + ou "Ajouter membre")
    const addMemberButton = page.locator('button').filter({ hasText: /ajouter membre|nouveau membre|\+/i }).first()
    await addMemberButton.click()

    // Remplir le nom du membre
    await page.getByPlaceholder(/nom du membre/i).fill('Alice')

    // Sélectionner une couleur
    const colorPicker = page.locator('input[type="color"]')
    await colorPicker.click()

    // Sauvegarder
    await page.getByRole('button', { name: /ajouter|enregistrer/i }).click()

    // Vérifier que le membre apparaît dans la liste
    await expect(page.getByText('Alice')).toBeVisible()
  })

  test('Mode Test limite à 2 membres', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Ajouter 2 membres
    for (let i = 1; i <= 2; i++) {
      const addButton = page.locator('button').filter({ hasText: /ajouter membre|nouveau membre|\+/i }).first()
      await addButton.click()
      await page.getByPlaceholder(/nom du membre/i).fill(`Membre ${i}`)
      await page.getByRole('button', { name: /ajouter|enregistrer/i }).click()
      await page.waitForTimeout(500)
    }

    // Tenter d'ajouter un 3ème membre
    const addButton = page.locator('button').filter({ hasText: /ajouter membre|nouveau membre|\+/i }).first()
    await addButton.click()

    // Vérifier qu'une modal d'upgrade apparaît
    await expect(page.getByText(/limite atteinte|passer en mode free|créer un compte/i)).toBeVisible()
  })

  test('Peut ajouter un créneau horaire', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Ajouter d'abord un membre
    const addMemberButton = page.locator('button').filter({ hasText: /ajouter membre|nouveau membre|\+/i }).first()
    await addMemberButton.click()
    await page.getByPlaceholder(/nom du membre/i).fill('Bob')
    await page.getByRole('button', { name: /ajouter|enregistrer/i }).click()
    await page.waitForTimeout(500)

    // Cliquer sur le bouton + dans une cellule de la grille
    const addBlockButton = page.locator('button[aria-label*="Ajouter"]').first()
    await addBlockButton.click()

    // Remplir le formulaire de créneau
    await page.getByPlaceholder(/titre|nom du créneau/i).fill('Réunion')
    await page.getByLabel(/heure de début/i).fill('09:00')
    await page.getByLabel(/heure de fin/i).fill('10:00')

    // Sauvegarder
    await page.getByRole('button', { name: /ajouter|enregistrer/i }).click()

    // Vérifier que le créneau apparaît dans la grille
    await expect(page.getByText('Réunion')).toBeVisible()
  })

  test('Agenda non sauvegardé en mode Test', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Vérifier message d'avertissement
    await expect(page.getByText(/non sauvegardé|créer un compte pour sauvegarder/i)).toBeVisible()
  })
})
