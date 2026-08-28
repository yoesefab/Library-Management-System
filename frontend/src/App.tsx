import { RouterProvider } from "react-router-dom";
import { useState } from "react";
import { Suspense } from "react";
import { createAppRouter } from "./app/router";
export function App() {
  const [router] = useState(createAppRouter);
  return (
    <Suspense
      fallback={
        <main className="login-page" role="status">
          Chargement de Maarif Analytics…
        </main>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
