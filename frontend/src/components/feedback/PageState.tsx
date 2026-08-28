import { CircleNotch, WarningCircle } from "@phosphor-icons/react";
export function PageState({
  title,
  message,
  loading = false,
  onRetry,
}: {
  title: string;
  message: string;
  loading?: boolean;
  onRetry?: () => void;
}) {
  return (
    <section
      className="dashboard-state-panel"
      role={loading ? "status" : "alert"}
      aria-live="polite"
    >
      {loading ? (
        <CircleNotch className="spinner" aria-hidden="true" />
      ) : (
        <WarningCircle aria-hidden="true" weight="fill" />
      )}
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <button className="secondary-button" type="button" onClick={onRetry}>
          Réessayer
        </button>
      ) : null}
    </section>
  );
}

export function InlineFeedback({
  children,
  tone = "success",
}: {
  children: React.ReactNode;
  tone?: "success" | "error" | "info";
}) {
  return (
    <div
      className={
        tone === "error" ? "authentication-error live-error" : "form-success"
      }
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
