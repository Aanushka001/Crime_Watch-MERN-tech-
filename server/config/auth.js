import { adminAuth } from './firebase-admin.js';  
import User from '../models/User';  
import passport from 'passport';
import firebase from 'firebase/app';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRecord = await adminAuth.getUser(id);
    const user = await User.findOne({ googleId: userRecord.uid });

    if (!user) {
      const newUser = new User({
        googleId: userRecord.uid,
        name: userRecord.displayName,
        email: userRecord.email,
      });
      await newUser.save();
      done(null, newUser);
    } else {
      done(null, user);
    }
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    done(err, null);
  }
});

passport.use(
  'firebase-email',
  new firebase.auth.PasswordAuthProvider(),
  async (email, password, done) => {
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      if (userRecord) {
        done(null, userRecord);
      } else {
        done(null, false, { message: 'User not found' });
      }
    } catch (err) {
      console.error('Error in Firebase Email Authentication:', err);
      done(err, null);
    }
  }
);

export default function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Error in deserializeUser:', err);
      done(err, null);
    }
  });
}
