/**
 * announcementAPI  — public announcement listing + detail.
 *
 *   import { announcementAPI } from '../services';
 *   const { data } = await announcementAPI.list({ pinned: true });
 */
import api from './api';

export const announcementAPI = {
  list:   (params) => api.get('/announcements', { params }),
  getOne: (id)     => api.get(`/announcements/${id}`),
};
