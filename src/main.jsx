
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import './axiosConfig.jsx';
import { DarkModeProvider } from './components/DarkModeContext.jsx';


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);