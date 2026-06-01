/**
 * Admin — olympiadAPI
 * import { olympiadAPI } from '../services';
 */
import api from './api';

export const olympiadAPI = {
  list:         (params)     => api.get('/olympiads', { params }),
  getOne:       (id)         => api.get(`/olympiads/${id}`),
  create:       (data)       => api.post('/olympiads', data),
  update:       (id, data)   => api.patch(`/olympiads/${id}`, data),
  changeStatus: (id, data)   => api.patch(`/olympiads/${id}/status`, data),
  delete:       (id)         => api.delete(`/olympiads/${id}`),
};
