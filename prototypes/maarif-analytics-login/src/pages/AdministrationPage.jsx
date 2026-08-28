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

const ADMIN_USERS = [
  {
    id: "USR-001",
    fullName: "Nadia El Mansouri",
    email: "nadia.elmansouri@maarifculture.ma",
    role: "Administrateur",
    active: true,
    createdAt: "12 février 2024 à 09:15",
  },
  {
    id: "USR-002",
    fullName: "Youssef Alaoui",
    email: "youssef.alaoui@maarifculture.ma",
    role: "Gestionnaire",
    active: true,
    createdAt: "03 avril 2024 à 11:42",
  },
  {
    id: "USR-003",
    fullName: "Salma Berrada",
    email: "salma.berrada@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "21 mai 2024 à 08:30",
  },
  {
    id: "USR-004",
    fullName: "Omar Idrissi",
    email: "omar.idrissi@maarifculture.ma",
    role: "Employé de stock",
    active: false,
    createdAt: "14 juin 2024 à 15:18",
  },
  {
    id: "USR-005",
    fullName: "Imane Benjelloun",
    email: "imane.benjelloun@maarifculture.ma",
    role: "Gestionnaire",
    active: true,
    createdAt: "09 septembre 2024 à 10:06",
  },
  {
    id: "USR-006",
    fullName: "Amine Chraïbi",
    email: "amine.chraibi@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "18 novembre 2024 à 14:37",
  },
  {
    id: "USR-007",
    fullName: "Sara El Fassi",
    email: "sara.elfassi@maarifculture.ma",
    role: "Gestionnaire",
    active: false,
    createdAt: "06 janvier 2025 à 16:25",
  },
  {
    id: "USR-008",
    fullName: "Mehdi Tazi",
    email: "mehdi.tazi@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "27 février 2025 à 09:54",
  },
  {
    id: "USR-009",
    fullName: "Khadija Aït Lahcen",
    email: "khadija.aitlahcen@maarifculture.ma",
    role: "Employé de stock",
    active: true,
    createdAt: "15 avril 2025 à 13:12",
  },
  {
    id: "USR-010",
    fullName: "Anas Lahlou",
    email: "anas.lahlou@maarifculture.ma",
    role: "Gestionnaire",
    active: true,
    createdAt: "02 juin 2025 à 10:48",
  },
  {
    id: "USR-011",
    fullName: "Meryem Skalli",
    email: "meryem.skalli@maarifculture.ma",
    role: "Administrateur",
    active: true,
    createdAt: "19 septembre 2025 à 08:40",
  },
  {
    id: "USR-012",
    fullName: "Hicham Amrani",
    email: "hicham.amrani@maarifculture.ma",
    role: "Employé de stock",
    active: false,
    createdAt: "11 mars 2026 à 17:03",
  },
];

function AdminRoleBadge({ role }) {
  const tone =
    role === "Administrateur"
      ? "admin"
      : role === "Gestionnaire"
        ? "manager"
        : "stock";
  return (
    <span className={`admin-role-badge admin-role-badge--${tone}`}>
      <Shield
        aria-hidden="true"
        weight={role === "Administrateur" ? "fill" : "regular"}
      />
      {role}
    </span>
  );
}

function AdminStatusBadge({ active }) {
  return (
    <span
      className={`admin-status-badge admin-status-badge--${active ? "active" : "inactive"}`}
    >
      {active ? (
        <CheckCircle aria-hidden="true" weight="fill" />
      ) : (
        <Prohibit aria-hidden="true" />
      )}
      {active ? "Actif" : "Inactif"}
    </span>
  );
}

