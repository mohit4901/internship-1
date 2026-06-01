/**
 * Admin — schoolAPI
 * import { schoolAPI } from '../services';
 */
import api from './api';

export const schoolAPI = {
  list:   (params) => api.get('/schools', { params }),
  getOne: (id)     => api.get(`/schools/${id}`),
  verify: (id)     => api.patch(`/schools/${id}/verify`),
};
