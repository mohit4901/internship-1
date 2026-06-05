import api from './api';

// ── School Auth ────────────────────────────────────────────────────────────────
export const schoolRegister  = (data) => api.post('/auth/school/register', data);
export const schoolLogin     = (data) => api.post('/auth/school/login', data);
export const schoolLogout    = ()     => api.post('/auth/school/logout');
export const getSchoolMe     = ()     => api.get('/auth/school/me');

// ── School Participants ────────────────────────────────────────────────────────
export const addParticipants = (data) => api.post('/schools/me/participants', data);
export const getParticipants = (params) => api.get('/schools/me/participants', { params });
