import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './IndexPage';
import CarbTablePage from './CarbTablePage';
import CarbTableFromJsonPage from './CarbTableFromJsonPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/carbtable" element={<CarbTablePage />} />
                <Route path="/carbtablefromjson" element={<CarbTableFromJsonPage />} />
            </Routes>
        </Router>
    );
}

export default App;