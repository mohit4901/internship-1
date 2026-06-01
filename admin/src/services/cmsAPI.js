/**
 * Admin — cmsAPI
 * import { cmsAPI } from '../services';
 */
import api from './api';

export const cmsAPI = {
  listAll: ()        => api.get('/cms'),
  getKey:  (key)     => api.get(`/cms/${key}`),
  upsert:  (data)    => api.post('/cms', data),       // { key, value, type }
};
