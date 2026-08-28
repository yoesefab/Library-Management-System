import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import type { UserRole } from "../../types/api";
import { PageState } from "../feedback/PageState";

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, isRestoring } = useAuth();
  const location = useLocation();
  if (isRestoring)
    return (
      <main className="login-page">
        <div className="login-shell">
          <PageState
            loading
            title="Restauration de la session"
            message="Vérification de votre accès sécurisé…"
          />
        </div>
      </main>
    );
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
