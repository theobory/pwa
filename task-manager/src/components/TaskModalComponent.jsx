import { Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { updateTask, changeTaskColumn, deleteTask } from "../services/tasksService";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { getColumns } from "../services/columnsService";

export const getLabelColor = (label) => {
  const asciiSum = label.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colors = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100',
    'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-teal-100',
    'bg-orange-100', 'bg-cyan-100', 'bg-lime-100', 'bg-emerald-100',
    'bg-rose-100', 'bg-violet-100', 'bg-fuchsia-100'
  ];
  return colors[asciiSum % colors.length];
};

export default function TaskModal({ task, onClose, onUpdate, open, boardId, columnId }) {
  if (!task) return null;
  const [taskForm, setTaskForm] = useState(task);
  const [newLabel, setNewLabel] = useState('');
  const { teamMembers } = useTeamMembers(boardId);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    async function fetchColumns() {
      const data = await getColumns(boardId);
      setColumns(Object.values(data || {}));
    }
    fetchColumns();
  }, [boardId]);

  useEffect(() => {
    if (task) setTaskForm(task);
  }, [task]);

  const handleSaveTask = async () => {
    await updateTask(boardId, columnId, taskForm.id, taskForm);
    await onUpdate();
    onClose();
  };

  const handleColumnChange = async (e) => {
    const newColumnId = e.target.value;
    await changeTaskColumn(boardId, columnId, taskForm.id, newColumnId);
    setTaskForm({ ...taskForm, columnId: newColumnId });
    await onUpdate();
    onClose();
  };

  const handleDeleteTask = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      await deleteTask(boardId, columnId, taskForm.id);
      await onUpdate();
      onClose();
    }
  };

  return open && (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-md w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <div className="mb-3">
            <span className="font-semibold">Titre:</span>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <span className="font-semibold">Description:</span>
            <textarea
              className="w-full border px-2 py-1 rounded"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              rows={2}
            ></textarea>
          </div>

          <div className="mb-3">
            <span className="font-semibold">Échéance:</span>
            <input
              type="date"
              className="w-full border px-2 py-1 rounded"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <span className="font-semibold">Labels:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(taskForm.labels || []).map((label, index) => (
                <span key={index} className={`${getLabelColor(label)} px-2 py-1 rounded`}>{label}</span>
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              <input
                type="text"
                placeholder="Ajouter un label"
                className="border rounded px-2 py-1 w-full"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <button
                onClick={() => {
                  if (newLabel.trim()) {
                    setTaskForm({ ...taskForm, labels: [...(taskForm.labels || []), newLabel.trim()] });
                    setNewLabel('');
                  }
                }}
                className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="mb-3">
            <span className="font-semibold">Colonne:</span>
            <select
              className="w-full border px-2 py-1 rounded"
              value={taskForm.columnId || columnId}
              onChange={handleColumnChange}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <span className="font-semibold">Assigné à:</span>
            <select
              className="w-full border px-2 py-1 rounded"
              value={taskForm.assignee}
              onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>{member.displayName}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSaveTask}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Sauvegarder
            </button>
            <button
              onClick={handleDeleteTask}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
