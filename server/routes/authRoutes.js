import { Router } from 'express';
import passport from 'passport';
import { logout, verifyToken, getUserProfile } from '../controllers/authController.js';

const router = Router();

router.get('/logout', logout);

router.post('/login', passport.authenticate('firebase-email', { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    res.json({
      message: 'Login successful',
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    res.json({
      message: 'User registered successfully',
      user: userRecord,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

router.get('/profile', verifyToken, getUserProfile);

export default router;
