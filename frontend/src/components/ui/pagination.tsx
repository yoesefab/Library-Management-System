import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex w-full items-center justify-between", className)}
      {...props}
    />
  );
}

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    className={cn("flex items-center gap-1", className)}
    ref={ref}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

export function PaginationButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("h-9 w-9 p-0", className)}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    />
  );
}
