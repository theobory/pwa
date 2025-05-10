import api from './apiService';

export const addTask = async (boardId, columnId, task) => {
    const res = await api.post(`/tasks/${boardId}/${columnId}`, task);
    return res.data;
};

export const updateTask = async (boardId, columnId, taskId, updatedData) => {
    const res = await api.put(`/tasks/${boardId}/${columnId}/${taskId}`, updatedData);
    return res.data;
};

export const deleteTask = async (boardId, columnId, taskId) => {
    const res = await api.delete(`/tasks/${boardId}/${columnId}/${taskId}`);
    return res.data;
};

export const changeTaskColumn = async (boardId, columnId, taskId, newColumnId) => {
    const res = await api.post(`/tasks/${boardId}/${columnId}/${taskId}/changeColumn`, { columnId: newColumnId });
    return res.data;
};
