import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/auth-context";
import { ApiError } from "../api/client";
import { Alert } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Form } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { loginSchema, type LoginValues } from "../schemas/auth";

function ErrorMessage({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p className="field-error" id={id} role="alert">
      <WarningCircle aria-hidden="true" weight="fill" />
      <span>{children}</span>
    </p>
  );
}

function StatePreview() {
  return (
    <aside
      aria-label="Aperçu des états du formulaire"
      className="state-preview"
    >
      <section className="state-section">
        <h2>Validation — Adresse e-mail invalide</h2>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <div aria-invalid className="preview-input is-invalid">
            <span>prenom.nom@maarifculture</span>
          </div>
          <ErrorMessage id="email-preview-error">
            Saisissez une adresse e-mail valide.
          </ErrorMessage>
        </div>
      </section>
      <section className="state-section">
        <h2>Validation — Mot de passe requis</h2>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <div className="preview-input">
            <span>prenom.nom@maarifculture.ma</span>
          </div>
        </div>
        <div className="preview-field">
          <span className="preview-label">Mot de passe</span>
          <div aria-invalid className="preview-input is-invalid has-action">
            <span />
            <span className="preview-action">Afficher le mot de passe</span>
          </div>
          <ErrorMessage id="password-preview-error">
            Le mot de passe est requis.
          </ErrorMessage>
        </div>
      </section>
      <section className="state-section">
        <h2>Erreur d’authentification</h2>
        <div className="authentication-error" role="alert">
          <WarningCircle aria-hidden="true" weight="fill" />
          <span>Adresse e-mail ou mot de passe incorrect.</span>
        </div>
      </section>
      <section className="state-section loading-section">
        <h2>État de chargement</h2>
        <Button
          className="submit-button preview-loading"
          disabled
          type="button"
        >
          <CircleNotch aria-hidden="true" className="spinner" />
          <span>Connexion en cours…</span>
        </Button>
      </section>
    </aside>
  );
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  if (user)
    return (
      <Navigate
        to={user.role === "STOCK_EMPLOYEE" ? "/inventory" : "/dashboard"}
        replace
      />
    );
  const submit = async (values: LoginValues) => {
    setApiError("");
    try {
      const profile = await login(values);
      const requested = (location.state as { from?: string } | null)?.from;
      navigate(
        requested ??
          (profile.role === "STOCK_EMPLOYEE" ? "/inventory" : "/dashboard"),
        { replace: true },
      );
    } catch (error) {
      setApiError(
        error instanceof ApiError && error.status === 401
          ? "Adresse e-mail ou mot de passe incorrect."
          : error instanceof Error
            ? error.message
            : "Connexion impossible.",
      );
    }
  };
  return (
    <main className="login-page">
      <div className="login-shell">
        <section aria-labelledby="login-title" className="login-column">
          <div className="brand" aria-label="Maarif Analytics">
            <BookOpen aria-hidden="true" className="brand-icon" weight="fill" />
            <span className="brand-name">
              <strong>Maarif</strong> Analytics
            </span>
          </div>
          <div className="brand-rule" aria-hidden="true" />
          <div className="form-region">
            <h1 id="login-title">Connectez-vous à votre espace</h1>
            {apiError ? (
              <Alert
                className="authentication-error live-error"
                variant="destructive"
              >
                <WarningCircle aria-hidden="true" weight="fill" />
                <span>{apiError}</span>
              </Alert>
            ) : null}
            <Form {...form}>
              <form noValidate onSubmit={handleSubmit(submit)}>
                <div className="field-group">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <div
                    className={`field-control${errors.email ? " is-invalid" : ""}`}
                  >
                    <Input
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      aria-invalid={Boolean(errors.email)}
                      autoComplete="email"
                      id="email"
                      inputMode="email"
                      placeholder="prenom.nom@maarifculture.ma"
                      type="email"
                      {...register("email", {
                        onChange: () => setApiError(""),
                      })}
                    />
                  </div>
                  {errors.email ? (
                    <ErrorMessage id="email-error">
                      {errors.email.message}
                    </ErrorMessage>
                  ) : null}
                </div>
                <div className="field-group">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div
                    className={`field-control password-control${errors.password ? " is-invalid" : ""}`}
                  >
                    <Input
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      aria-invalid={Boolean(errors.password)}
                      autoComplete="current-password"
                      id="password"
                      placeholder="••••••••••••"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        onChange: () => setApiError(""),
                      })}
                    />
                    <Button
                      aria-controls="password"
                      aria-pressed={showPassword}
                      className="password-toggle"
                      onClick={() => setShowPassword((value) => !value)}
                      type="button"
                      variant="ghost"
                    >
                      {showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"}
                    </Button>
                  </div>
                  {errors.password ? (
                    <ErrorMessage id="password-error">
                      {errors.password.message}
                    </ErrorMessage>
                  ) : null}
                </div>
                <Button
                  className="submit-button"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch aria-hidden="true" className="spinner" />
                      <span>Connexion en cours…</span>
                    </>
                  ) : (
                    <span>Se connecter</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </section>
        <StatePreview />
      </div>
    </main>
  );
}
