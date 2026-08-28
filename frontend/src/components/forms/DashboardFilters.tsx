import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Reference } from "@/types/api";

export interface DashboardFilterValues {
  start: string;
  end: string;
  categoryId: string;
  language: string;
  authorId: string;
  publisherId: string;
}

interface DashboardFiltersProps {
  values: DashboardFilterValues;
  categories: Category[];
  authors: Reference[];
  publishers: Reference[];
  onChange: (key: keyof DashboardFilterValues, value: string) => void;
  onReset: () => void;
}

const allValue = "all";

function ReferenceFilter({
  id,
  label,
  value,
  items,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  items: Array<{ id: number; name: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="dashboard-filter">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || allValue}
        onValueChange={(next) => onChange(next === allValue ? "" : next)}
      >
        <SelectTrigger className="dashboard-filter-control" id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allValue}>Tous</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function DashboardFilters({
  values,
  categories,
  authors,
  publishers,
  onChange,
  onReset,
}: DashboardFiltersProps) {
  return (
    <section aria-label="Filtres partagés" className="dashboard-filter-bar">
      <div className="dashboard-filter">
        <Label htmlFor="dashboard-start">Du</Label>
        <Input
          id="dashboard-start"
          max={values.end}
          type="date"
          value={values.start}
          onChange={(event) => onChange("start", event.target.value)}
        />
      </div>
      <div className="dashboard-filter">
        <Label htmlFor="dashboard-end">Au</Label>
        <Input
          id="dashboard-end"
          min={values.start}
          type="date"
          value={values.end}
          onChange={(event) => onChange("end", event.target.value)}
        />
      </div>
      <ReferenceFilter
        id="dashboard-category"
        items={categories}
        label="Catégorie"
        value={values.categoryId}
        onChange={(value) => onChange("categoryId", value)}
      />
      <div className="dashboard-filter">
        <Label htmlFor="dashboard-language">Langue</Label>
        <Select
          value={values.language || allValue}
          onValueChange={(next) =>
            onChange("language", next === allValue ? "" : next)
          }
        >
          <SelectTrigger
            className="dashboard-filter-control"
            id="dashboard-language"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allValue}>Toutes</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">Arabe</SelectItem>
            <SelectItem value="en">Anglais</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ReferenceFilter
        id="dashboard-author"
        items={authors}
        label="Auteur"
        value={values.authorId}
        onChange={(value) => onChange("authorId", value)}
      />
      <ReferenceFilter
        id="dashboard-publisher"
        items={publishers}
        label="Éditeur"
        value={values.publisherId}
        onChange={(value) => onChange("publisherId", value)}
      />
      <Button
        className="reset-filters"
        type="button"
        variant="secondary"
        onClick={onReset}
      >
        <ArrowCounterClockwise aria-hidden="true" /> Réinitialiser
      </Button>
    </section>
  );
}
