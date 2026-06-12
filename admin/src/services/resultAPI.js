/**
 * Admin — resultAPI
 * import { resultAPI } from '../services';
 */
import api from './api';

export const resultAPI = {
  list:   (params)   => api.get('/results', { params }),
  create: (data)     => api.post('/results', data),
  update: (id, data) => api.patch(`/results/${id}`, data),
  delete: (id)       => api.delete(`/results/${id}`),
  publishSchoolResults: (schoolId, isPublished) => api.patch(`/results/publish/school/${schoolId}`, { isPublished }),
  publishAllResults: (isPublished) => api.patch('/results/publish/all', { isPublished }),
};
