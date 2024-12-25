import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../../styles/Header.css'; 

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...'); // Placeholder for actual logout action
    // After logout action, you may redirect or perform other actions as needed
    setShowProfileMenu(false); // Close the profile menu after logout
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <h1 className="site-title">Crime Watch</h1>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/report" className="nav-link">Report a Crime</Link>
          <div className="profile-menu">
            <div onClick={toggleProfileMenu} className="profile-toggle">
              <FaUser className="profile-icon" />
              <span>Profile</span>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <ul className="profile-list">
                  <li className="profile-item"><Link to="/profile" className="profile-link">Show profile</Link></li>
                  <li className="profile-item" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
