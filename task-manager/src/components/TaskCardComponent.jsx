import { useState } from "react";
import TaskModal, { getLabelColor } from "./TaskModalComponent";
import { useTeamMembers } from "../hooks/useTeamMembers";

export default function TaskCard({ task, boardId, columnId, onClick }) {
  const { teamMembers } = useTeamMembers(boardId);
  console.log("task", task);

  return (
    <div
      className="bg-gray-100 rounded shadow-lg flex flex-col justify-between cursor-pointer hover:bg-gray-200 hover:shadow-lg transition-all duration-300 min-h-[130px]"
      onClick={() => {
        if (onClick) {
          onClick(task); // ← on délègue au parent
        }
      }}
    >
      <div className="flex flex-col bg-gray-200 rounded-t-lg items-center">
        <div className="font-bold">{task.title}</div>
      </div>
      <div className="flex flex-col bg-cyan-100 rounded-b-lg px-2 justify-between items-center flex-grow py-2">
        <div className="text-base text-gray-500">{task.dueDate}</div>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const maxRowLength = 20;
            let currentRow = [];
            let rows = [];
            let currentLength = 0;

            (task.labels || []).forEach((label, index) => {
              console.log("showing label", label);
              if (currentLength + label.length > maxRowLength) {
                rows.push(currentRow);
                currentRow = [];
                currentLength = 0;
              }
              currentRow.push(
                <div key={`${label}-${index}`} className={`${getLabelColor(label)} px-3 py-1 rounded shadow-sm`}>
                  {label}
                </div>
              );
              currentLength += label.length;
            });

            if (currentRow.length > 0) {
              rows.push(currentRow);
            }

            return rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-2">
                {row}
              </div>
            ));
          })()}
        </div>
        <div className="text-base text-gray-500">
          {teamMembers.find((member) => member.id === task.assignee)?.displayName || ""}
        </div>
      </div>
    </div>
  );
}
