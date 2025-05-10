const express = require('express');
const { db } = require('../firebaseSetup');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


const addTask = async ({ title, description, dueDate, assignee, labels, boardId, columnId }, res) => {
    try {
        const ref = db.ref(`columns/${boardId}/${columnId}/tasks`).push();
        const task = { 
            id: ref.key, 
            title: title || '', 
            description: description || '', 
            dueDate: dueDate || '', 
            assignee: assignee || '', 
            labels: labels || [] 
        };
        await ref.set(task);

        res.json(task);
    } catch (error) {
        console.error('Erreur ajout tâche:', error);

        res.status(500).json({ error: 'Erreur ajout tâche' });
    }
}

const deleteTask = async ({ boardId, columnId, taskId }) => {
    await db.ref(`columns/${boardId}/${columnId}/tasks/${taskId}`).remove();
    const task = await db.ref(`columns/${boardId}/${columnId}/tasks/${taskId}`).once('value');
    if (!task.exists()) {
        console.log("task removed");
    } else {
        console.log("task not removed");
    }
}

router.post('/:boardId/:columnId', authMiddleware, async (req, res) => {
    const { title, description, dueDate, assignee, labels } = req.body;
    const { boardId, columnId } = req.params;

    await addTask({ title, description, dueDate, assignee, labels, boardId, columnId }, res);
});

router.put('/:boardId/:columnId/:taskId', authMiddleware, async (req, res) => {
    const { title, description, dueDate, assignee, labels } = req.body;
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).update({ title, description, dueDate, assignee, labels: labels || [] });
    const task = await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).once('value');
    console.log(task.val());

    res.json(task.val() || {});
});

router.delete('/:boardId/:columnId/:taskId', authMiddleware, async (req, res) => {
    await deleteTask({ boardId: req.params.boardId, columnId: req.params.columnId, taskId: req.params.taskId });
    res.json({ success: true });
});

router.post('/:boardId/:columnId/:taskId/assignee', authMiddleware, async (req, res) => {
    const { assignee } = req.body;
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}/assignee`).set(assignee);
    const task = await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).once('value');

    res.json(...task.val() || {});
});

router.post('/:boardId/:columnId/:taskId/labels', authMiddleware, async (req, res) => {
    const { labels } = req.body;
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}/labels`).set(labels);
    const task = await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).once('value');

    res.json(...task.val() || {});
});

router.post('/:boardId/:columnId/:taskId/dueDate', authMiddleware, async (req, res) => {
    const { dueDate } = req.body;
    await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}/dueDate`).set(dueDate);
    const task = await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).once('value');

    res.json(...task.val() || {});
});

router.post('/:boardId/:columnId/:taskId/changeColumn', authMiddleware, async (req, res) => {
    const { columnId } = req.body;
    const task = await db.ref(`columns/${req.params.boardId}/${req.params.columnId}/tasks/${req.params.taskId}`).once('value');
    await deleteTask({ boardId: req.params.boardId, columnId: req.params.columnId, taskId: req.params.taskId });

    await addTask({ title: task.val().title, description: task.val().description, dueDate: task.val().dueDate, assignee: task.val().assignee, labels: task.val().labels, boardId: req.params.boardId, columnId: columnId }, res);
});

module.exports = router;
