/**
 * Admin — dashboardAPI
 * import { dashboardAPI } from '../services';
 */
import api from './api';

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};
