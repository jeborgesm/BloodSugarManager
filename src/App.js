import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './IndexPage';
import CarbTablePage from './CarbTablePage';
import CarbTableFromJsonPage from './CarbTableFromJsonPage';
import FoodsCrudPage from './FoodsCrudPage';

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
