"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/supabase/supabaseClient";

const supabase = client;

export default function Home() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Top Priority");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setTasks(data || []);
  }

  async function addTask() {
    if (!title || !deadline) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to add tasks");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      title,
      priority,
      deadline,
      user_id: user.id,
    });

    if (!error) {
      setTitle("");
      setDeadline("");
      setError("");
      fetchTasks();
    }
  }

  async function completeTask(id) {
    await supabase.from("tasks").update({ completed: true }).eq("id", id);
    fetchTasks();
  }

  async function deleteTask(id) {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  }

  const upcoming = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  const priorityColor = (p) => {
    if (p === "Top Priority") return "bg-red-100 text-red-700";
    if (p === "Medium Priority") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-6 py-10
                    bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600">

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl
                      rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          🗂 Task Scheduler
        </h1>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 border">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 px-4 py-2 rounded-lg border
                         focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="px-4 py-2 rounded-lg border
                         focus:ring-2 focus:ring-rose-500 outline-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Top Priority</option>
              <option>Medium Priority</option>
              <option>Low Priority</option>
            </select>

            <input
              type="date"
              className="px-4 py-2 rounded-lg border
                         focus:ring-2 focus:ring-rose-500 outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-rose-600 hover:bg-rose-700 text-white
                         px-6 py-2 rounded-lg font-semibold
                         shadow-md hover:shadow-lg
                         transition-all active:scale-95"
            >
              ➕ Add
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 text-center">
              {error}
            </p>
          )}
        </div>

        {/* Upcoming Tasks */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            ⏳ Upcoming Tasks
          </h3>

          {upcoming.length === 0 && (
            <p className="text-gray-400">You're all caught up 🎉</p>
          )}

          <div className="space-y-3">
            {upcoming.map((task) => (
              <div
                key={task.id}
                className="group flex justify-between items-center
                           bg-white rounded-xl border p-4 shadow-sm
                           hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {task.title}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      📅 {task.deadline}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => completeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100
                             text-green-600 hover:text-green-800
                             text-2xl transition"
                >
                  ✔
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Completed Tasks */}
        <section>
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            ✅ Completed Tasks
          </h3>

          {completed.length === 0 && (
            <p className="text-gray-400">No completed tasks yet</p>
          )}

          <div className="space-y-3">
            {completed.map((task) => (
              <div
                key={task.id}
                className="group flex justify-between items-center
                           bg-green-50 rounded-xl border border-green-200
                           p-4 shadow-inner text-gray-500"
              >
                <div>
                  <p className="line-through font-medium">{task.title}</p>
                  <p className="text-xs mt-1">
                    {task.priority} • {task.deadline}
                  </p>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100
                             text-red-600 hover:text-red-800
                             hover:bg-red-100 px-3 py-1.5
                             rounded-lg text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
