import { useState, useMemo } from "react";
import TrashIcons from "../icons/TrashIcons";
import { Column, Id, Task } from "../type";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: String) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-2 "
      ></div>
    );
  }

  return (
    <div
      className="w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-2 "
      ref={setNodeRef}
      style={style}
    >
      <div
        className="text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-2 border-gray-400 flex justify-between items-center"
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
      >
        <div className="flex gap-4">
          <div className="flex justify-center items-center px-2 py-1 text-sm rounded-full">
            0
          </div>
          <h4>
            {!editMode && column.title}
            {editMode && (
              <input
                value={column.title}
                onChange={(e) => updateColumn(column.id, e.target.value)}
                className="border px-2 py-1"
                autoFocus
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
              />
            )}
          </h4>
        </div>
        <button onClick={() => deleteColumn(column.id)}>
          <TrashIcons />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>
      <button
        className="flex items-center gap-2 hover:bg-indigo-600 hover:text-white active:bg-black border-2 rounded-md p-4"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}
