import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../services/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ReportContext = createContext(null);

export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentUser) {
      // Modified query to only fetch user's own reports
      const q = query(
        collection(db, 'reports'),
        where('userId', '==', currentUser.uid)
      );

      unsubscribe = onSnapshot(
        q,
        snapshot => {
          setReports(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
          setLoading(false);
        },
        err => {
          console.error('Snapshot error:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setReports([]);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [currentUser]);

  const validateReport = (report) => {
    const requiredFields = ['crimeType', 'description', 'coordinates', 'date'];
    const errors = [];

    requiredFields.forEach(field => {
      if (!report[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (report.coordinates) {
      if (!Array.isArray(report.coordinates) || 
          report.coordinates.length !== 2 ||
          !report.coordinates.every(coord => typeof coord === 'number')) {
        errors.push('Coordinates must be an array of two numbers');
      }
    }

    if (report.date && !(report.date instanceof Date) && isNaN(new Date(report.date))) {
      errors.push('Invalid date format');
    }

    return errors;
  };

  const addReport = async (newReport) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to add reports');
    }

    const validationErrors = validateReport(newReport);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const sanitizedReport = {
      crimeType: newReport.crimeType.trim(),
      description: newReport.description.trim(),
      coordinates: newReport.coordinates,
      date: new Date(newReport.date).toISOString(),
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'reports'), sanitizedReport);
      return docRef.id;
    } catch (err) {
      console.error('Error adding report:', err);
      throw new Error('Failed to add report: ' + err.message);
    }
  };

  const updateReport = async (reportId, updatedData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update reports');
    }

    const validationErrors = validateReport(updatedData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const sanitizedUpdate = {
      ...updatedData,
      updatedAt: serverTimestamp()
    };

    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, sanitizedUpdate);
    } catch (err) {
      console.error('Error updating report:', err);
      throw new Error('Failed to update report: ' + err.message);
    }
  };

  const deleteReport = async (reportId) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to delete reports');
    }

    try {
      const reportRef = doc(db, 'reports', reportId);
      await deleteDoc(reportRef);
    } catch (err) {
      console.error('Error deleting report:', err);
      throw new Error('Failed to delete report: ' + err.message);
    }
  };

  const value = {
    reports,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    setError: (newError) => setError(newError),
    clearError: () => setError(null)
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};