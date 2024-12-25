import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ReportProvider } from './context/ReportContext.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ReportProvider>
        <App />
      </ReportProvider>
    </AuthProvider>
  </React.StrictMode>
);
