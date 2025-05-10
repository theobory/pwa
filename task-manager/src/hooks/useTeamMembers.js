import { useState, useEffect } from "react";
import { getTeamMembers } from "../services/boardsService";

export const useTeamMembers = (boardId) => {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            const data = await getTeamMembers(boardId);
            setTeamMembers(data || []);
        };
        if (boardId) {
            fetchTeamMembers();
        }
    }, [boardId]);

    return { teamMembers: teamMembers || [] };
};
