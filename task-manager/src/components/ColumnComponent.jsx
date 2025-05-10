import TaskCard from "./TaskCardComponent";

export default function Column({ column, boardId, setColumns, onTaskSelect }) {
  const tasks = Array.isArray(column.tasks)
    ? column.tasks
    : Object.values(column.tasks || {});

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 min-w-[250px]">
      <div className="font-semibold mb-2 text-indigo-700">{column.name}</div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            boardId={boardId}
            columnId={column.id}
            onClick={() => onTaskSelect(task)}
          />
        ))}
      </div>
    </div>
  );
}
