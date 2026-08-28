import { apiRequest, queryString } from "./client";
import type {
  AuditLog,
  PageResponse,
  Setting,
  UserRequest,
  UserResponse,
} from "../types/api";
export const administrationApi = {
  users: (query = "", page = 0, signal?: AbortSignal) =>
    apiRequest<PageResponse<UserResponse>>(
      `/api/admin/users${queryString({ query, page, size: 20 })}`,
      { signal },
    ),
  createUser: (body: UserRequest) =>
    apiRequest<UserResponse>("/api/admin/users", { method: "POST", body }),
  updateUser: (id: number, body: UserRequest) =>
    apiRequest<UserResponse>(`/api/admin/users/${id}`, { method: "PUT", body }),
  settings: (signal?: AbortSignal) =>
    apiRequest<Setting[]>("/api/admin/settings", { signal }),
  updateSetting: (key: string, value: string, description?: string) =>
    apiRequest<Setting>(`/api/admin/settings/${encodeURIComponent(key)}`, {
      method: "PUT",
      body: { value, description },
    }),
  audit: (page = 0, signal?: AbortSignal) =>
    apiRequest<PageResponse<AuditLog>>(
      `/api/admin/audit-logs${queryString({ page, size: 20 })}`,
      { signal },
    ),
};
