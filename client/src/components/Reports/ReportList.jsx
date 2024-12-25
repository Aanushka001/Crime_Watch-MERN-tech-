import React, { useEffect } from 'react';
import { useReport } from '../../context/ReportContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import '../../styles/ReportList.css';

const ReportList = () => {
  const { reports, setReports, loading, error } = useReport();

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
      },
      (err) => {
        console.error("Error fetching reports: ", err.message);
      }
    );

    return () => unsubscribe();
  }, [setReports]);

  if (loading) {
    return <div className="reports-container">Loading reports...</div>;
  }

  if (error) {
    return <div className="reports-container error">Error: {error}</div>;
  }

  return (
    <div className="reports-container">
      <h2 className="reports-title">Crime Reports</h2>
      {reports.length === 0 ? (
        <p className="no-reports">No reports available at the moment.</p>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.crimeType || "Unknown Crime"}</h3>
                <span className="report-date">
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "No Date"}
                </span>
              </div>
              <div className="report-content">
                <p><strong>Location:</strong> {report.location || "N/A"}</p>
                <p><strong>Description:</strong> {report.description || "No description provided."}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;
