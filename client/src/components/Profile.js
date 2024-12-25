import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../../services/firebaseConfig';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Error fetching profile details.');
      }
    };

    if (!auth.currentUser) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  return (
    <div className="profile-container">
      {error && <p className="error-message">{error}</p>}
      {userProfile ? (
        <div className="profile-card">
          <h2 className="profile-title">User Profile</h2>
          <p><strong>Username:</strong> {userProfile.username}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>UID:</strong> {userProfile.uid}</p>
          <p><strong>Account Created:</strong> {new Date(userProfile.createdAt).toLocaleString()}</p>
          <p><strong>Last Login:</strong> {new Date(userProfile.lastLogin).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default Profile;
