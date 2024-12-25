import { adminAuth } from '../config/firebase-admin.js';

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed', details: err.message });
    }
    res.json({ message: 'Logout successful' });
  });
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token', details: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.metadata.creationTime,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
  }
};