function AdminConfirmDialog({ action, onCancel, onConfirm }) {
  const [isSaving, setIsSaving] = useState(false);
  const [nextRole, setNextRole] = useState(
    action.user.role === "Administrateur" ? "Gestionnaire" : "Administrateur",
  );
  const isRole = action.type === "role";
  const isPassword = action.type === "password";
  const isDeactivate = action.type === "status" && action.user.active;

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaving, onCancel]);

  const title = isRole
    ? "Confirmer le changement de rôle"
    : isPassword
      ? "Réinitialiser le mot de passe ?"
      : isDeactivate
        ? "Désactiver ce compte ?"
        : "Réactiver ce compte ?";
  const confirmLabel = isRole
    ? "Changer le rôle"
    : isPassword
      ? "Réinitialiser"
      : isDeactivate
        ? "Désactiver"
        : "Réactiver";

  const submit = () => {
    setIsSaving(true);
    window.setTimeout(() => onConfirm(isRole ? nextRole : undefined), 620);
  };

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSaving && onCancel()
      }
    >
      <section
        aria-labelledby="admin-confirm-title"
        aria-modal="true"
        className="catalog-modal admin-confirm-modal"
        role="alertdialog"
      >
        <span
          className={`admin-confirm-icon${isDeactivate || isPassword ? " is-sensitive" : ""}`}
        >
          {isPassword ? (
            <Key aria-hidden="true" />
          ) : isRole ? (
            <Shield aria-hidden="true" />
          ) : isDeactivate ? (
            <Prohibit aria-hidden="true" />
          ) : (
            <CheckCircle aria-hidden="true" />
          )}
        </span>
        <div className="admin-confirm-copy">
          <p>
            {action.user.fullName} · {action.user.email}
          </p>
          <h2 id="admin-confirm-title">{title}</h2>
          {isRole ? (
            <>
              <p>
                Ce changement modifie immédiatement les autorisations de
                l’utilisateur.
              </p>
              <label>
                <span>Nouveau rôle</span>
                <select
                  aria-label="Nouveau rôle"
                  onChange={(event) => setNextRole(event.target.value)}
                  value={nextRole}
                >
                  <option>Administrateur</option>
                  <option>Gestionnaire</option>
                  <option>Employé de stock</option>
                </select>
                <CaretDown aria-hidden="true" />
              </label>
            </>
          ) : isPassword ? (
            <p>
              Le mot de passe actuel sera invalidé. L’utilisateur devra utiliser
              les nouvelles informations de connexion transmises par
              l’administrateur.
            </p>
          ) : (
            <p>
              {isDeactivate
                ? "L’utilisateur ne pourra plus se connecter tant que son compte restera inactif."
                : "L’utilisateur retrouvera immédiatement l’accès correspondant à son rôle actuel."}
            </p>
          )}
        </div>
        <footer>
          <button
            className="catalog-secondary-button"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Annuler
          </button>
          <button
            className={`catalog-primary-button${isDeactivate || isPassword ? " admin-danger-button" : ""}`}
            disabled={isSaving}
            onClick={submit}
            type="button"
          >
            {isSaving ? (
              <>
                <CircleNotch aria-hidden="true" className="spinner" />
                Enregistrement…
              </>
            ) : (
              <>
                {isPassword ? (
                  <Key aria-hidden="true" />
                ) : isRole ? (
                  <Shield aria-hidden="true" />
                ) : isDeactivate ? (
                  <Prohibit aria-hidden="true" />
                ) : (
                  <CheckCircle aria-hidden="true" />
                )}
                {confirmLabel}
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}

function CreateAdminUserDialog({ onCancel, onCreate }) {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    role: "Employé de stock",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaving, onCancel]);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.fullName.trim())
      nextErrors.fullName = "Le nom complet est requis.";
    if (!EMAIL_PATTERN.test(values.email.trim()))
      nextErrors.email = "Saisissez une adresse e-mail valide.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsSaving(true);
    window.setTimeout(() => onCreate(values), 620);
  };

  return (
    <div
      className="catalog-modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSaving && onCancel()
      }
    >
      <section
        aria-labelledby="create-user-title"
        aria-modal="true"
        className="catalog-modal admin-create-modal"
        role="dialog"
      >
        <header>
          <div>
            <p>Administration</p>
            <h2 id="create-user-title">Créer un utilisateur</h2>
            <span>Le compte sera actif dès sa création.</span>
          </div>
          <button
            aria-label="Fermer"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <form noValidate onSubmit={submit}>
          <label>
            <span>Nom complet</span>
            <input
              aria-describedby={
                errors.fullName ? "admin-full-name-error" : undefined
              }
              aria-invalid={Boolean(errors.fullName)}
              autoFocus
              onChange={(event) => update("fullName", event.target.value)}
              placeholder="Prénom et nom"
              value={values.fullName}
            />
            {errors.fullName ? (
              <ErrorMessage id="admin-full-name-error">
                {errors.fullName}
              </ErrorMessage>
            ) : null}
          </label>
          <label>
            <span>Adresse e-mail professionnelle</span>
            <input
              aria-describedby={errors.email ? "admin-email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              onChange={(event) => update("email", event.target.value)}
              placeholder="prenom.nom@maarifculture.ma"
              type="email"
              value={values.email}
            />
            {errors.email ? (
              <ErrorMessage id="admin-email-error">{errors.email}</ErrorMessage>
            ) : null}
          </label>
          <label>
            <span>Rôle</span>
            <span className="admin-create-select">
              <select
                aria-label="Rôle du nouvel utilisateur"
                onChange={(event) => update("role", event.target.value)}
                value={values.role}
              >
                <option>Administrateur</option>
                <option>Gestionnaire</option>
                <option>Employé de stock</option>
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <div className="admin-create-notice">
            <Shield aria-hidden="true" />
            <p>
              <strong>Accès accordé selon le rôle choisi.</strong> Les
              autorisations pourront être modifiées ultérieurement.
            </p>
          </div>
          <footer>
            <button
              className="catalog-secondary-button"
              disabled={isSaving}
              onClick={onCancel}
              type="button"
            >
              Annuler
            </button>
            <button
              className="catalog-primary-button"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <>
                  <CircleNotch aria-hidden="true" className="spinner" />
                  Création…
                </>
              ) : (
                <>
                  <UserPlus aria-hidden="true" />
                  Créer l’utilisateur
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function UserManagementPage() {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Tous les rôles");
  const [status, setStatus] = useState("Tous les statuts");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState("");
  const pageSize = 6;

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.fullName} ${user.email}`
      .toLocaleLowerCase("fr")
      .includes(search.trim().toLocaleLowerCase("fr"));
    const matchesRole = role === "Tous les rôles" || user.role === role;
    const matchesStatus =
      status === "Tous les statuts" ||
      (status === "Actifs" ? user.active : !user.active);
    return matchesSearch && matchesRole && matchesStatus;
  });
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setRole("Tous les rôles");
    setStatus("Tous les statuts");
    setPage(1);
  };

  const confirmAction = (nextRole) => {
    const { type, user } = dialog;
    if (type === "role") {
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, role: nextRole } : item,
        ),
      );
      setFeedback(`Rôle de ${user.fullName} modifié : ${nextRole}.`);
    } else if (type === "status") {
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, active: !item.active } : item,
        ),
      );
      setFeedback(
        `Compte de ${user.fullName} ${user.active ? "désactivé" : "réactivé"} avec succès.`,
      );
    } else {
      setFeedback(`Mot de passe de ${user.fullName} réinitialisé avec succès.`);
    }
    setDialog(null);
  };

  const createUser = (values) => {
    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      ...values,
      active: true,
      createdAt: "27 août 2026 à 22:45",
    };
    setUsers((current) => [newUser, ...current]);
    setShowCreate(false);
    setPage(1);
    setFeedback(`Utilisateur ${values.fullName} créé avec succès.`);
  };

  return (
    <div className="user-management-page">
      {feedback ? (
        <div
          className="product-feedback product-feedback--success"
          role="status"
        >
          <CheckCircle aria-hidden="true" weight="fill" />
          <span>{feedback}</span>
          <button
            aria-label="Fermer le message"
            onClick={() => setFeedback("")}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <header className="admin-page-heading">
        <div>
          <p>Administration · Accès</p>
          <h2>Gestion des utilisateurs</h2>
          <span>
            Gérez les comptes et les autorisations de Maarif Analytics.
          </span>
        </div>
        <button
          className="catalog-primary-button"
          onClick={() => setShowCreate(true)}
          type="button"
        >
          <UserPlus aria-hidden="true" />
          Créer un utilisateur
        </button>
      </header>

      <section
        aria-label="Filtres des utilisateurs"
        className="admin-user-toolbar"
      >
        <label className="admin-user-search">
          <span>Rechercher</span>
          <span>
            <MagnifyingGlass aria-hidden="true" />
            <input
              aria-label="Rechercher un utilisateur"
              onChange={(event) => changeFilter(setSearch, event.target.value)}
              placeholder="Nom complet ou adresse e-mail"
              type="search"
              value={search}
            />
          </span>
        </label>
        <label className="admin-user-filter">
          <span>Rôle</span>
          <span>
            <select
              aria-label="Filtrer par rôle"
              onChange={(event) => changeFilter(setRole, event.target.value)}
              value={role}
            >
              <option>Tous les rôles</option>
              <option>Administrateur</option>
              <option>Gestionnaire</option>
              <option>Employé de stock</option>
            </select>
            <CaretDown aria-hidden="true" />
          </span>
        </label>
        <label className="admin-user-filter">
          <span>Statut</span>
          <span>
            <select
              aria-label="Filtrer par statut"
              onChange={(event) => changeFilter(setStatus, event.target.value)}
              value={status}
            >
              <option>Tous les statuts</option>
              <option>Actifs</option>
              <option>Inactifs</option>
            </select>
            <CaretDown aria-hidden="true" />
          </span>
        </label>
        <button
          className="catalog-secondary-button admin-user-reset"
          onClick={resetFilters}
          type="button"
        >
          <ArrowClockwise aria-hidden="true" />
          Réinitialiser
        </button>
      </section>

      <section
        aria-labelledby="admin-users-title"
        className="catalog-panel admin-users-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="admin-users-title">Utilisateurs</h2>
            <p aria-live="polite">
              {filteredUsers.length} utilisateur
              {filteredUsers.length > 1 ? "s" : ""}
            </p>
          </div>
          <span>Dernière actualisation : 27 août 2026 à 22:45</span>
        </div>
        <div className="catalog-table-scroll admin-users-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Nom complet</th>
                <th scope="col">Adresse e-mail</th>
                <th scope="col">Rôle</th>
                <th scope="col">Statut</th>
                <th scope="col">Créé le</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user-identity">
                      <span>
                        <User aria-hidden="true" />
                      </span>
                      <div>
                        <strong>{user.fullName}</strong>
                        <small>{user.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    <AdminRoleBadge role={user.role} />
                  </td>
                  <td>
                    <AdminStatusBadge active={user.active} />
                  </td>
                  <td>
                    <time>{user.createdAt}</time>
                  </td>
                  <td>
                    <div className="admin-user-actions">
                      <button
                        aria-label={`Changer le rôle de ${user.fullName}`}
                        onClick={() => setDialog({ type: "role", user })}
                        title="Changer le rôle"
                        type="button"
                      >
                        <Shield aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`${user.active ? "Désactiver" : "Réactiver"} le compte de ${user.fullName}`}
                        className={user.active ? "is-sensitive" : ""}
                        onClick={() => setDialog({ type: "status", user })}
                        title={
                          user.active
                            ? "Désactiver le compte"
                            : "Réactiver le compte"
                        }
                        type="button"
                      >
                        {user.active ? (
                          <Prohibit aria-hidden="true" />
                        ) : (
                          <CheckCircle aria-hidden="true" />
                        )}
                      </button>
                      <button
                        aria-label={`Réinitialiser le mot de passe de ${user.fullName}`}
                        onClick={() => setDialog({ type: "password", user })}
                        title="Réinitialiser le mot de passe"
                        type="button"
                      >
                        <Key aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleUsers.length ? (
            <div className="catalog-empty">
              <Users aria-hidden="true" />
              <h3>Aucun utilisateur trouvé</h3>
              <p>
                Modifiez la recherche ou les filtres pour afficher d’autres
                comptes.
              </p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            {filteredUsers.length
              ? `Affichage de ${(page - 1) * pageSize + 1} à ${Math.min(page * pageSize, filteredUsers.length)} sur ${filteredUsers.length}`
              : "Aucun utilisateur à afficher"}
          </p>
          <nav aria-label="Pagination des utilisateurs">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              type="button"
            >
              Précédent
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={page === pageNumber ? "is-current" : ""}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              Suivant
            </button>
          </nav>
        </footer>
      </section>

      {dialog ? (
        <AdminConfirmDialog
          action={dialog}
          onCancel={() => setDialog(null)}
          onConfirm={confirmAction}
        />
      ) : null}
      {showCreate ? (
        <CreateAdminUserDialog
          onCancel={() => setShowCreate(false)}
          onCreate={createUser}
        />
      ) : null}
    </div>
  );
}

const AUDIT_EVENTS = [
  {
    id: "AUD-2026-014286",
    date: "27 août 2026 à 22:41",
    user: "Nadia El Mansouri",
    action: "Modification",
    entityType: "Paramètre système",
    entity: "Limite d’import",
    summary: "Limite de lignes mise à jour",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014285",
    date: "27 août 2026 à 18:06",
    user: "Salma Berrada",
    action: "Création",
    entityType: "Mouvement de stock",
    entity: "MVT-2026-0384",
    summary: "Correction de stock enregistrée",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014284",
    date: "27 août 2026 à 16:42",
    user: "Youssef Alaoui",
    action: "Modification",
    entityType: "Commande",
    entity: "CMD-2026-1842",
    summary: "Statut de commande mis à jour",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014283",
    date: "27 août 2026 à 15:18",
    user: "Imane Benjelloun",
    action: "Export",
    entityType: "Rapport",
    entity: "Ventes · août 2026",
    summary: "Rapport CSV généré",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014282",
    date: "27 août 2026 à 13:24",
    user: "Nadia El Mansouri",
    action: "Modification",
    entityType: "Utilisateur",
    entity: "USR-008",
    summary: "Rôle du compte modifié",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014281",
    date: "27 août 2026 à 11:05",
    user: "Amine Chraïbi",
    action: "Création",
    entityType: "Mouvement de stock",
    entity: "MVT-2026-0383",
    summary: "Réception fournisseur enregistrée",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014280",
    date: "26 août 2026 à 17:56",
    user: "Youssef Alaoui",
    action: "Modification",
    entityType: "Produit",
    entity: "LIV-000184",
    summary: "Seuil minimum mis à jour",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014279",
    date: "26 août 2026 à 16:20",
    user: "Nadia El Mansouri",
    action: "Connexion",
    entityType: "Session",
    entity: "Administration",
    summary: "Connexion administrateur réussie",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014278",
    date: "26 août 2026 à 14:37",
    user: "Salma Berrada",
    action: "Modification",
    entityType: "Alerte",
    entity: "ALT-2026-0718",
    summary: "Alerte de stock résolue",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014277",
    date: "26 août 2026 à 10:12",
    user: "Imane Benjelloun",
    action: "Import",
    entityType: "Fichier de ventes",
    entity: "ventes_2026-08-26.csv",
    summary: "Import validé et confirmé",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014276",
    date: "25 août 2026 à 18:08",
    user: "Amine Chraïbi",
    action: "Création",
    entityType: "Mouvement de stock",
    entity: "MVT-2026-0379",
    summary: "Produit endommagé enregistré",
    result: "Réussi",
  },
  {
    id: "AUD-2026-014275",
    date: "25 août 2026 à 09:46",
    user: "Nadia El Mansouri",
    action: "Modification",
    entityType: "Paramètre système",
    entity: "Historique prévisionnel",
    summary: "Historique minimum mis à jour",
    result: "Réussi",
  },
];

const DEFAULT_SYSTEM_SETTINGS = {
  timezone: "Africa/Casablanca",
  forecastHistoryWeeks: "12",
  minimumStock: "5",
  safetyStock: "7",
  importMaxSizeMb: "10",
  importMaxRows: "5000",
};

function SystemSettingsSection() {
  const [settings, setSettings] = useState(DEFAULT_SYSTEM_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SYSTEM_SETTINGS);
  const [saveState, setSaveState] = useState("idle");
  const [errors, setErrors] = useState({});
  const isDirty = Object.keys(settings).some(
    (key) => settings[key] !== savedSettings[key],
  );

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const save = (event) => {
    event.preventDefault();
    const limits = {
      forecastHistoryWeeks: [
        4,
        104,
        "L’historique doit être compris entre 4 et 104 semaines.",
      ],
      minimumStock: [
        0,
        999,
        "Le stock minimum doit être compris entre 0 et 999.",
      ],
      safetyStock: [
        0,
        999,
        "Le stock de sécurité doit être compris entre 0 et 999.",
      ],
      importMaxSizeMb: [
        1,
        50,
        "La taille maximale doit être comprise entre 1 et 50 Mo.",
      ],
      importMaxRows: [
        100,
        25000,
        "La limite doit être comprise entre 100 et 25 000 lignes.",
      ],
    };
    const nextErrors = Object.fromEntries(
      Object.entries(limits).flatMap(([key, [min, max, message]]) => {
        const value = Number(settings[key]);
        return Number.isFinite(value) && value >= min && value <= max
          ? []
          : [[key, message]];
      }),
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaveState("saving");
    window.setTimeout(() => {
      setSavedSettings(settings);
      setSaveState("success");
    }, 720);
  };

  return (
    <form className="system-settings-form" noValidate onSubmit={save}>
      {saveState === "success" ? (
        <div
          className="product-feedback product-feedback--success"
          role="status"
        >
          <CheckCircle aria-hidden="true" weight="fill" />
          <span>Paramètres système enregistrés avec succès.</span>
          <button
            aria-label="Fermer le message"
            onClick={() => setSaveState("idle")}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <section
        aria-labelledby="timezone-settings-title"
        className="system-setting-card"
      >
        <header>
          <span>
            <GearSix aria-hidden="true" />
          </span>
          <div>
            <h3 id="timezone-settings-title">Fuseau horaire métier</h3>
            <p>
              Utilisé pour les dates affichées et les regroupements quotidiens.
            </p>
          </div>
        </header>
        <label className="system-setting-control">
          <span>Fuseau horaire</span>
          <span className="system-select-wrap">
            <select
              aria-label="Fuseau horaire métier"
              onChange={(event) => update("timezone", event.target.value)}
              value={settings.timezone}
            >
              <option>Africa/Casablanca</option>
            </select>
            <CaretDown aria-hidden="true" />
          </span>
          <small>Les instants restent stockés en UTC.</small>
        </label>
      </section>

      <section
        aria-labelledby="forecast-settings-title"
        className="system-setting-card"
      >
        <header>
          <span>
            <ChartLineUp aria-hidden="true" />
          </span>
          <div>
            <h3 id="forecast-settings-title">Historique des prévisions</h3>
            <p>
              Définit la quantité minimale de données requise avant de générer
              une prévision.
            </p>
          </div>
        </header>
        <label className="system-setting-control">
          <span>Historique hebdomadaire minimum</span>
          <span className="system-number-wrap">
            <input
              aria-describedby={
                errors.forecastHistoryWeeks
                  ? "forecast-history-error"
                  : "forecast-history-help"
              }
              aria-invalid={Boolean(errors.forecastHistoryWeeks)}
              inputMode="numeric"
              min="4"
              onChange={(event) =>
                update("forecastHistoryWeeks", event.target.value)
              }
              type="number"
              value={settings.forecastHistoryWeeks}
            />
            <em>semaines</em>
          </span>
          {errors.forecastHistoryWeeks ? (
            <ErrorMessage id="forecast-history-error">
              {errors.forecastHistoryWeeks}
            </ErrorMessage>
          ) : (
            <small id="forecast-history-help">
              Valeur recommandée : 12 semaines.
            </small>
          )}
        </label>
      </section>

      <section
        aria-labelledby="stock-settings-title"
        className="system-setting-card system-setting-card--wide"
      >
        <header>
          <span>
            <Archive aria-hidden="true" />
          </span>
          <div>
            <h3 id="stock-settings-title">Valeurs par défaut du stock</h3>
            <p>
              Proposées lors de la création d’un produit et modifiables produit
              par produit.
            </p>
          </div>
        </header>
        <div className="system-setting-grid">
          <label className="system-setting-control">
            <span>Seuil de stock minimum</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.minimumStock ? "minimum-stock-error" : undefined
                }
                aria-invalid={Boolean(errors.minimumStock)}
                inputMode="numeric"
                min="0"
                onChange={(event) => update("minimumStock", event.target.value)}
                type="number"
                value={settings.minimumStock}
              />
              <em>unités</em>
            </span>
            {errors.minimumStock ? (
              <ErrorMessage id="minimum-stock-error">
                {errors.minimumStock}
              </ErrorMessage>
            ) : null}
          </label>
          <label className="system-setting-control">
            <span>Stock de sécurité</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.safetyStock ? "safety-stock-error" : undefined
                }
                aria-invalid={Boolean(errors.safetyStock)}
                inputMode="numeric"
                min="0"
                onChange={(event) => update("safetyStock", event.target.value)}
                type="number"
                value={settings.safetyStock}
              />
              <em>unités</em>
            </span>
            {errors.safetyStock ? (
              <ErrorMessage id="safety-stock-error">
                {errors.safetyStock}
              </ErrorMessage>
            ) : null}
          </label>
        </div>
      </section>

      <section
        aria-labelledby="import-settings-title"
        className="system-setting-card system-setting-card--wide"
      >
        <header>
          <span>
            <CloudArrowUp aria-hidden="true" />
          </span>
          <div>
            <h3 id="import-settings-title">Limites des fichiers d’import</h3>
            <p>Appliquées aux fichiers CSV de ventes avant validation.</p>
          </div>
        </header>
        <div className="system-setting-grid">
          <label className="system-setting-control">
            <span>Taille maximale du fichier</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.importMaxSizeMb ? "import-size-error" : undefined
                }
                aria-invalid={Boolean(errors.importMaxSizeMb)}
                inputMode="numeric"
                min="1"
                onChange={(event) =>
                  update("importMaxSizeMb", event.target.value)
                }
                type="number"
                value={settings.importMaxSizeMb}
              />
              <em>Mo</em>
            </span>
            {errors.importMaxSizeMb ? (
              <ErrorMessage id="import-size-error">
                {errors.importMaxSizeMb}
              </ErrorMessage>
            ) : null}
          </label>
          <label className="system-setting-control">
            <span>Nombre maximal de lignes</span>
            <span className="system-number-wrap">
              <input
                aria-describedby={
                  errors.importMaxRows ? "import-rows-error" : undefined
                }
                aria-invalid={Boolean(errors.importMaxRows)}
                inputMode="numeric"
                min="100"
                onChange={(event) =>
                  update("importMaxRows", event.target.value)
                }
                type="number"
                value={settings.importMaxRows}
              />
              <em>lignes</em>
            </span>
            {errors.importMaxRows ? (
              <ErrorMessage id="import-rows-error">
                {errors.importMaxRows}
              </ErrorMessage>
            ) : null}
          </label>
        </div>
      </section>

      <footer className="system-settings-actions">
        <p aria-live="polite">
          {isDirty ? "Modifications non enregistrées" : "Paramètres à jour"}
        </p>
        <button
          className="catalog-primary-button"
          disabled={!isDirty || saveState === "saving"}
          type="submit"
        >
          {saveState === "saving" ? (
            <CircleNotch aria-hidden="true" className="spinner" />
          ) : (
            <FloppyDisk aria-hidden="true" />
          )}
          {saveState === "saving"
            ? "Enregistrement…"
            : "Enregistrer les paramètres"}
        </button>
      </footer>
    </form>
  );
}

function AuditLogSection() {
  const [user, setUser] = useState("Tous les utilisateurs");
  const [action, setAction] = useState("Toutes les actions");
  const [entityType, setEntityType] = useState("Tous les types");
  const [date, setDate] = useState("7 derniers jours");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filteredEvents = AUDIT_EVENTS.filter(
    (event) =>
      (user === "Tous les utilisateurs" || event.user === user) &&
      (action === "Toutes les actions" || event.action === action) &&
      (entityType === "Tous les types" || event.entityType === entityType),
  );
  const pageCount = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const visibleEvents = filteredEvents.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const reset = () => {
    setUser("Tous les utilisateurs");
    setAction("Toutes les actions");
    setEntityType("Tous les types");
    setDate("7 derniers jours");
    setPage(1);
  };

  return (
    <div className="audit-log-section">
      <section
        aria-label="Filtres du journal d’audit"
        className="audit-filter-panel"
      >
        <div className="audit-filter-grid">
          <label>
            <span>Utilisateur</span>
            <span>
              <select
                aria-label="Filtrer par utilisateur"
                onChange={(event) => changeFilter(setUser, event.target.value)}
                value={user}
              >
                <option>Tous les utilisateurs</option>
                {[...new Set(AUDIT_EVENTS.map((event) => event.user))].map(
                  (name) => (
                    <option key={name}>{name}</option>
                  ),
                )}
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <label>
            <span>Action</span>
            <span>
              <select
                aria-label="Filtrer par action"
                onChange={(event) =>
                  changeFilter(setAction, event.target.value)
                }
                value={action}
              >
                <option>Toutes les actions</option>
                {[...new Set(AUDIT_EVENTS.map((event) => event.action))].map(
                  (name) => (
                    <option key={name}>{name}</option>
                  ),
                )}
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <label>
            <span>Type d’entité</span>
            <span>
              <select
                aria-label="Filtrer par type d’entité"
                onChange={(event) =>
                  changeFilter(setEntityType, event.target.value)
                }
                value={entityType}
              >
                <option>Tous les types</option>
                {[
                  ...new Set(AUDIT_EVENTS.map((event) => event.entityType)),
                ].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <label>
            <span>Date</span>
            <span>
              <CalendarBlank aria-hidden="true" className="is-leading" />
              <select
                aria-label="Filtrer par date"
                onChange={(event) => changeFilter(setDate, event.target.value)}
                value={date}
              >
                <option>24 dernières heures</option>
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
              </select>
              <CaretDown aria-hidden="true" />
            </span>
          </label>
          <button
            className="catalog-secondary-button audit-reset"
            onClick={reset}
            type="button"
          >
            <ArrowClockwise aria-hidden="true" />
            Réinitialiser
          </button>
        </div>
      </section>

      <section
        aria-labelledby="audit-table-title"
        className="catalog-panel audit-log-panel"
      >
        <div className="catalog-panel-header">
          <div>
            <h2 id="audit-table-title">Activité récente</h2>
            <p aria-live="polite">
              {filteredEvents.length} événement
              {filteredEvents.length > 1 ? "s" : ""}
            </p>
          </div>
          <span>Données non sensibles · Africa/Casablanca</span>
        </div>
        <div className="catalog-table-scroll audit-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Utilisateur</th>
                <th scope="col">Action</th>
                <th scope="col">Type d’entité</th>
                <th scope="col">Entité</th>
                <th scope="col">Activité</th>
                <th scope="col">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <time>{event.date}</time>
                    <small>{event.id}</small>
                  </td>
                  <td>
                    <strong>{event.user}</strong>
                  </td>
                  <td>
                    <span className="audit-action-badge">{event.action}</span>
                  </td>
                  <td>{event.entityType}</td>
                  <td>
                    <strong>{event.entity}</strong>
                  </td>
                  <td>{event.summary}</td>
                  <td>
                    <span className="audit-result">
                      <CheckCircle aria-hidden="true" weight="fill" />
                      {event.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleEvents.length ? (
            <div className="catalog-empty">
              <FileText aria-hidden="true" />
              <h3>Aucune activité trouvée</h3>
              <p>Modifiez les filtres pour élargir la recherche.</p>
            </div>
          ) : null}
        </div>
        <footer className="catalog-pagination">
          <p>
            {filteredEvents.length
              ? `Affichage de ${(page - 1) * pageSize + 1} à ${Math.min(page * pageSize, filteredEvents.length)} sur ${filteredEvents.length}`
              : "Aucun événement à afficher"}
          </p>
          <nav aria-label="Pagination du journal d’audit">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              type="button"
            >
              Précédent
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={page === pageNumber ? "is-current" : ""}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              Suivant
            </button>
          </nav>
        </footer>
      </section>
    </div>
  );
}

export function AdministrationPage() {
  const [section, setSection] = useState("settings");
  return (
    <div className="administration-page">
      <header className="admin-page-heading">
        <div>
          <p>Administration · Système</p>
          <h2>Configuration et traçabilité</h2>
          <span>
            Gérez les règles communes et consultez l’activité administrative.
          </span>
        </div>
      </header>
      <nav
        aria-label="Sections de l’administration"
        className="administration-tabs"
        role="tablist"
      >
        <button
          aria-controls="administration-settings-panel"
          aria-selected={section === "settings"}
          className={section === "settings" ? "is-active" : ""}
          id="administration-settings-tab"
          onClick={() => setSection("settings")}
          role="tab"
          type="button"
        >
          <GearSix aria-hidden="true" />
          <span>
            <strong>Paramètres système</strong>
            <small>Prévisions, stock et imports</small>
          </span>
        </button>
        <button
          aria-controls="administration-audit-panel"
          aria-selected={section === "audit"}
          className={section === "audit" ? "is-active" : ""}
          id="administration-audit-tab"
          onClick={() => setSection("audit")}
          role="tab"
          type="button"
        >
          <FileText aria-hidden="true" />
          <span>
            <strong>Journal d’audit</strong>
            <small>Activité administrative non sensible</small>
          </span>
        </button>
      </nav>
      <section
        aria-labelledby={`administration-${section}-tab`}
        id={`administration-${section}-panel`}
        role="tabpanel"
      >
        {section === "settings" ? (
          <SystemSettingsSection />
        ) : (
          <AuditLogSection />
        )}
      </section>
    </div>
  );
}

