/**
 * admin/src/services/index.js — Centralized API service barrel for the Admin Panel.
 *
 * Import pattern (preferred):
 *   import { authAPI, olympiadAPI, resultAPI } from '../services';
 *
 * All modules share the same Axios instance (./api.js) so the 401 interceptor
 * (auto logout + redirect) applies globally across every admin call.
 */

// ── Named API objects ─────────────────────────────────────────────────────────
export { authAPI }         from './authAPI';
export { studentAPI }      from './studentAPI';
export { schoolAPI }       from './schoolAPI';
export { participantAPI }  from './participantAPI';
export { olympiadAPI }     from './olympiadAPI';
export { announcementAPI } from './announcementAPI';
export { resultAPI }       from './resultAPI';
export { registrationAPI } from './registrationAPI';
export { dashboardAPI }    from './dashboardAPI';
export { cmsAPI }          from './cmsAPI';
export { contactAPI }      from './contactAPI';
export { mediaAPI }        from './mediaAPI';

// ── Raw Axios instance (edge cases only) ──────────────────────────────────────
export { default as api }  from './api';
