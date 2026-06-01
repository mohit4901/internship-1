import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('baio_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const errMessage = error?.response?.data?.message || error?.message || 'Unknown API Error';
    
    // Inject visual error on screen for debugging
    if (typeof document !== 'undefined') {
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.bottom = '20px';
      errorDiv.style.right = '20px';
      errorDiv.style.background = '#ef4444';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '16px';
      errorDiv.style.borderRadius = '8px';
      errorDiv.style.zIndex = '99999';
      errorDiv.style.maxWidth = '350px';
      errorDiv.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)';
      errorDiv.style.fontFamily = 'sans-serif';
      errorDiv.style.fontSize = '14px';
      errorDiv.innerHTML = `<strong style="display:block;margin-bottom:4px">API Error (${status || 'Network'})</strong><div style="word-break:break-word">${errMessage}</div><div style="font-size:10px;margin-top:8px;opacity:0.8">${error?.config?.url}</div>`;
      
      const closeBtn = document.createElement('button');
      closeBtn.innerText = '×';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '8px';
      closeBtn.style.right = '8px';
      closeBtn.style.background = 'none';
      closeBtn.style.border = 'none';
      closeBtn.style.color = 'white';
      closeBtn.style.fontSize = '16px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => document.body.removeChild(errorDiv);
      errorDiv.appendChild(closeBtn);

      document.body.appendChild(errorDiv);
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 7000);
    }

    if (status === 401) {
      localStorage.removeItem('baio_admin_token');
      localStorage.removeItem('baio_admin_user');
      window.location.href = '/';
    }
    return Promise.reject(error?.response?.data || error);
  },
);

export default api;
