/**
 * Admin — contactAPI
 * import { contactAPI } from '../services';
 */
import api from './api';

export const contactAPI = {
  list:         (params)   => api.get('/contact', { params }),
  getOne:       (id)       => api.get(`/contact/${id}`),
  updateStatus: (id, data) => api.patch(`/contact/${id}/status`, data),
};
