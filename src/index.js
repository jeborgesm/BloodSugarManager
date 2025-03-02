import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import IndexPage from './IndexPage';
import CarbTablePage from './CarbTablePage';
import CarbTableFromJsonPage from './CarbTableFromJsonPage';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Router>
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/carbtable" element={<CarbTablePage />} />
            <Route path="/carbtablefromjson" element={<CarbTableFromJsonPage />} />
        </Routes>
    </Router>
);
