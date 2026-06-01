import api from './api';

export const adminLogin  = (data) => api.post('/auth/admin/login', data);
export const adminLogout = ()     => api.post('/auth/admin/logout');
export const getAdminMe  = ()     => api.get('/auth/admin/me');
