import api from './api';

export const getCmsContent = (key) => api.get(`/cms/${key}`);
