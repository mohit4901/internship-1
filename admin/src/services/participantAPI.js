/**
 * Admin — participantAPI
 * import { participantAPI } from '../services';
 */
import api from './api';

export const participantAPI = {
  list:          (params)     => api.get('/schools/admin/participants', { params }),
  listForSchool: (id, params) => api.get(`/schools/${id}/participants`, { params }),
};
