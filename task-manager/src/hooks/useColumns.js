import { useState, useEffect } from 'react';
import api from '../services/apiService';

export const useColumns = (boardId) => {
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const res = await api.get(`/columns/${boardId}`);
                setColumns(res.data || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (boardId) fetchColumns();
    }, [boardId]);

    return { columns, loading, error };
};
