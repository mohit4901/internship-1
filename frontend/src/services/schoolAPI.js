/**
 * schoolAPI  — school profile calls (authenticated school).
 *
 *   import { schoolAPI } from '../services';
 *   const { data } = await schoolAPI.getMe();
 */
import api from './api';

export const schoolAPI = {
  getMe:      ()     => api.get('/schools/me'),
  updateMe:   (data) => api.patch('/schools/me', data),
  listPublic: ()     => api.get('/schools/public'),
};
