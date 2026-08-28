import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      closeButton
      position="bottom-right"
      richColors
      toastOptions={{ className: "maarif-toast" }}
      {...props}
    />
  );
}
