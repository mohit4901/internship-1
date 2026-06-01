import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AdminAuthProvider } from './context/AuthContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </React.StrictMode>,
);
