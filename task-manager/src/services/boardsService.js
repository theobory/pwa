import { getAuth } from 'firebase/auth';
import api from './apiService';

export async function getBoards() {
    try {
        const response = await api.get("/boards");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des boards :", error);
        throw new Error("Impossible de récupérer les tableaux");
    }
}

export async function createBoard(name) {
    try {
        const response = await api.post("/boards", { name });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du tableau :", error);
        throw new Error("Impossible de créer le tableau");
    }
}

export async function joinBoard(code) {
    try {
        const response = await api.post("/boards/join", { code });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la tentative de rejoindre un tableau :", error);
        throw new Error("Impossible de rejoindre le tableau");
    }
}

export async function getTeamMembers(boardId) {
    try {
        const response = await api.get(`/boards/${boardId}/team-members`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des membres du tableau :", error);
        throw new Error("Impossible de récupérer les membres du tableau");
    }
}

export async function addTeamMember(boardId, memberId) {
    try {
        const response = await api.post(`/boards/${boardId}/team-members`, { memberId });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout d'un membre au tableau :", error);
        throw new Error("Impossible d'ajouter un membre au tableau");
    }
}

export async function removeTeamMember(boardId, memberId) {
    try {
        const response = await api.delete(`/boards/${boardId}/team-members/${memberId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression d'un membre du tableau :", error);
        throw new Error("Impossible de supprimer un membre du tableau");
    }
}

export async function deleteBoard(boardId) {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const res = await api.delete(`/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

