import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "./pages/AuthenticatedLayout.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";

export function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  return path.startsWith("/app") ? (
    <AuthenticatedLayout onLogout={() => navigate("/")} />
  ) : (
    <LoginPage />
  );
}
