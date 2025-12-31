import { axiosClient } from './axios-client';

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export const jobCategoryApi = {
  getList(): Promise<JobCategory[]> {
    return axiosClient.get('/job-categories');
  },
};
