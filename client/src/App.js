
import './App.css';
import PetListComponent from './components/PetListComponent';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PetListComponent />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
