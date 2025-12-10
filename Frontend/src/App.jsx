import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketingPage from '../marketing-page/MarketingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<MarketingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
