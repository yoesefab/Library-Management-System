import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FloppyDisk } from "@phosphor-icons/react";
import { useState } from "react";
import { administrationApi } from "../../api/administration-api";
import { InlineFeedback, PageState } from "../../components/feedback/PageState";
import { AdminTabs } from "../../components/navigation/AdminTabs";
function SettingsForm({
  settings,
}: {
  settings: Array<{ key: string; value: string; description: string | null }>;
}) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(settings.map((item) => [item.key, item.value])),
  );
  const save = useMutation({
    mutationFn: async () => {
      for (const item of settings) {
        if (values[item.key] !== item.value)
          await administrationApi.updateSetting(
            item.key,
            values[item.key],
            item.description ?? undefined,
          );
      }
    },
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
  return (
    <>
      <form
        className="system-settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        {settings.map((setting) => (
          <label key={setting.key}>
            <span>{setting.key}</span>
            <input
              value={values[setting.key] ?? ""}
              onChange={(event) =>
                setValues({ ...values, [setting.key]: event.target.value })
              }
            />
            <small>{setting.description || "Paramètre métier"}</small>
          </label>
        ))}
        <button
          className="primary-button"
          disabled={save.isPending}
          type="submit"
        >
          <FloppyDisk aria-hidden="true" />
          {save.isPending ? "Enregistrement…" : "Enregistrer les paramètres"}
        </button>
      </form>
      {save.isSuccess ? (
        <InlineFeedback>Paramètres enregistrés.</InlineFeedback>
      ) : null}
      {save.isError ? (
        <InlineFeedback tone="error">{save.error.message}</InlineFeedback>
      ) : null}
    </>
  );
}

export function SettingsPage() {
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: ({ signal }) => administrationApi.settings(signal),
  });
  return (
    <section className="administration-page">
      <AdminTabs />
      <div className="catalog-heading">
        <div>
          <h2>Paramètres système</h2>
          <p>Valeurs métier persistées et auditées.</p>
        </div>
      </div>
      {settings.isPending ? (
        <PageState
          loading
          title="Chargement des paramètres"
          message="Récupération de la configuration…"
        />
      ) : settings.isError ? (
        <PageState
          title="Paramètres indisponibles"
          message={settings.error.message}
        />
      ) : (
        <SettingsForm
          key={settings.data
            .map((item) => `${item.key}:${item.value}`)
            .join("|")}
          settings={settings.data}
        />
      )}
    </section>
  );
}
