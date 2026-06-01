import api from './api';

export const submitContact = (data) => api.post('/contact', data);
