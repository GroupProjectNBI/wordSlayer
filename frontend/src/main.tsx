import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const isTest =
  typeof window !== "undefined" &&
  window.location.search.includes("test");

const Root = isTest ? (
  <BrowserRouter>
    <App />
  </BrowserRouter>
) : (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(Root);
