import { ArrowLeft, LockKey, Warning } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
export function SystemPage({ type }: { type: "unauthorized" | "not-found" }) {
  const unauthorized = type === "unauthorized";
  return (
    <section className="system-state-card" aria-labelledby="system-title">
      {unauthorized ? (
        <LockKey aria-hidden="true" weight="duotone" />
      ) : (
        <Warning aria-hidden="true" weight="duotone" />
      )}
      <p className="eyebrow">{unauthorized ? "Erreur 403" : "Erreur 404"}</p>
      <h2 id="system-title">
        {unauthorized ? "Accès non autorisé" : "Page introuvable"}
      </h2>
      <p>
        {unauthorized
          ? "Votre rôle ne permet pas d’accéder à cette section. L’autorisation du serveur reste la référence."
          : "Cette page n’existe pas ou a été déplacée."}
      </p>
      <Link className="primary-button" to="/dashboard">
        <ArrowLeft aria-hidden="true" />
        Retour au tableau de bord
      </Link>
    </section>
  );
}
