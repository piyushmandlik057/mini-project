"use client";

import { useState } from "react";
import { client } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const supabase = client;

  async function handleSignIn() {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setMessage(`❌ ${error.message}`);
    setMessage("✅ Login successful");
    router.push("/dashboard");
  }

  async function handleSignUp() {
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return setMessage(`❌ ${error.message}`);
    setMessage("✅ Check your email to verify your account");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center
                    bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600
                    overflow-hidden px-4">

      {/* Subtle Background Shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight
                       flex items-center justify-center gap-3">
          <span className="text-4xl">🗂</span>
          <span>Task Scheduler</span>
        </h1>

        <p className="mt-4 text-white/90 text-base max-w-md mx-auto">
          Organize your tasks and stay productive
        </p>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md
                      bg-white/95 backdrop-blur-xl
                      rounded-3xl shadow-2xl
                      p-8 transition-all duration-300
                      hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">

        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-1">
          Welcome
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to continue
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 tracking-widest">
            SECURE LOGIN
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300
                     focus:ring-2 focus:ring-rose-500 focus:border-rose-500
                     outline-none transition text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-300
                     focus:ring-2 focus:ring-rose-500 focus:border-rose-500
                     outline-none transition text-black"
        />

        <button
          onClick={handleSignIn}
          className="w-full py-3 rounded-xl
                     bg-gradient-to-r from-rose-600 to-pink-600
                     hover:from-rose-700 hover:to-pink-700
                     text-white font-semibold
                     shadow-md hover:shadow-lg
                     transition-all"
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="w-full py-3 mt-3 rounded-xl
                     border border-rose-600 text-rose-600
                     hover:bg-rose-50 font-semibold transition"
        >
          Create Account
        </button>

        {message && (
          <div
            className={`mt-6 p-3 rounded-xl text-center text-sm font-medium ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
