import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MapView from './components/Layout/Map/MapView.jsx';
import ReportForm from './components/Reports/ReportForm.jsx';
import ReportList from './components/Reports/ReportList.jsx';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer';
import ProfilePage from './components/Reports/ProfilePage';
import Home from './components/Home';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ReportProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/map"
                  element={
                    <PrivateRoute>
                      <MapView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <PrivateRoute>
                      <ReportForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <PrivateRoute>
                      <ReportList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ReportProvider>
    </AuthProvider>
  );
};

export default App;
