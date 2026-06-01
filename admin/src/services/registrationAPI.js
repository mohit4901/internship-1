/**
 * Admin — registrationAPI
 * import { registrationAPI } from '../services';
 */
import api from './api';

export const registrationAPI = {
  list:   (params) => api.get('/registrations', { params }),
  getOne: (id)     => api.get(`/registrations/${id}`),
};
