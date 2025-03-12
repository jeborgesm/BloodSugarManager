import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App'; // Importing the main App component
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
