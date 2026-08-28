import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  Pagination as PaginationRoot,
  PaginationButton,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";

export function Pagination({
  page,
  totalPages,
  totalElements,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  onChange: (page: number) => void;
}) {
  return (
    <PaginationRoot className="catalog-pagination">
      <span>
        {totalElements} résultat{totalElements > 1 ? "s" : ""}
      </span>
      <PaginationContent className="pagination-actions">
        <PaginationItem>
          <PaginationButton
            aria-label="Page précédente"
            disabled={page === 0}
            onClick={() => onChange(page - 1)}
          >
            <CaretLeft aria-hidden="true" />
          </PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <span>
            Page {page + 1} sur {Math.max(totalPages, 1)}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton
            aria-label="Page suivante"
            disabled={page + 1 >= totalPages}
            onClick={() => onChange(page + 1)}
          >
            <CaretRight aria-hidden="true" />
          </PaginationButton>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
