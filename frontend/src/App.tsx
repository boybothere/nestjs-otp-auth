import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans p-4">
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
