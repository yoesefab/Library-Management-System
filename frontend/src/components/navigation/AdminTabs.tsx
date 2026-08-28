import { Gear, Scroll, Users } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const tabs = [
  { value: "/administration/users", label: "Utilisateurs", icon: Users },
  { value: "/administration/settings", label: "Paramètres", icon: Gear },
  { value: "/administration/audit", label: "Journal d’audit", icon: Scroll },
];

export function AdminTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Tabs value={location.pathname} onValueChange={navigate}>
      <TabsList
        aria-label="Sections d’administration"
        className="administration-tabs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value}>
              <Icon aria-hidden="true" />
              <span>
                <strong>{tab.label}</strong>
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
