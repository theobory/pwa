import { useState, useEffect } from 'react';
import api from '../services/apiService';

export const useBoards = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await api.get('/boards');
                setBoards(res.data || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, []);

    return { boards, loading, error };
};
