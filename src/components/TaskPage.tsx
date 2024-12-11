"use client";

import { useState, useEffect } from "react";
import Link  from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Task {
  id: number;
  useremail: string;
  title: string;
  description: string;
}

interface TaskPageProps {
  initialUserEmail: string;
}

const TaskPage = ({ initialUserEmail }: TaskPageProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [id_task, setId_task] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) {
      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useremail: initialUserEmail,
          title,
          description,
        }),
      });
      const data = await response.json();
      //console.log(data);
      setTitle("");
      setDescription("");
    } else {
      const response = await fetch(`/api/tasks/${id_task}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useremail: initialUserEmail,
          title,
          description,
        }),
      });
      const data = await response.json();
      console.log(data);
      setEditing(false);
      setId_task("");
      setTitle("");
      setDescription("");
    }

    await getTasks();
  };

  const getTasks = async () => {
    if (!initialUserEmail) return;
    const response = await fetch(`/api/task/${initialUserEmail}`);
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, [initialUserEmail]);

  const deleteTask = async (id_task: number) => {
    const response = await fetch(`/api/tasks/${id_task}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    await getTasks();
  };

  const editTask = async (id_task: number, useremail: string) => {
    const response = await fetch(`/api/tasks/${id_task}/${useremail}`);
    const data = await response.json();
    //console.log(data);

    if (data.length > 0) {
      const task = data[0];
      const id = task.id?.toString() || '';
      const taskTitle = task.title || '';

      setEditing(true);
      setId_task(id);
      setTitle(taskTitle);
      setDescription(task.description || '');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 mt-16 rounded-xl">
      <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-4 sm:mb-8">
        Tasks from {initialUserEmail}
      </h2>
      <div className="mb-4">
        <Link className={buttonVariants()} href="/same">Same Task</Link>
      </div>
      
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200">Title</h3>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Add a title"
              className="w-full mt-1 px-3 sm:px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          </div>
  
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200">Description</h3>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Add a description"
              className="w-full mt-1 px-3 sm:px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
  
          <button
            className={`w-full py-2 px-4 rounded-md text-white ${
              editing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
  
        {editing && (
          <button
            onClick={cancelEdit}
            className="w-full mt-4 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            Cancel Edit
          </button>
        )}
  
        <div className="mt-8">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="md:hidden">
                {/* Vista móvil: cards en lugar de tabla */}
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">TITLE</span>
                      <p className="text-gray-700 dark:text-gray-200">{task.title}</p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">DESCRIPTION</span>
                      <p className="text-gray-700 dark:text-gray-200">{task.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editTask(task.id, task.useremail)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Vista desktop: tabla */}
              <table className="hidden md:table min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                        {task.title}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                        {task.description}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => editTask(task.id, task.useremail)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;