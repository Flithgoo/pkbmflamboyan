"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

export default function LoginTutor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set loading menjadi true saat login mulai
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Set loading menjadi false setelah proses login selesai
    setLoading(false);

    if (error) {
      alert("Login gagal: " + error.message);
      return;
    }

    const { user } = data;
    if (user) {
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        role: "tutor",
      });
    }

    // Redirect ke dashboard setelah login berhasil
    // router.push("/LMS/tutor");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login Tutor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input username */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block text-slate-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan Email"
            />
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block text-slate-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan password"
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
