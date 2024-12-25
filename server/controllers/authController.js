import admin from '../config/firebase-admin.js';  
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Failed to log out' });
    res.json({ message: 'Logged out successfully' });
  });
};

export const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; 
    next();  
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {    const user = await admin.auth().getUser(req.user.uid);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile', details: error.message });
  }
};
