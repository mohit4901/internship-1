/**
 * studentAPI  — student profile & own-data calls (authenticated student).
 *
 *   import { studentAPI } from '../services';
 *   const { data } = await studentAPI.getMe();
 */
import api from './api';

export const studentAPI = {
  // Own profile
  getMe:    ()     => api.get('/students/me'),
  updateMe: (data) => api.patch('/students/me', data),

  // Own registrations
  myRegistrations: ()   => api.get('/registrations/me'),
  getRegistration: (id) => api.get(`/registrations/${id}`),

  // Register for an olympiad
  register: (data) => api.post('/registrations', data),

  // Own results
  myResults: () => api.get('/results/me'),
};
