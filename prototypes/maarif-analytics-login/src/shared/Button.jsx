import { Button as BaseButton } from "@base-ui/react/button";

export function Button({ className = "", size = "default", variant = "default", ...props }) {
  return (
    <BaseButton
      className={`shadcn-button shadcn-button--${variant} shadcn-button--${size}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
