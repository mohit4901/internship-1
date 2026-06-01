import api from './api';

export const searchResults = (params) => api.get('/results/search', { params });
export const getMyResults  = ()        => api.get('/results/me');
