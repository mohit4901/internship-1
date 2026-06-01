/**
 * Admin — authAPI
 * import { authAPI } from '../services';
 */
import api from './api';

export const authAPI = {
  login:  (data) => api.post('/auth/admin/login', data),
  logout: ()     => api.post('/auth/admin/logout'),
  me:     ()     => api.get('/auth/admin/me'),
};
