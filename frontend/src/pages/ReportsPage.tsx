import { useMutation } from "@tanstack/react-query";
import { DownloadSimple, FileCsv, FilePdf } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { reportsApi } from "../api/reports-api";
import { InlineFeedback } from "../components/feedback/PageState";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  downloadResponse,
  formatCasablancaDateInput,
  toCasablancaInstant,
} from "../utils/format";

const today = new Date();
const monthAgo = new Date(today.getTime() - 30 * 86400000);

export function ReportsPage() {
  const [start, setStart] = useState(formatCasablancaDateInput(monthAgo));
  const [end, setEnd] = useState(formatCasablancaDateInput(today));
  const download = useMutation({
    mutationFn: async ({
      path,
      name,
    }: {
      path: "inventory.csv" | "low-stock.csv" | "reorder-recommendations.csv";
      name: string;
    }) => downloadResponse(await reportsApi.download(path), name),
    onSuccess: () => toast.success("Le rapport CSV a été téléchargé."),
  });
  const pdf = useMutation({
    mutationFn: async () =>
      downloadResponse(
        await reportsApi.management({
          start: toCasablancaInstant(start, "start"),
          end: toCasablancaInstant(end, "end"),
        }),
        "rapport-gestion.pdf",
      ),
    onSuccess: () => toast.success("Le rapport PDF a été téléchargé."),
  });
  const pending = download.isPending || pdf.isPending;
  return (
    <section className="reports-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Exports</p>
          <h2>Rapports</h2>
          <p>Téléchargez les fichiers générés et calculés par le backend.</p>
        </div>
      </div>
      <section className="dashboard-filter-bar">
        <div className="dashboard-filter">
          <Label htmlFor="report-start">Du</Label>
          <Input
            id="report-start"
            type="date"
            max={end}
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </div>
        <div className="dashboard-filter">
          <Label htmlFor="report-end">Au</Label>
          <Input
            id="report-end"
            type="date"
            min={start}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </div>
      </section>
      <div className="report-options-grid">
        <Card className="report-option">
          <FileCsv aria-hidden="true" />
          <div>
            <h3>Inventaire complet</h3>
            <p>Niveaux de stock actuels au format CSV.</p>
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              download.mutate({ path: "inventory.csv", name: "inventory.csv" })
            }
            type="button"
          >
            <DownloadSimple aria-hidden="true" />
            CSV
          </Button>
        </Card>
        <Card className="report-option">
          <FileCsv aria-hidden="true" />
          <div>
            <h3>Stocks faibles</h3>
            <p>Produits sous leur seuil minimum.</p>
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              download.mutate({ path: "low-stock.csv", name: "low-stock.csv" })
            }
            type="button"
          >
            <DownloadSimple aria-hidden="true" />
            CSV
          </Button>
        </Card>
        <Card className="report-option">
          <FileCsv aria-hidden="true" />
          <div>
            <h3>Recommandations</h3>
            <p>Quantités de réapprovisionnement proposées.</p>
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              download.mutate({
                path: "reorder-recommendations.csv",
                name: "reorder-recommendations.csv",
              })
            }
            type="button"
          >
            <DownloadSimple aria-hidden="true" />
            CSV
          </Button>
        </Card>
        <Card className="report-option">
          <FilePdf aria-hidden="true" />
          <div>
            <h3>Rapport de gestion</h3>
            <p>Synthèse PDF pour la période sélectionnée.</p>
          </div>
          <Button
            disabled={pending || !start || !end}
            onClick={() => pdf.mutate()}
            type="button"
          >
            <DownloadSimple aria-hidden="true" />
            PDF
          </Button>
        </Card>
      </div>
      {pending ? (
        <InlineFeedback tone="info">
          Génération et téléchargement en cours…
        </InlineFeedback>
      ) : null}
      {download.isSuccess || pdf.isSuccess ? (
        <InlineFeedback>Téléchargement terminé.</InlineFeedback>
      ) : null}
      {download.isError || pdf.isError ? (
        <InlineFeedback tone="error">
          {(download.error ?? pdf.error)?.message}
        </InlineFeedback>
      ) : null}
    </section>
  );
}
