/**
 * Admin — studentAPI
 * import { studentAPI } from '../services';
 */
import api from './api';

export const studentAPI = {
  list:         (params) => api.get('/students', { params }),
  getOne:       (id)     => api.get(`/students/${id}`),
  toggleStatus: (id)     => api.patch(`/students/${id}/status`),
  delete:       (id)     => api.delete(`/students/${id}`),
};
