import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import IndexPage from './pages/IndexPage';
import CarbTablePage from './pages/CarbTablePage';
import CarbTableFromJsonPage from './pages/CarbTableFromJsonPage';
import FoodsCrudPage from './pages/FoodsCrudPage';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Router>
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/carbtable" element={<CarbTablePage />} />
            <Route path="/carbtablefromjson" element={<CarbTableFromJsonPage />} />
            <Route path="/foods" element={<FoodsCrudPage />} />
        </Routes>
    </Router>
);
