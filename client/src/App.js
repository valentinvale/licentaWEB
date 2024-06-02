
import './App.css';
import PetListComponent from './components/PetListComponent';
import RegisterPage from './components/RegisterPage';
import AuthenticationPage from './components/AuthenticationPage';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostPet from './components/PostPet';
import PetPage from './components/PetPage';
import { AuthContextProvider } from './Context/AuthContext';
import UserPage from './components/UserPage';
import HomePage from './components/HomePage';
import ConfirmAdoption from './components/ConfirmAdoption';
import VetClinicsPage from './components/VetClinicsPage';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <AuthContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/petlist" element={<PetListComponent />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/postpet" element={<PostPet />} />
          <Route path="/pets/:id" element={<PetPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/confirm-adoption" element={<ConfirmAdoption />} />
          <Route path="/vetclinics" element={<VetClinicsPage />} />
          <Route path='/profile' element={<UserProfile />} />
        </Routes>
      </Layout>
    </AuthContextProvider>
  );
}

export default App;
