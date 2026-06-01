/**
 * services/index.js — Centralized API service barrel for the Student Portal.
 *
 * Import pattern (preferred):
 *   import { authAPI, olympiadAPI, resultAPI } from '../services';
 *
 * All modules share the same Axios instance (./api.js) so interceptors
 * (token injection, 401 redirect) apply globally.
 */

// ── Named API objects ─────────────────────────────────────────────────────────
export { authAPI }         from './authAPI';
export { studentAPI }      from './studentAPI';
export { schoolAPI }       from './schoolAPI';
export { olympiadAPI }     from './olympiadAPI';
export { announcementAPI } from './announcementAPI';
export { resultAPI }       from './resultAPI';

// ── Misc service helpers (kept for backward compat) ───────────────────────────
export { getCmsContent }                                  from './cms.service';
export { submitContact }                                  from './contact.service';
export { registerForOlympiad, getMyRegistrations,
         getRegistration }                                from './registration.service';

// ── Raw Axios instance (needed only in edge cases) ────────────────────────────
export { default as api } from './api';
