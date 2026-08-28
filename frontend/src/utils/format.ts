const timeZone = "Africa/Casablanca";
const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone,
  timeZoneName: "longOffset",
});

function offsetMilliseconds(date: Date) {
  const offset =
    offsetFormatter
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = offset.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3])) * 60_000;
}

export function toCasablancaInstant(date: string, boundary: "start" | "end") {
  const [year, month, day] = date.split("-").map(Number);
  const hour = boundary === "start" ? 0 : 23;
  const minute = boundary === "start" ? 0 : 59;
  const second = boundary === "start" ? 0 : 59;
  const millisecond = boundary === "start" ? 0 : 999;
  const wallClock = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond,
  );
  let instant = new Date(wallClock);
  instant = new Date(wallClock - offsetMilliseconds(instant));
  instant = new Date(wallClock - offsetMilliseconds(instant));
  return instant.toISOString();
}

export const formatCasablancaDateInput = (value: string | Date) =>
  dateInputFormatter.format(new Date(value));
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(value);
export const formatDate = (
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
) =>
  new Intl.DateTimeFormat("fr-MA", {
    timeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(value));
export const formatDateTime = (value: string | Date) =>
  formatDate(value, { hour: "2-digit", minute: "2-digit" });
export const formatPercent = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
export const formatQuantity = (value: number) =>
  new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(value);

const labels: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  PENDING: "En attente",
  PROCESSING: "En traitement",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
  OPEN: "Ouverte",
  ACKNOWLEDGED: "Prise en compte",
  RESOLVED: "Résolue",
  LOW_STOCK: "Stock faible",
  OUT_OF_STOCK: "Rupture",
  APPROACHING_STOCKOUT: "Rupture proche",
  SLOW_MOVING: "Rotation lente",
  DEAD_STOCK: "Stock dormant",
  INFO: "Information",
  WARNING: "Attention",
  CRITICAL: "Critique",
  PROPOSED: "Proposée",
  DISMISSED: "Écartée",
  ORDERED: "Commandée",
  ADMINISTRATOR: "Administrateur",
  MANAGER: "Gestionnaire",
  STOCK_EMPLOYEE: "Employé de stock",
  INITIAL_STOCK: "Stock initial",
  PURCHASE: "Achat",
  SALE: "Vente",
  CUSTOMER_RETURN: "Retour client",
  SUPPLIER_RETURN: "Retour fournisseur",
  DAMAGE: "Endommagé",
  CORRECTION: "Correction",
  UPLOADED: "Téléversé",
  VALIDATED: "Validé",
  FAILED: "Échec",
  PARTIALLY_COMPLETED: "Partiel",
};
export const statusLabel = (value: string) =>
  labels[value] ?? value.replaceAll("_", " ").toLocaleLowerCase("fr");

export function downloadResponse(response: Response, fallbackName: string) {
  return response.blob().then((blob) => {
    const disposition = response.headers.get("Content-Disposition");
    const fileName =
      disposition?.match(/filename="?([^";]+)"?/)?.[1] ?? fallbackName;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  });
}
