// src/utils/api/technology-api.ts
import { axiosClient } from './axios-client';

export interface Technology {
  id: string;
  name: string;
  slug: string;
}

export const technologyApi = {
  getList(): Promise<Technology[]> {
    return axiosClient
      .get<Technology[]>('/api/categories/technology')
      .then(res => res.data);
  },
};
