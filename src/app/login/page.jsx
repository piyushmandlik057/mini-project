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
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8
                      transition-all duration-300 hover:-translate-y-1">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Welcome
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Login to continue
        </p>

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
          className="w-full py-3 rounded-xl bg-rose-600
                     hover:bg-rose-700 text-white font-semibold
                     shadow-lg hover:shadow-xl transition-all"
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
