/**
 * olympiadAPI  — public olympiad listing + detail (no auth required).
 *
 *   import { olympiadAPI } from '../services';
 *   const { data } = await olympiadAPI.list({ page: 1 });
 */
import api from './api';

export const olympiadAPI = {
  list:   (params) => api.get('/olympiads', { params }),
  getOne: (id)     => api.get(`/olympiads/${id}`),
};
