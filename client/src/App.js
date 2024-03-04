
import './App.css';
import PetListComponent from './components/PetListComponent';
import RegisterPage from './components/RegisterPage';
import AuthenticationPage from './components/AuthenticationPage';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PetListComponent />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<AuthenticationPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
