// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Home.css';

const defaultIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background-color: #ff6f00; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const Home = () => {
  const { currentUser } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [safetyFact, setSafetyFact] = useState('');
  const [emergencyContacts] = useState([
    { name: 'Police', number: '911' },
    { name: 'Ambulance', number: '112' },
    { name: 'Fire Department', number: '101' }
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        setUserLocation([latitude, longitude]);
      });
    }

    const date = new Date();
    const facts = [
      'Stay aware of your surroundings at all times.',
      'Never share personal information with strangers.',
      'Always have emergency contacts saved in your phone.'
    ];
    setSafetyFact(facts[date.getDate() % facts.length]);
  }, []);

  return (
    <div className="home-container">
      <h1 className="title">Welcome to Crime Watch</h1>
      <p className="subtitle">
        Your go-to platform for real-time crime reporting and safety information.
      </p>

      {currentUser ? (
        <div className="action-buttons">
          <Link className="cta-button" to="/report">Report a Crime</Link>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link className="cta-button" to="/register">Join Now</Link>
          <Link className="secondary-button" to="/login">Login</Link>
        </div>
      )}

      <div className="map-container">
        <h2>Crime Map</h2>
        <div className="map-wrapper">
          <MapContainer
            center={userLocation || [51.505, -0.09]}
            zoom={13}
            className="map"
            style={{ height: '350px', width: '80%', margin: '0 auto', borderRadius: '12px' }} // Increased height and decreased width
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation && (
              <Marker position={userLocation} icon={defaultIcon}>
                <Popup>
                  Your Location
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      <div className="safety-tips">
        <h2>Safety Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>Stay Alert</h3>
            <p>{safetyFact}</p>
          </div>
          <div className="tip-card">
            <h3>Emergency Contacts</h3>
            {emergencyContacts.map((contact, index) => (
              <p key={index}>{contact.name}: {contact.number}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
