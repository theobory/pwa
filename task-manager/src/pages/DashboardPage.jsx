import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard, joinBoard } from "../services/boardsService";
import { db, ref, onValue } from "../services/firebase";
import { get as getFromDb } from "firebase/database";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/NavbarComponent";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [boards, setBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [copiedBoardId, setCopiedBoardId] = useState(null);

  useEffect(() => {
    const boardsRef = ref(db, "boards");
    const unsubscribe = onValue(boardsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const boardsArray = Object.values(data).filter(
          (b) => b.owner === user.uid || b.members?.includes(user.uid)
        );

        const enrichedBoards = await Promise.all(
          boardsArray.map(async (board) => {
            const columnsSnap = await getFromDb(ref(db, `columns/${board.id}`));
            const columns = columnsSnap.val() || {};
            const columnsCount = Object.keys(columns).length;

            let tasksCount = 0;
            Object.values(columns).forEach((col) => {
              tasksCount += col.tasks ? Object.keys(col.tasks).length : 0;
            });

            let ownerName = "Inconnu";
            try {
              const userSnap = await getFromDb(ref(db, `users/${board.owner}/displayName`));
              ownerName = userSnap.exists() ? userSnap.val() : "Inconnu";
            } catch (err) {
              console.error("Erreur pour récupérer le pseudo:", err);
            }

            return {
              ...board,
              columnsCount,
              tasksCount,
              ownerName,
            };
          })
        );

        setBoards(enrichedBoards);
      } else {
        setBoards([]);
      }
    });
    return () => unsubscribe();
  }, [user.uid]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    await createBoard(boardName);
    setBoardName("");
  };

  const handleJoinBoard = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const joinedBoard = await joinBoard(joinCode);
    navigate(`/board/${joinedBoard.boardId}`);
  };

  const handleCopyCode = (code, boardId) => {
    navigator.clipboard.writeText(code);
    setCopiedBoardId(boardId);
    setTimeout(() => setCopiedBoardId(null), 2000);
  };

  const filteredBoards = boards
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "tasks") return b.tasksCount - a.tasksCount;
      if (sort === "date") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Mes Boards</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="name-asc">Nom ↑</option>
              <option value="name-desc">Nom ↓</option>
              <option value="tasks">Tâches ↓</option>
              <option value="date">Date ↓</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredBoards.map((board) => (
            <div
              key={board.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{board.name}</h2>
                <span className="text-gray-500 text-sm">
                  📅 {new Date(board.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mb-1">👤 Owner: {board.ownerName}</p>
              <p className="text-gray-600 mb-1">📂 Colonnes: {board.columnsCount}</p>
              <p className="text-gray-600 mb-3">📝 Tâches: {board.tasksCount}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/board/${board.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Ouvrir
                </button>
                <button
                  onClick={() => handleCopyCode(board.code, board.id)}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  {copiedBoardId === board.id ? "✅ Copié !" : "Copier le code"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <form onSubmit={handleCreateBoard} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Créer un Board</h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Nom du board"
              className="border w-full px-3 py-2 rounded mb-2"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Créer
            </button>
          </form>

          <form onSubmit={handleJoinBoard} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Rejoindre un Board</h2>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Code du board"
              className="border w-full px-3 py-2 rounded mb-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Rejoindre
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
