import api from './api';

export const getAnnouncements  = (params) => api.get('/announcements', { params });
export const getAnnouncement   = (id)     => api.get(`/announcements/${id}`);
