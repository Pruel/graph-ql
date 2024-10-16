// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // Используем './app' в нижнем регистре
// Удалите следующую строку, если у вас нет файла 'app.css':
// import './app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
