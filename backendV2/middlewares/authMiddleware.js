const { admin, db } = require('../firebaseSetup');
const UserModel = require('../models/UserModel');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;

        const snapshot = await db.ref(`users/${decodedToken.uid}`).once('value');
        if (snapshot.exists()) {
            req.userProfile = new UserModel(snapshot.val());
        }

        next();
    } catch (error) {
        console.error('Erreur auth middleware:', error);
        res.status(401).json({ error: 'Token invalide' });
    }
};
