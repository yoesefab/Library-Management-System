import { apiRequest, queryString } from "./client";
import type { Dashboard } from "../types/api";
export interface DashboardFilters {
  start: string;
  end: string;
  categoryId?: number;
  language?: string;
  authorId?: number;
  publisherId?: number;
}
export const dashboardApi = {
  get: (filters: DashboardFilters, signal?: AbortSignal) =>
    apiRequest<Dashboard>(`/api/dashboard${queryString(filters)}`, { signal }),
};
