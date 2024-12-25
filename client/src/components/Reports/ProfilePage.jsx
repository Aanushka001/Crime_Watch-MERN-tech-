import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ProfilePage.css'
const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    bio: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        occupation: currentUser.occupation || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!currentUser) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-header">User Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Occupation:</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>
          <div className="button-group">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-item">
            <strong>Name:</strong> {formData.name}
          </div>
          <div className="detail-item">
            <strong>Email:</strong> {formData.email}
          </div>
          <div className="detail-item">
            <strong>Phone:</strong> {formData.phone}
          </div>
          <div className="detail-item">
            <strong>Address:</strong> {formData.address}
          </div>
          <div className="detail-item">
            <strong>Occupation:</strong> {formData.occupation}
          </div>
          <div className="profile-bio">
            <strong>Bio:</strong>
            <p>{formData.bio}</p>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;