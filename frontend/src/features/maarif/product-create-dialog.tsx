import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CATALOG_PRODUCTS } from '@/maarif-legacy/shared/catalogData'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const amount = (value: string) => Number(value.replace(',', '.'))
const schema = z
  .object({
    sku: z
      .string()
      .trim()
      .regex(/^[A-Z]{3}-\d{6}$/, 'Utilisez le format LIV-000000.')
      .refine(
        (value) => !CATALOG_PRODUCTS.some((product) => product.sku === value),
        'Ce SKU est déjà utilisé par un autre produit.'
      ),
    isbn: z
      .string()
      .trim()
      .refine(
        (value) =>
          !value || /^(?:\d[ -]?){9}[\dXx]$|^(?:\d[ -]?){13}$/.test(value),
        'Saisissez un ISBN-10 ou ISBN-13 valide.'
      ),
    title: z.string().trim().min(1, 'Le titre est requis.'),
    authors: z.string().trim().min(1, 'Ajoutez au moins un auteur.'),
    description: z.string(),
    publisher: z.string().min(1, 'Choisissez un éditeur.'),
    category: z.string().min(1, 'Choisissez une catégorie.'),
    language: z.string().min(1, 'Choisissez une langue.'),
    sellingPrice: z
      .string()
      .trim()
      .refine(
        (value) => Number.isFinite(amount(value)) && amount(value) > 0,
        'Saisissez un prix de vente supérieur à 0 MAD.'
      ),
    purchaseCost: z
      .string()
      .trim()
      .refine(
        (value) =>
          value !== '' && Number.isFinite(amount(value)) && amount(value) >= 0,
        'Saisissez un coût d’achat valide.'
      ),
    minimumStock: z
      .string()
      .regex(/^\d+$/, 'Saisissez un stock minimum positif ou nul.'),
    supplier: z.string().min(1, 'Choisissez un fournisseur.'),
    supplierLeadTime: z
      .string()
      .refine(
        (value) => /^\d+$/.test(value) && Number(value) >= 1,
        'Le délai doit être d’au moins un jour.'
      ),
    active: z.boolean(),
  })
  .refine(
    (values) => amount(values.purchaseCost) <= amount(values.sellingPrice),
    {
      message: 'Le coût d’achat ne peut pas dépasser le prix de vente.',
      path: ['purchaseCost'],
    }
  )

export type ProductForm = z.infer<typeof schema>
const PRODUCT_FORM_DEFAULTS: ProductForm = {
  sku: '',
  isbn: '',
  title: '',
  description: '',
  authors: '',
  publisher: 'Gallimard',
  category: 'Roman',
  language: 'Français',
  sellingPrice: '',
  purchaseCost: '',
  minimumStock: '5',
  supplier: 'Sodis Maroc',
  supplierLeadTime: '7',
  active: true,
}
const fields: {
  name: Exclude<keyof ProductForm, 'active'>
  label: string
  options?: string[]
  multiline?: boolean
  inputMode?: 'decimal' | 'numeric'
}[] = [
  { name: 'sku', label: 'SKU' },
  { name: 'isbn', label: 'ISBN' },
  { name: 'title', label: 'Titre' },
  { name: 'authors', label: 'Auteurs' },
  { name: 'description', label: 'Description', multiline: true },
  {
    name: 'publisher',
    label: 'Éditeur',
    options: [
      'Gallimard',
      'Librairie des Écoles',
      'Le Seuil',
      'La Croisée des chemins',
    ],
  },
  {
    name: 'category',
    label: 'Catégorie',
    options: ['Roman', 'Jeunesse', 'Scolaire', 'Essai', 'Référence'],
  },
  {
    name: 'language',
    label: 'Langue',
    options: ['Français', 'Arabe', 'Anglais'],
  },
  {
    name: 'supplier',
    label: 'Fournisseur',
    options: [
      'Sodis Maroc',
      'Distribution Livre Maroc',
      'Al Madariss Distribution',
    ],
  },
  { name: 'sellingPrice', label: 'Prix de vente (MAD)', inputMode: 'decimal' },
  { name: 'purchaseCost', label: 'Coût d’achat (MAD)', inputMode: 'decimal' },
  { name: 'minimumStock', label: 'Stock minimum', inputMode: 'numeric' },
  {
    name: 'supplierLeadTime',
    label: 'Délai fournisseur (jours)',
    inputMode: 'numeric',
  },
]

export function ProductCreateDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate?: (values: ProductForm) => Promise<void>
}) {
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const form = useForm<ProductForm>({
    resolver: zodResolver(schema),
    defaultValues: PRODUCT_FORM_DEFAULTS,
  })
  const dirty = form.formState.isDirty
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const requestClose = () => (dirty ? setConfirmDiscard(true) : onClose())
  const onSubmit = async (values: ProductForm) => {
    await onCreate?.(values)
    form.reset()
    toast.success('Produit validé', {
      description: 'Le produit a été enregistré.',
    })
    onClose()
  }
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) requestClose()
        }}
      >
        <DialogContent className='max-h-[90svh] sm:max-w-3xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>Créer un produit</DialogTitle>
            <DialogDescription>
              Ajoutez une référence au catalogue. Cliquez sur Enregistrer
              lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <div className='max-h-[65svh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
            <Form {...form}>
              <form
                id='product-create-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid grid-cols-1 items-start gap-4! px-0.5 sm:grid-cols-2'
                noValidate
              >
                {fields.map((config) => (
                  <FormField
                    key={config.name}
                    control={form.control}
                    name={config.name}
                    render={({ field }) => (
                      <FormItem
                        className={
                          config.multiline ? 'min-w-0 sm:col-span-2' : 'min-w-0'
                        }
                      >
                        <FormLabel>{config.label}</FormLabel>
                        {config.options ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='w-full'
                                onBlur={field.onBlur}
                                ref={field.ref}
                              >
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            {config.multiline ? (
                              <Textarea rows={3} {...field} />
                            ) : (
                              <Input
                                inputMode={config.inputMode}
                                autoComplete='off'
                                {...field}
                              />
                            )}
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='active'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-3 sm:col-span-2'>
                      <FormLabel>Produit actif</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={requestClose}>
              Annuler
            </Button>
            <Button type='submit' form='product-create-form'>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifications non enregistrées</AlertDialogTitle>
            <AlertDialogDescription>
              Les informations saisies seront perdues si vous fermez ce
              formulaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer la modification</AlertDialogCancel>
            <AlertDialogAction onClick={onClose}>
              Quitter sans enregistrer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
