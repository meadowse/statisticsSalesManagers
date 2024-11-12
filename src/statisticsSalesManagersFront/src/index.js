import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import ROUTES from './routes/Routes';

import './index.css';

const router = createBrowserRouter(ROUTES);
const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
root.render(<RouterProvider router={router} />);
