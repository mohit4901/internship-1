import api from './api';

// ── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats');

// ── Students ────────────────────────────────────────────────────────────────
export const getStudents       = (params) => api.get('/students', { params });
export const getStudent        = (id)      => api.get(`/students/${id}`);
export const toggleStudentStatus = (id)   => api.patch(`/students/${id}/status`);

// ── Schools ─────────────────────────────────────────────────────────────────
export const getSchools        = (params) => api.get('/schools', { params });
export const getSchool         = (id)      => api.get(`/schools/${id}`);
export const verifySchool      = (id)      => api.patch(`/schools/${id}/verify`);

// ── Olympiads ───────────────────────────────────────────────────────────────
export const getOlympiads      = (params) => api.get('/olympiads', { params });
export const getOlympiad       = (id)      => api.get(`/olympiads/${id}`);
export const createOlympiad    = (data)    => api.post('/olympiads', data);
export const updateOlympiad    = (id, data)=> api.patch(`/olympiads/${id}`, data);
export const changeOlympiadStatus = (id, data) => api.patch(`/olympiads/${id}/status`, data);
export const deleteOlympiad    = (id)      => api.delete(`/olympiads/${id}`);

// ── Registrations ────────────────────────────────────────────────────────────
export const getRegistrations  = (params) => api.get('/registrations', { params });
export const getRegistration   = (id)      => api.get(`/registrations/${id}`);

// ── Announcements ────────────────────────────────────────────────────────────
export const getAnnouncements  = (params) => api.get('/announcements', { params });
export const getAnnouncement   = (id)      => api.get(`/announcements/${id}`);
export const createAnnouncement = (data)  => api.post('/announcements', data);
export const updateAnnouncement = (id, data) => api.patch(`/announcements/${id}`, data);
export const deleteAnnouncement = (id)    => api.delete(`/announcements/${id}`);

// ── Results ──────────────────────────────────────────────────────────────────
export const getResults        = (params) => api.get('/results', { params });
export const createResult      = (data)    => api.post('/results', data);
export const updateResult      = (id, data)=> api.patch(`/results/${id}`, data);
export const deleteResult      = (id)      => api.delete(`/results/${id}`);

// ── CMS ──────────────────────────────────────────────────────────────────────
export const getCmsAll         = ()        => api.get('/cms');
export const getCmsKey         = (key)     => api.get(`/cms/${key}`);
export const upsertCms         = (data)    => api.post('/cms', data);

// ── Contact ──────────────────────────────────────────────────────────────────
export const getContacts       = (params) => api.get('/contact', { params });
export const getContact        = (id)      => api.get(`/contact/${id}`);
export const updateContactStatus = (id, data) => api.patch(`/contact/${id}/status`, data);
