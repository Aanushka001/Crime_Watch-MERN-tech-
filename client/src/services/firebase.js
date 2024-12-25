import { collection, addDoc, setDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const createReport = async (reportData) => {
  const reportsCollection = collection(db, 'reports');
  const report = {
    coordinates: reportData.coordinates || [0, 0],
    crimeType: reportData.crimeType || '',
    date: new Date().toISOString(),
    description: reportData.description || '',
    location: reportData.location || '',
    userId: reportData.userId || ''
  };
  
  try {
    await addDoc(reportsCollection, report);
    console.log("Report added successfully!");
  } catch (error) {
    console.error("Error adding report: ", error);
    throw error;
  }
};

export const createUserDocument = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userData = {
    createdAt: new Date().toISOString(),
    displayName: user.displayName || '',
    email: user.email || ''
  };
  
  try {
    await setDoc(userRef, userData);
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user document: ", error);
    throw error;
  }
};

export const getUserReports = async (userId) => {
  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
