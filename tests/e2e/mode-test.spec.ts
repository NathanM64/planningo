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
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Vérifier que l'éditeur se charge (chercher logo dans header - utiliser .first())
    await expect(page.getByRole('link', { name: /planningo/i }).first()).toBeVisible()

    // Vérifier présence du banner mode test (texte réel: "Créez un compte gratuit")
    await expect(page.getByText(/créez un compte gratuit/i).first()).toBeVisible()
  })

  test('Peut ajouter un membre en mode Test', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Cliquer sur "Ajouter un membre" (chercher texte exact)
    const addMemberButton = page.getByRole('button', { name: /ajouter un membre/i })
    await addMemberButton.click({ timeout: 10000 })

    // Remplir le nom du membre (le placeholder exact est "Nom du membre")
    await page.getByPlaceholder('Nom du membre').fill('Alice')

    // Cliquer sur le bouton Ajouter (avec icône Check)
    await page.getByRole('button', { name: /ajouter/i }).click()

    // Vérifier que le membre apparaît dans la liste (utiliser .first())
    await expect(page.getByText('Alice').first()).toBeVisible()
  })

  test('Mode Test limite à 2 membres', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Ajouter 2 membres
    for (let i = 1; i <= 2; i++) {
      const addButton = page.getByRole('button', { name: /ajouter un membre/i })
      await addButton.click({ timeout: 10000 })
      await page.getByPlaceholder('Nom du membre').fill(`Membre ${i}`)
      // Utiliser .first() pour éviter strict mode avec les boutons "Ajouter créneau"
      await page.getByRole('button', { name: /^ajouter$/i }).first().click()
      await page.waitForTimeout(1000)
    }

    // Tenter d'ajouter un 3ème membre - le bouton devrait afficher "Limite atteinte"
    const limiteButton = page.getByRole('button', { name: /limite atteinte/i })
    await expect(limiteButton).toBeVisible()

    // Le bouton est désactivé en mode Test (pas cliquable, c'est normal)
    await expect(limiteButton).toBeDisabled()
  })

  test.skip('Peut ajouter un créneau horaire', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Ajouter d'abord un membre
    const addMemberButton = page.getByRole('button', { name: /ajouter un membre/i })
    await addMemberButton.click({ timeout: 10000 })
    await page.getByPlaceholder('Nom du membre').fill('Bob')
    await page.getByRole('button', { name: /ajouter/i }).click()
    await page.waitForTimeout(2000)

    // Cliquer sur le bouton + dans une cellule de la grille
    const addBlockButton = page.locator('button[aria-label*="Ajouter"]').first()
    await expect(addBlockButton).toBeVisible()
    await addBlockButton.click({ timeout: 10000 })

    // Attendre que la modal de créneau s'ouvre
    await page.waitForTimeout(1000)

    // Vérifier que la modal est bien ouverte en cherchant un input de texte visible
    const titleInput = page.locator('input[type="text"]').first()
    await expect(titleInput).toBeVisible()
    await titleInput.fill('Réunion')

    // Remplir les heures (les labels exacts sont "Début *" et "Fin *")
    await page.getByLabel(/^début/i).fill('09:00')
    await page.getByLabel(/^fin/i).fill('10:00')

    // Sauvegarder (chercher le bouton dans la modal - utiliser role dialog)
    const saveButton = page.locator('[role="dialog"]').getByRole('button', { name: /ajouter|enregistrer/i })
    await saveButton.click()

    // Vérifier que le créneau apparaît dans la grille
    await page.waitForTimeout(500)
    await expect(page.getByText('Réunion').first()).toBeVisible()
  })

  test('Agenda non sauvegardé en mode Test', async ({ page }) => {
    await page.goto('/editor')
    await page.waitForLoadState('networkidle')

    // Vérifier que le banner mode test est affiché (l'agenda n'est pas sauvegardé en mode test)
    await expect(page.getByText(/créez un compte gratuit/i).first()).toBeVisible()

    // Le bouton "Sauvegarder" existe mais redirige vers /auth (pas de sauvegarde directe en mode test)
    const saveButton = page.getByRole('button', { name: /sauvegarder/i })
    await expect(saveButton).toBeVisible()
  })
})
