const express = require('express');
const router = express.Router();
const { db } = require('../firebaseSetup');
const authMiddleware = require('../middlewares/authMiddleware');
const UserModel = require('../models/UserModel');

router.get('/:userId', authMiddleware, async (req, res) => {
    const userId = req.params.userId;
    const snapshot = await db.ref(`users/${userId}`).once('value');
    if (!snapshot.exists()) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    const user = new UserModel(snapshot.val());
    res.json(user);
});

module.exports = router;