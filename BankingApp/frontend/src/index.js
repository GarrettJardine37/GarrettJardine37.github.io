import React from 'react';
import App from './App';
import Navbar from "./components/Navbar.js";

import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';

const container = document.getElementById("root")
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);