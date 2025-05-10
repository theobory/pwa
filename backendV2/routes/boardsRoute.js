const express = require('express');
const { db } = require('../firebaseSetup');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { name } = req.body;
    const userId = req.user.uid;

    if (!name) {
        return res.status(400).json({ error: 'Le nom du board est requis.' });
    }

    try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const boardData = { name, owner: userId, code, members: [userId], createdAt: Date.now() };

        const ref = await db.ref('boards').push();
        await ref.set({ id: ref.key, ...boardData });

        res.status(201).json({ id: ref.key, ...boardData });
    } catch (error) {
        console.error('Erreur création board:', error);
        res.status(500).json({ error: 'Erreur lors de la création du board.' });
    }
});

router.post('/join', authMiddleware, async (req, res) => {
    const { code } = req.body;
    const userId = req.user.uid;

    if (!code) {
        return res.status(400).json({ error: 'Le code est requis.' });
    }

    try {
        const snapshot = await db.ref('boards').orderByChild('code').equalTo(code).once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Aucun board trouvé avec ce code.' });
        }

        let boardId = null;
        let boardData = null;

        snapshot.forEach(child => {
            boardId = child.key;
            boardData = child.val();
        });

        if (!boardData.members.includes(userId)) {
            boardData.members.push(userId);
            await db.ref(`boards/${boardId}`).update({ members: boardData.members });
        }

        res.json({ message: 'Board rejoint avec succès.', boardId, name: boardData.name });
    } catch (error) {
        console.error('Erreur rejoindre board:', error);
        res.status(500).json({ error: 'Erreur lors de la tentative de rejoindre le board.' });
    }
});

router.get('/:boardId/team-members', authMiddleware, async (req, res) => {
    const boardId = req.params.boardId;
    const board = await db.ref(`boards/${boardId}`).once('value');
    const teamMembers = board.val().members;
    const teamMembersData = await Promise.all(teamMembers.map(async (memberId) => {
        const userRef = db.ref('users').orderByChild('id').equalTo(memberId);
        const userSnapshot = await userRef.once('value');
        let userData;
        userSnapshot.forEach(child => { userData = child.val(); });
        return { id: userData.id, email: userData.email, displayName: userData.displayName };
    }));
    res.json(teamMembersData);
});

router.delete('/:boardId', authMiddleware, async (req, res) => {
    try {
        const boardRef = db.ref(`boards/${req.params.boardId}`);
        const snapshot = await boardRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Board non trouvé' });
        }

        const board = snapshot.val();

        if (board.owner !== req.user.uid) {
            return res.status(403).json({ error: 'Accès interdit : vous n’êtes pas le propriétaire du board.' });
        }

        await boardRef.remove();
        await db.ref(`columns/${req.params.boardId}`).remove();

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur suppression board:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du board.' });
    }
});

module.exports = router;
