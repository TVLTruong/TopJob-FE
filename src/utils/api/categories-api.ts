// src/app/api/categories-api.ts
import { axiosClient } from './axios-client';

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export const jobCategoryApi = {
  getList(): Promise<JobCategory[]> {
    return axiosClient
      .get<JobCategory[]>('/api/categories/job')
      .then(res => res.data);
  },
};

export interface EmployerCategory {
  id: string;
  name: string;
  slug: string;
}
export const employerCategoryApi = {
  getList(): Promise<EmployerCategory[]> {
    return axiosClient
      .get<EmployerCategory[]>('/api/categories/employer')
      .then(res => res.data);
  },
};