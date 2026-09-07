import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { ProductCreateDialog } from './product-create-dialog'

describe('ProductCreateDialog', () => {
  it('uses the creation form to edit a prefilled product', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    const screen = await render(
      <ProductCreateDialog
        onClose={vi.fn()}
        onCreate={onCreate}
        product={{
          sku: 'LIV-000184',
          isbn: '9782070360024',
          title: 'L’Étranger',
          description: 'Roman',
          author: 'Albert Camus',
          publisher: 'Gallimard',
          category: 'Roman',
          language: 'Français',
          price: 89,
          purchaseCost: 55,
          threshold: 5,
          supplier: 'Sodis Maroc',
          supplierLeadTime: 7,
          active: true,
        }}
      />
    )

    await expect
      .element(screen.getByText('Image du produit', { exact: true }))
      .toBeVisible()
    await expect
      .element(screen.getByRole('heading', { name: 'Modifier le produit' }))
      .toBeVisible()
    await expect
      .element(screen.getByRole('textbox', { name: 'Titre', exact: true }))
      .toHaveValue('L’Étranger')
    await userEvent.fill(
      screen.getByRole('textbox', { name: 'Titre', exact: true }),
      'L’Étranger — édition révisée'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Enregistrer', exact: true })
    )

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        sku: 'LIV-000184',
        title: 'L’Étranger — édition révisée',
      }),
      undefined
    )
  })

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
