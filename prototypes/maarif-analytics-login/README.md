# Maarif Analytics — Product prototype

Responsive React prototype for the French-language Maarif Analytics sign-in experience and authenticated bookstore-management workflows.

The authenticated application is available at `/app`. It includes the approved management dashboard and the complete prototype workflows for products, inventory, orders, CSV imports, stock alerts, forecasting, reports, user administration, system settings, and audit logs. Synthetic business data uses MAD and French dates for Africa/Casablanca.

Primary routes include:

- `/app/products`, `/app/products/new`, `/app/products/:sku`, and `/app/products/:sku/edit`
- `/app/inventory` and its stock-movement workflow
- `/app/orders` and `/app/orders/:reference`
- `/app/imports`, `/app/alerts`, `/app/forecasting`, and `/app/reports`
- `/app/administration`
- `/app/unauthorized` and `/app/not-found`

## Local preview

```bash
npm run dev
```

The login form demonstrates client-side validation, password visibility, a loading state, and a synthetic authentication-error state. Filters, pagination, confirmations, forms, navigation, the responsive sidebar, and logout are interactive across the approved workflows. Stock movements support initial stock, purchase, customer return, supplier return, damage, and correction, with required reasons, live resulting-stock calculations, negative-stock prevention, and a separate confirmation step. Server responses are simulated locally; the prototype does not call a backend or store credentials.
