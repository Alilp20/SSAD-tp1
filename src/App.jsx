// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Chat from './components/Chat';
import { useAuth } from './hooks/UseAuth'; // Custom hook for authentication

const App = () => {
  const { user } = useAuth(); // Use custom hook to check authentication status

  return (
    <Router>
      <Routes>
        {/* Redirect root path based on authentication status */}
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
        
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* Private Route */}
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
