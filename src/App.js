// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ApartmentLogin from './apartments/ApartmentLogin';
import ApartmentCreation from './apartments/ApartmentCreation';
import ApartmentPage from './pages/ApartmentPage';
import NotFound from './pages/NotFound';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [aptId, setAptId] = useState(localStorage.getItem('aptId'));
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    // If the authToken exists and no aptId is set, validate the token and set the user's auth state
    if (authToken && !aptId) {
      // Here you'd send the token to the backend to validate it and get the user's information/apartment ID
      setAptId('someAptIdFromToken');
    }
  }, [authToken, aptId]);

  const handleLogin = (id) => {
    setAptId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token
    localStorage.removeItem('aptId');
    setAptId(null);
    setAuthToken(null);
  };

  return (
    <BrowserRouter>
      <Layout isLoggedIn={aptId != null} onLogout={handleLogout} />
      <Routes>
        <Route exact path="/login" element={aptId ? <Navigate to={`/apartment/${aptId}`} /> : <ApartmentLogin onLogin={handleLogin} />} />
        <Route exact path="/signup" element={<ApartmentCreation onSignUp={setAptId} />} />
        <Route exact path="/apartment/:id" element={
          <ProtectedRoute isAuthenticated={aptId != null}>
            <ApartmentPage aptId={aptId} />
          </ProtectedRoute>
        } />       
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;