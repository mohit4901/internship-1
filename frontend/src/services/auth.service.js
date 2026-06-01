import api from './api';

// ── Student Auth ───────────────────────────────────────────────────────────────
export const studentRegister = (data) => api.post('/auth/student/register', data);
export const studentLogin    = (data) => api.post('/auth/student/login', data);
export const studentLogout   = ()     => api.post('/auth/student/logout');
export const getStudentMe    = ()     => api.get('/auth/student/me');

// ── School Auth ────────────────────────────────────────────────────────────────
export const schoolRegister  = (data) => api.post('/auth/school/register', data);
export const schoolLogin     = (data) => api.post('/auth/school/login', data);
export const schoolLogout    = ()     => api.post('/auth/school/logout');
export const getSchoolMe     = ()     => api.get('/auth/school/me');
