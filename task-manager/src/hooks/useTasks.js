import { useState, useEffect } from 'react';
import api from '../services/apiService';

export const useTasks = (boardId, columnId) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get(`/columns/${boardId}/${columnId}/tasks`);
                setTasks(res.data || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (boardId && columnId) fetchTasks();
    }, [boardId, columnId]);

    return { tasks, loading, error };
};
