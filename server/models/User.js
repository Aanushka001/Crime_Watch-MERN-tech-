import admin from 'firebase-admin';

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.displayName = data.displayName;
    this.createdAt = data.createdAt;
  }

  static async findById(userId) {
    try {
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) return null;
      return new User({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const db = admin.firestore();
      const userRef = await db.collection('users').add({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return new User({ id: userRef.id, ...userData });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(updates) {
    try {
      const db = admin.firestore();
      await db.collection('users').doc(this.id).update(updates);
      Object.assign(this, updates);
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

export default User;
