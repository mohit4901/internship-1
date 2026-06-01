/**
 * resultAPI  — public result search + authenticated student's own results.
 *
 *   import { resultAPI } from '../services';
 *   const { data } = await resultAPI.search({ rollNumber: 'BAIO2026-SR-001' });
 */
import api from './api';

export const resultAPI = {
  // Public — anyone can search by roll number / name
  search: (params) => api.get('/results/search', { params }),

  // Protected — logged-in student sees their own results
  myResults: () => api.get('/results/me'),
};
