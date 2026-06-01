/**
 * Admin — mediaAPI
 * import { mediaAPI } from '../services';
 */
import api from './api';

export const mediaAPI = {
  /**
   * Upload a single file.
   * @param {File} file - browser File object
   * @param {function} onProgress - optional upload progress callback (0-100)
   */
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined,
    });
  },

  /**
   * Get public URL for a media ID
   */
  url: (id) => `${api.defaults.baseURL}/media/${id}`,
};
