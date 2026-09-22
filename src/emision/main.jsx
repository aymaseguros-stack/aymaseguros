import React from 'react';
import ReactDOM from 'react-dom/client';
import EmisionPage from './EmisionPage';
import { tokenDeLaRuta } from './api';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EmisionPage token={tokenDeLaRuta(window.location.pathname)} />
  </React.StrictMode>
);
