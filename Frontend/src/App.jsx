import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketingPage from '../marketing-page/MarketingPage.jsx';
import Audit from './screen/Audit.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/audits" element={<Audit />} />
        <Route path="/" element={<MarketingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
