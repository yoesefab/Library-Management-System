import { useEffect, useId, useState } from "react";
import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowClockwise,
  ArrowRight,
  ArrowUp,
  Bell,
  Books,
  BookOpen,
  CalendarBlank,
  CaretDown,
  ChartBar,
  ChartLineUp,
  CheckCircle,
  CircleNotch,
  CloudArrowUp,
  Cube,
  CurrencyDollar,
  DownloadSimple,
  FileText,
  FileCsv,
  FloppyDisk,
  GearSix,
  Eye,
  List,
  MapPin,
  MagnifyingGlass,
  Key,
  PencilSimple,
  Plus,
  Prohibit,
  ShoppingBagOpen,
  ShoppingCart,
  Shield,
  SignOut,
  TrendUp,
  Truck,
  User,
  UserPlus,
  Users,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


import { ErrorMessage } from "../shared/ErrorMessage.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PasswordField({
  error,
  errorId,
  id,
  onChange,
  showPassword,
  togglePassword,
  value,
}) {
  return (
    <div className="field-group">
      <label htmlFor={id}>Mot de passe</label>
      <div
        className={`field-control password-control${error ? " is-invalid" : ""}`}
      >
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="current-password"
          id={id}
          name="password"
          onChange={onChange}
          placeholder="••••••••••••"
          type={showPassword ? "text" : "password"}
          value={value}
        />
        <button
          aria-controls={id}
          aria-pressed={showPassword}
          className="password-toggle"
          onClick={togglePassword}
          type="button"
        >
          {showPassword
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"}
        </button>
      </div>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </div>
  );
}

function PreviewInput({ children, invalid = false, password = false }) {
  return (
    <div
      aria-invalid={invalid || undefined}
      className={`preview-input${invalid ? " is-invalid" : ""}${password ? " has-action" : ""}`}
    >
      <span>{children}</span>
      {password ? (
        <span className="preview-action">Afficher le mot de passe</span>
      ) : null}
    </div>
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
          <PreviewInput invalid>prenom.nom@maarifculture</PreviewInput>
          <ErrorMessage>Saisissez une adresse e-mail valide.</ErrorMessage>
        </div>
      </section>

      <section className="state-section">
        <h2>Validation — Mot de passe requis</h2>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <PreviewInput>prenom.nom@maarifculture.ma</PreviewInput>
        </div>
        <div className="preview-field">
          <span className="preview-label">Mot de passe</span>
          <PreviewInput invalid password />
          <ErrorMessage>Le mot de passe est requis.</ErrorMessage>
        </div>
      </section>

      <section className="state-section">
        <h2>Erreur d’authentification</h2>
        <div className="authentication-error" role="alert">
          <WarningCircle aria-hidden="true" weight="fill" />
          <span>Adresse e-mail ou mot de passe incorrect.</span>
        </div>
        <div className="preview-field">
          <span className="preview-label">Adresse e-mail</span>
          <PreviewInput>prenom.nom@maarifculture.ma</PreviewInput>
        </div>
        <div className="preview-field">
          <span className="preview-label">Mot de passe</span>
          <PreviewInput invalid password>
            ••••••••••••
          </PreviewInput>
        </div>
      </section>

      <section className="state-section loading-section">
        <h2>État de chargement</h2>
        <button
          className="submit-button preview-loading"
          disabled
          type="button"
        >
          <CircleNotch aria-hidden="true" className="spinner" />
          <span>Connexion en cours…</span>
        </button>
      </section>
    </aside>
  );
}

export function LoginPage() {
  const emailId = useId();
  const emailErrorId = `${emailId}-error`;
  const passwordId = useId();
  const passwordErrorId = `${passwordId}-error`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authenticationError, setAuthenticationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Connexion — Maarif Analytics";
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Saisissez une adresse e-mail valide.";
    }

    if (!password) {
      nextErrors.password = "Le mot de passe est requis.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthenticationError(false);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setAuthenticationError(true);
    }, 1200);
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

            {authenticationError ? (
              <div className="authentication-error live-error" role="alert">
                <WarningCircle aria-hidden="true" weight="fill" />
                <span>Adresse e-mail ou mot de passe incorrect.</span>
              </div>
            ) : null}

            <form noValidate onSubmit={handleSubmit}>
              <div className="field-group">
                <label htmlFor={emailId}>Adresse e-mail</label>
                <div
                  className={`field-control${errors.email ? " is-invalid" : ""}`}
                >
                  <input
                    aria-describedby={errors.email ? emailErrorId : undefined}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    id={emailId}
                    inputMode="email"
                    name="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email) {
                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }));
                      }
                      setAuthenticationError(false);
                    }}
                    placeholder="prenom.nom@maarifculture.ma"
                    type="email"
                    value={email}
                  />
                </div>
                {errors.email ? (
                  <ErrorMessage id={emailErrorId}>{errors.email}</ErrorMessage>
                ) : null}
              </div>

              <PasswordField
                error={errors.password}
                errorId={passwordErrorId}
                id={passwordId}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password) {
                    setErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                  }
                  setAuthenticationError(false);
                }}
                showPassword={showPassword}
                togglePassword={() => setShowPassword((current) => !current)}
                value={password}
              />

              <button
                className="submit-button"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <CircleNotch aria-hidden="true" className="spinner" />
                    <span>Connexion en cours…</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>
          </div>
        </section>

        <StatePreview />
      </div>
    </main>
  );
}

