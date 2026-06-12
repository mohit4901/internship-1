import api from './api';

// ── School Auth ────────────────────────────────────────────────────────────────
export const schoolRegister  = (data) => api.post('/auth/school/register', data);
export const schoolLogin     = (data) => api.post('/auth/school/login', data);
export const schoolLogout    = ()     => api.post('/auth/school/logout');
export const getSchoolMe     = ()     => api.get('/auth/school/me');

// ── School Participants ────────────────────────────────────────────────────────
export const addParticipants = (data) => api.post('/schools/me/participants', data);
export const getParticipants = (params) => api.get('/schools/me/participants', { params });
export const uploadParticipantsFile = (formData) => api.post('/schools/me/participants/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getSchoolResults = () => api.get('/schools/me/results');
