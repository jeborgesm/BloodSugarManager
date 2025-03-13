import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage'; // Corrected import path
import CarbTablePage from './pages/CarbTablePage';
import CarbTableFromJsonPage from './pages/CarbTableFromJsonPage';
import FoodsCrudPage from './pages/FoodsCrudPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/carbtable" element={<CarbTablePage />} />
                <Route path="/carbtablefromjson" element={<CarbTableFromJsonPage />} />
                <Route path="/foods" element={<FoodsCrudPage />} />
            </Routes>
        </Router>
    );
}

export default App;

