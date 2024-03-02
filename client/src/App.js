
import './App.css';
import PetListComponent from './components/PetListComponent';
import RegisterPage from './components/RegisterPage';
import AuthenticationPage from './components/AuthenticationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PetListComponent />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<AuthenticationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
