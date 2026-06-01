/**
 * authAPI  — all authentication calls (student + school).
 * Centralises every auth endpoint in one named object so imports
 * stay consistent across the app:
 *
 *   import { authAPI } from '../services';
 *   await authAPI.student.login({ email, password });
 */
import api from './api';

export const authAPI = {
  // ── Student ────────────────────────────────────────────────────────────────
  student: {
    register:       (data) => api.post('/auth/student/register', data),
    login:          (data) => api.post('/auth/student/login',    data),
    logout:         ()     => api.post('/auth/student/logout'),
    me:             ()     => api.get('/auth/student/me'),
    setQuestion:    (data) => api.post('/auth/student/forgot-password/set-question', data),
    forgotQuestion: (data) => api.post('/auth/student/forgot-password/question', data),
    forgotVerify:   (data) => api.post('/auth/student/forgot-password/verify', data),
    forgotReset:    (data) => api.post('/auth/student/forgot-password/reset', data),
  },

  // ── School ─────────────────────────────────────────────────────────────────
  school: {
    register:       (data) => api.post('/auth/school/register', data),
    login:          (data) => api.post('/auth/school/login',    data),
    logout:         ()     => api.post('/auth/school/logout'),
    me:             ()     => api.get('/auth/school/me'),
    setQuestion:    (data) => api.post('/auth/school/forgot-password/set-question', data),
    forgotQuestion: (data) => api.post('/auth/school/forgot-password/question', data),
    forgotVerify:   (data) => api.post('/auth/school/forgot-password/verify', data),
    forgotReset:    (data) => api.post('/auth/school/forgot-password/reset', data),
  },
};
