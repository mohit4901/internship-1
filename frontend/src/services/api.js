import axios from 'axios';
import logger from '../utils/debugLogger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';

logger.info('API client initialised', `Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('baio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    let requestData = config.data;
    if (typeof requestData === 'string') {
      try {
        requestData = JSON.parse(requestData);
      } catch (e) {
        // ignore
      }
    }
    
    logger.request(config.method, config.url, requestData);
    return config;
  },
  (error) => {
    logger.error('Request setup failed', error?.message);
    return Promise.reject(error);
  },
);

// ── Response Interceptor ───────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    logger.response(
      response.config.method,
      response.config.url,
      response.status,
      response.data,
    );
    return response;
  },
  (error) => {
    const status     = error?.response?.status;
    const errMessage = error?.response?.data?.message || error?.message || 'Unknown API Error';
    const url        = error?.config?.url || 'unknown-url';
    const method     = error?.config?.method || 'GET';

    logger.apiError(method, url, status, errMessage);

    // Show visual error toast
    if (typeof document !== 'undefined') {
      const errorDiv = document.createElement('div');
      errorDiv.id = `api-err-${Date.now()}`;
      errorDiv.style.cssText = `
        position:fixed;bottom:20px;right:20px;
        background:#7f1d1d;color:white;padding:14px 18px;
        border-radius:10px;z-index:99999;max-width:360px;
        box-shadow:0 10px 30px rgba(0,0,0,0.5);
        font-family:monospace;font-size:12px;line-height:1.5;
        border:1px solid #ef4444;
      `;
      errorDiv.innerHTML = `
        <strong style="display:block;margin-bottom:4px;font-size:13px">
          🚨 API Error ${status ? `(${status})` : '(Network)'}
        </strong>
        <div style="word-break:break-word;opacity:0.9">${errMessage}</div>
        <div style="font-size:10px;margin-top:6px;opacity:0.6">${method?.toUpperCase()} ${url}</div>
        <button onclick="this.parentElement.remove()" style="position:absolute;top:6px;right:8px;background:none;border:none;color:white;font-size:16px;cursor:pointer">×</button>
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.isConnected && errorDiv.remove(), 8000);
    }

    if (status === 401) {
      logger.auth('Session expired – clearing local auth & redirecting to login');
      localStorage.removeItem('baio_token');
      localStorage.removeItem('baio_user');
      // only redirect if not already on a login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/student/login';
      }
    }

    return Promise.reject(error?.response?.data || error);
  },
);

export default api;
