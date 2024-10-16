import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/login';
import Profile from './components/profile/profile';
import Header from './components/header/header';
import { getToken } from './services/auth';

function App() {
  const isAuthenticated = !!getToken();

  return (
    <Router>
      {/* Header будет отображаться только на защищённых маршрутах */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <>
                <Header />
                <Profile />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
