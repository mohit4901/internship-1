/**
 * BAIO Frontend Debug Logger
 * Captures all API requests, responses, auth events, and errors.
 * Toggle visibility with the floating debug panel.
 */

const MAX_LOGS = 200;

const store = {
  logs: [],
  listeners: [],
};

const notify = () => store.listeners.forEach((fn) => fn([...store.logs]));

const addLog = (entry) => {
  const log = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  store.logs.unshift(log); // newest first
  if (store.logs.length > MAX_LOGS) store.logs.pop();
  notify();

  // Also mirror to console for browser devtools
  const prefix = `[BAIO ${log.type?.toUpperCase() || 'LOG'}]`;
  if (log.type === 'error') {
    console.error(prefix, log.message, log.detail || '');
  } else if (log.type === 'warn') {
    console.warn(prefix, log.message, log.detail || '');
  } else {
    console.log(prefix, log.message, log.detail || '');
  }
};

export const logger = {
  /** Generic info log */
  info: (message, detail) => addLog({ type: 'info', message, detail }),
  /** Warning log */
  warn: (message, detail) => addLog({ type: 'warn', message, detail }),
  /** Error log */
  error: (message, detail) => addLog({ type: 'error', message, detail }),
  /** Auth event */
  auth: (message, detail) => addLog({ type: 'auth', message, detail }),
  /** Outgoing API request */
  request: (method, url, data) =>
    addLog({
      type: 'request',
      message: `${method.toUpperCase()} ${url}`,
      detail: data ? JSON.stringify(data).slice(0, 300) : undefined,
    }),
  /** Successful API response */
  response: (method, url, status, data) =>
    addLog({
      type: 'response',
      message: `✓ ${status} ${method.toUpperCase()} ${url}`,
      detail: data ? JSON.stringify(data).slice(0, 500) : undefined,
    }),
  /** Failed API response */
  apiError: (method, url, status, message) =>
    addLog({
      type: 'error',
      message: `✗ ${status || 'NET_ERR'} ${method?.toUpperCase()} ${url}`,
      detail: message,
    }),
  /** Subscribe to log updates — returns unsubscribe fn */
  subscribe: (fn) => {
    store.listeners.push(fn);
    fn([...store.logs]); // emit current state immediately
    return () => {
      store.listeners = store.listeners.filter((l) => l !== fn);
    };
  },
  /** Clear all logs */
  clear: () => {
    store.logs = [];
    notify();
  },
};

export default logger;
