import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReport } from '../../context/ReportContext';
import '../../styles/ReportForm.css';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    crimeType: '',
    description: '',
    location: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const {
    reports,
    addReport,
    updateReport,
    deleteReport,
    error: contextError,
    clearError,
  } = useReport();

  useEffect(() => {
    if (contextError) {
      setError(contextError);
      clearError();
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setFormData((prev) => ({
            ...prev,
            location: `${latitude},${longitude}`,
          }));
        },
        () => setError('Unable to retrieve location. Enter manually.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, [contextError, clearError]);

  const validateForm = () => {
    const { crimeType, description, location, date } = formData;
    if (!crimeType || !description || !location || !date) {
      setError('All fields are required.');
      return false;
    }

    const [lat, lng] = location.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) {
      setError('Enter valid coordinates (latitude,longitude).');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      crimeType: '',
      description: '',
      location: '',
      date: '',
    });
    setEditId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const { crimeType, description, location, date } = formData;
    const [lat, lng] = location.split(',').map(Number);

    const reportData = {
      crimeType,
      description,
      coordinates: [lat, lng],
      date: new Date(date).toISOString(),
      userId: currentUser.uid,
    };

    try {
      if (editId) {
        await updateReport(editId, reportData);
      } else {
        await addReport(reportData);
      }
      resetForm();

      const emergencyLinks = {
        police: `https://www.google.com/maps/search/police+station/@${lat},${lng},15z`,
        ambulance: `https://www.google.com/maps/search/hospital/@${lat},${lng},15z`,
        fire: `https://www.google.com/maps/search/fire+station/@${lat},${lng},15z`,
        emergency: `https://www.google.com/maps/search/emergency+services/@${lat},${lng},15z`,
      };

      window.open(emergencyLinks.police, '_blank');
      window.open(emergencyLinks.ambulance, '_blank');
      window.open(emergencyLinks.fire, '_blank');
    } catch {
      setError('Failed to save the report. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (report) => {
    setFormData({
      crimeType: report.crimeType,
      description: report.description,
      location: report.coordinates.join(','),
      date: new Date(report.date).toISOString().substring(0, 10),
    });
    setEditId(report.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  return (
    <div className="report-container">
      <h2 className="title">{editId ? 'Edit Report' : 'New Report'}</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label className="label">Crime Type</label>
        <input
          type="text"
          name="crimeType"
          value={formData.crimeType}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <label className="label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <label className="label">Location (lat,lng)</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., 51.5074,-0.1278"
          disabled={isSubmitting}
        />

        <label className="label">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <div className="form-actions">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editId ? 'Update Report' : 'Submit Report'}
          </button>
          {editId && (
            <button
              type="button"
              className="button cancel-button"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="previous-reports">
        <h3>Previous Reports</h3>
        {reports.map((report) => (
          <div className="report-item" key={report.id}>
            <div className="report-summary">
              <p>{report.crimeType}</p>
              <p>{new Date(report.date).toLocaleDateString()}</p>
            </div>
            <p>{report.description}</p>
            <div className="report-actions">
              <button
                className="button"
                onClick={() => handleEdit(report)}
                disabled={isSubmitting}
              >
                Edit
              </button>
              <button
                className="button delete-button"
                onClick={() => deleteReport(report.id)}
                disabled={isSubmitting}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportForm;
