import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "@phosphor-icons/react";
import { useState } from "react";
import { administrationApi } from "../../api/administration-api";
import { AdminTabs } from "../../components/navigation/AdminTabs";
import { InlineFeedback, PageState } from "../../components/feedback/PageState";
import { Pagination } from "../../components/tables/Pagination";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/dialog";
import type { UserRequest, UserRole } from "../../types/api";
import { statusLabel } from "../../utils/format";

function UserDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<UserRequest>({
    fullName: "",
    email: "",
    password: "",
    role: "STOCK_EMPLOYEE",
    active: true,
  });
  const create = useMutation({
    mutationFn: administrationApi.createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });
  const valid =
    values.fullName.trim() &&
    /^\S+@\S+\.\S+$/.test(values.email) &&
    (values.password?.length ?? 0) >= 12;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="catalog-modal">
        <header>
          <DialogTitle asChild>
            <h2>Créer un utilisateur</h2>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Créez un compte et choisissez son rôle applicatif.
          </DialogDescription>
          <DialogClose asChild>
            <Button
              aria-label="Fermer"
              size="icon"
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) create.mutate(values);
          }}
        >
          <div className="stock-movement-form">
            <label className="stock-movement-field">
              <span>Nom complet</span>
              <input
                value={values.fullName}
                onChange={(event) =>
                  setValues({ ...values, fullName: event.target.value })
                }
              />
            </label>
            <label className="stock-movement-field">
              <span>Adresse e-mail</span>
              <input
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues({ ...values, email: event.target.value })
                }
              />
            </label>
            <label className="stock-movement-field">
              <span>Mot de passe initial</span>
              <input
                minLength={12}
                type="password"
                value={values.password}
                onChange={(event) =>
                  setValues({ ...values, password: event.target.value })
                }
              />
              <small>12 caractères minimum.</small>
            </label>
            <label className="stock-movement-field">
              <span>Rôle</span>
              <select
                value={values.role}
                onChange={(event) =>
                  setValues({ ...values, role: event.target.value as UserRole })
                }
              >
                <option value="STOCK_EMPLOYEE">Employé de stock</option>
                <option value="MANAGER">Gestionnaire</option>
                <option value="ADMINISTRATOR">Administrateur</option>
              </select>
            </label>
          </div>
          {create.isError ? (
            <InlineFeedback tone="error">{create.error.message}</InlineFeedback>
          ) : null}
          <footer className="stock-movement-actions">
            <Button
              className="secondary-button"
              onClick={onClose}
              type="button"
            >
              Annuler
            </Button>
            <Button
              className="primary-button"
              disabled={!valid || create.isPending}
              type="submit"
            >
              {create.isPending ? "Création…" : "Créer"}
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const users = useQuery({
    queryKey: ["users", query, page],
    queryFn: ({ signal }) => administrationApi.users(query, page, signal),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UserRequest }) =>
      administrationApi.updateUser(id, body),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  return (
    <section className="administration-page">
      <AdminTabs />
      <div className="catalog-heading">
        <div>
          <h2>Utilisateurs</h2>
          <p>Rôles et accès applicatifs.</p>
        </div>
        <Button
          className="primary-button"
          onClick={() => setDialog(true)}
          type="button"
        >
          <Plus aria-hidden="true" />
          Nouvel utilisateur
        </Button>
      </div>
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <span className="sr-only">Rechercher</span>
          <input
            placeholder="Nom ou e-mail"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </label>
      </div>
      {users.isPending ? (
        <PageState
          loading
          title="Chargement des utilisateurs"
          message="Récupération des comptes…"
        />
      ) : users.isError ? (
        <PageState
          title="Utilisateurs indisponibles"
          message={users.error.message}
        />
      ) : users.data.content.length ? (
        <>
          <div className="catalog-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>E-mail</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.data.content.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{statusLabel(user.role)}</td>
                    <td>
                      <span
                        className={`status-badge ${user.active ? "is-active" : "is-inactive"}`}
                      >
                        {user.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <Button
                        className="secondary-button"
                        disabled={update.isPending}
                        onClick={() =>
                          update.mutate({
                            id: user.id,
                            body: {
                              fullName: user.fullName,
                              email: user.email,
                              role: user.role,
                              active: !user.active,
                            },
                          })
                        }
                        type="button"
                      >
                        {user.active ? "Désactiver" : "Réactiver"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={users.data.page}
            totalPages={users.data.totalPages}
            totalElements={users.data.totalElements}
            onChange={setPage}
          />
        </>
      ) : (
        <PageState
          title="Aucun utilisateur"
          message="Aucun compte ne correspond à la recherche."
        />
      )}
      {update.isError ? (
        <InlineFeedback tone="error">{update.error.message}</InlineFeedback>
      ) : null}
      {dialog ? <UserDialog onClose={() => setDialog(false)} /> : null}
    </section>
  );
}
