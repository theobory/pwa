const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebaseSetup');
const UserModel = require('../models/UserModel');

router.post('/register', async (req, res) => {
    const { email, name, uid } = req.body;

    if (!email || !uid) {
        return res.status(400).json({ error: 'Email et uid requis.' });
    }

    try {
        const snapshot = await db.ref(`users/${uid}`).once('value');
        if (snapshot.exists()) {
            return res.status(200).json({ message: 'Utilisateur déjà existant.' });
        }

        const userData = new UserModel({ id: uid, email, displayName: name });
        await db.ref(`users/${uid}`).set(userData);

        res.status(201).json({
            message: 'Utilisateur enregistré en base avec succès.',
            uid,
            email,
        });
    } catch (error) {
        console.error('Erreur enregistrement utilisateur:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
