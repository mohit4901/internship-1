import api from './api';

export const registerForOlympiad  = (data) => api.post('/registrations', data);
export const getMyRegistrations   = ()      => api.get('/registrations/me');
export const getRegistration      = (id)    => api.get(`/registrations/${id}`);
