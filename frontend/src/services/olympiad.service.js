import api from './api';

export const getOlympiads    = (params) => api.get('/olympiads', { params });
export const getOlympiad     = (id)     => api.get(`/olympiads/${id}`);
