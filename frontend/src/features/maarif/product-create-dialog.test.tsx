import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { ProductCreateDialog } from './product-create-dialog'

describe('ProductCreateDialog', () => {
  it('shows required-field errors and rejects an existing SKU', async () => {
    const onClose = vi.fn()
    const screen = await render(<ProductCreateDialog onClose={onClose} />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Enregistrer', exact: true })
    )
    await expect.element(screen.getByText('Le titre est requis.')).toBeVisible()
    await userEvent.fill(
      screen.getByRole('textbox', { name: 'SKU', exact: true }),
      'LIV-000184'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Enregistrer', exact: true })
    )
    await expect
      .element(
        screen.getByText('Ce SKU est déjà utilisé par un autre produit.')
      )
      .toBeVisible()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('protects a dirty form when closing', async () => {
    const onClose = vi.fn()
    const screen = await render(<ProductCreateDialog onClose={onClose} />)
    await userEvent.fill(
      screen.getByRole('textbox', { name: 'Titre', exact: true }),
      'Livre de test'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Annuler', exact: true })
    )
    await expect.element(screen.getByRole('alertdialog')).toBeVisible()
    expect(onClose).not.toHaveBeenCalled()
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Continuer la modification',
        exact: true,
      })
    )
    await expect
      .element(screen.getByRole('textbox', { name: 'Titre', exact: true }))
      .toHaveValue('Livre de test')
  })
})
