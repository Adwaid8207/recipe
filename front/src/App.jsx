import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddRecipe from './components/AddRecipe';
import ViewRecipe from './components/ViewRecipe';
import UpdateRecipe from './components/UpdateRecipe';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProfilePage from './components/ProfilePage'; 

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsSignedIn(!!token);
  }, []);

  return (
    <Router>
      
      {isSignedIn && <Navbar isSignedIn={isSignedIn} />}
      <Routes>
       
        <Route path="/" element={isSignedIn ? <Navigate to="/home" /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn setIsSignedIn={setIsSignedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={isSignedIn ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/add-recipe" element={isSignedIn ? <AddRecipe /> : <Navigate to="/signin" />} />
        <Route path="/view-recipes" element={isSignedIn ? <ViewRecipe /> : <Navigate to="/signin" />} />
        <Route path="/updateRecipe/:id" element={isSignedIn ? <UpdateRecipe /> : <Navigate to="/signin" />} />
        <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to="/signin" />} /> 
      </Routes>
    </Router>
  );
};

export default App;
