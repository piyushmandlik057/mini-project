"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function Home() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Top Priority");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);

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

    await supabase.from("tasks").insert({
      title,
      priority,
      deadline,
    });

    setTitle("");
    setDeadline("");
    fetchTasks();
  }

  async function completeTask(id) {
    await supabase.from("tasks").update({ completed: true }).eq("id", id);
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
    <div className="flex justify-center p-6">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-wide">
          🗂 Task Scheduler
        </h1>

        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 border">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Top Priority</option>
              <option>Medium Priority</option>
              <option>Low Priority</option>
            </select>

            <input
              type="date"
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition-all active:scale-95"
            >
              ➕ Add
            </button>
          </div>
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
                className="group flex justify-between items-center bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition"
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
                  className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-800 text-2xl transition"
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
                className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-inner text-gray-500"
              >
                <p className="line-through font-medium">{task.title}</p>
                <p className="text-xs mt-1">
                  {task.priority} • {task.deadline}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
