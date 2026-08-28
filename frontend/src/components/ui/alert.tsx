import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg+div]:pl-7",
  {
    variants: {
      variant: {
        default: "border-border bg-white text-foreground",
        destructive:
          "border-destructive/35 bg-red-50 text-destructive [&>svg]:text-destructive",
        success:
          "border-emerald-700/25 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    className={cn(alertVariants({ variant }), className)}
    ref={ref}
    role="alert"
    {...props}
  />
));
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 className={cn("mb-1 font-semibold", className)} ref={ref} {...props} />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("text-sm leading-relaxed", className)}
    ref={ref}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
