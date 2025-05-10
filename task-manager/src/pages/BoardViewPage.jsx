import { useState, useEffect } from "react";
import Column from "../components/ColumnComponent";
import TaskModal from "../components/TaskModalComponent";
import { getColumns, addColumn, deleteColumn } from "../services/columnsService";
import { addTask } from "../services/tasksService";
import { deleteBoard } from "../services/boardsService";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { getAuth } from "firebase/auth";
import { getLabelColor } from "../components/TaskModalComponent";

export default function BoardViewPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "", columnId: "", description: "", dueDate: "", labels: [], assignee: ""
  });
  const [newColumn, setNewColumn] = useState("");
  const { teamMembers } = useTeamMembers(boardId);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [newLabelInput, setNewLabelInput] = useState("");

  const fetchColumns = async () => {
    const data = await getColumns(boardId);
    const loaded = Object.values(data || {});
    setColumns(loaded);
    if (loaded.length) {
      setNewTask((t) => ({ ...t, columnId: loaded[0].id }));
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [boardId]);

  useEffect(() => {
    setNewTask((t) => ({ ...t, assignee: teamMembers[0]?.id || "" }));
  }, [teamMembers]);

  const hasColumns = columns.length > 0;

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    const cleanedTask = {
      ...newTask,
      description: newTask.description || '',
      dueDate: newTask.dueDate || '',
      assignee: newTask.assignee || '',
      labels: newTask.labels || []
    };
    await addTask(boardId, newTask.columnId, cleanedTask);
    setNewTask({
      title: "", columnId: columns[0]?.id || "", description: "", dueDate: "", labels: [], assignee: teamMembers[0]?.id || ""
    });
    await fetchColumns();
  };

  const handleAddColumn = async () => {
    if (!newColumn.trim()) return;
    const col = await addColumn(boardId, newColumn);
    setColumns((prev) => [...prev, col]);
    setNewColumn("");
  };

  const handleDeleteBoard = async () => {
    if (window.confirm("Supprimer ce board et toutes ses colonnes ?")) {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();
      await deleteBoard(boardId, token);
      navigate("/dashboard");
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (window.confirm("Supprimer cette colonne ?")) {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();
      await deleteColumn(boardId, columnId, token);
      await fetchColumns();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 border-b bg-white shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/dashboard")} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            ← Retour
          </button>
          <h1 className="text-xl font-bold">Trello Lite</h1>
        </div>
        <button
          onClick={handleDeleteBoard}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Supprimer le board 🗑
        </button>
      </div>

      {selectedTask && (
        <TaskModal
          open={modalOpen}
          task={selectedTask}
          boardId={boardId}
          columnId={selectedColumnId}
          onClose={() => setModalOpen(false)}
          onUpdate={fetchColumns}
        />
      )}

      <div className="p-4 flex flex-wrap gap-4 justify-center items-end">
        <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="border p-2 rounded" placeholder="Nom de tâche" disabled={!hasColumns} />
        <input value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="border p-2 rounded" placeholder="Description" disabled={!hasColumns} />
        <input 
          type="date"
          value={newTask.dueDate} 
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} 
          className="border p-2 rounded" 
          placeholder="Date d'échéance" 
          disabled={!hasColumns} 
        />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            {(newTask.labels || []).map((label, index) => (
              <span key={index} className={`${getLabelColor(label)} px-2 py-1 rounded`}>{label}</span>
            ))}
          </div>
          <div className="flex gap-1">
            <input
              type="text"
              value={newLabelInput}
              onChange={(e) => setNewLabelInput(e.target.value)}
              className="border p-2 rounded"
              placeholder="Nouveau label"
              disabled={!hasColumns}
            />
            <button
              onClick={() => {
                if (newLabelInput.trim()) {
                  setNewTask({
                    ...newTask,
                    labels: [...(newTask.labels || []), newLabelInput.trim()]
                  });
                  setNewLabelInput('');
                }
              }}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
              disabled={!hasColumns}
            >
              Ajouter
            </button>
          </div>
        </div>

        <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} className="border p-2 rounded" disabled={!hasColumns}>
          {teamMembers.map((member) => <option key={member.id} value={member.id}>{member.displayName}</option>)}
        </select>

        <select value={newTask.columnId} onChange={(e) => setNewTask({ ...newTask, columnId: e.target.value })} className="border p-2 rounded" disabled={!hasColumns}>
          {columns.map((col) => <option key={col.id} value={col.id}>{col.name}</option>)}
        </select>

        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" disabled={!hasColumns}>
          Ajouter tâche
        </button>

        <input value={newColumn} onChange={(e) => setNewColumn(e.target.value)} className="border p-2 rounded ml-4" placeholder="Nouvelle colonne" />
        <button onClick={handleAddColumn} className="bg-green-500 text-white px-4 py-2 rounded">Ajouter colonne</button>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 py-2">
        {columns.map((col) => (
          <div key={col.id} className="relative">
            <Column
              column={col}
              boardId={boardId}
              setColumns={setColumns}
              onTaskSelect={(task) => {
                setSelectedTask(task);
                setSelectedColumnId(col.id);
                setModalOpen(true);
              }}
            />
            <button
              onClick={() => handleDeleteColumn(col.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow"
              title="Supprimer colonne"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
