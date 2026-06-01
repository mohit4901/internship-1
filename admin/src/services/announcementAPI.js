/**
 * Admin — announcementAPI
 * import { announcementAPI } from '../services';
 */
import api from './api';

export const announcementAPI = {
  list:   (params)   => api.get('/announcements', { params }),
  getOne: (id)       => api.get(`/announcements/${id}`),
  create: (data)     => api.post('/announcements', data),
  update: (id, data) => api.patch(`/announcements/${id}`, data),
  delete: (id)       => api.delete(`/announcements/${id}`),
};
