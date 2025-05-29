"use client";

import { authPelajar } from "@/lib/actions/pelajar";
import { authTutor } from "@/lib/actions/tutor";
import { authAdmin } from "@/lib/actions/admin";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";

const LoginForm = ({ role }: { role: string }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let authenticate;

  if (role === "Pelajar") {
    authenticate = authPelajar;
  } else if (role === "Tutor") {
    authenticate = authTutor;
  } else if (role === "Admin") {
    authenticate = authAdmin;
  } else {
    throw new Error("Invalid role");
  }
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200 text-white py-2 px-4 rounded-xl shadow-md font-semibold tracking-wide focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
      >
        {pending ? "Loading..." : "Login"}
      </button>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-emerald-50 to-white">
      <div className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-xl border border-amber-100">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-bold text-emerald-500 text-center mb-2 drop-shadow-sm">
            Login {role}
          </h2>
        </div>

        <form action={dispatch} className="space-y-5">
          {/* Input Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-emerald-500 mb-1"
            >
              Username {role === "Pelajar" && "(NIPD)"}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-emerald-200 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900 outline-none bg-white transition"
              placeholder={
                "Masukkan Username" + (role === "Pelajar" ? " (NIPD)" : "")
              }
              autoComplete="username"
            />
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-emerald-500 mb-1"
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
              className="mt-1 block w-full px-4 py-2 border border-emerald-200 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-gray-900 outline-none bg-white transition"
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm text-center font-medium">
              {errorMessage}
            </div>
          )}

          <div className="text-center space-y-2">
            <SubmitButton />
            <Link
              href={"/login"}
              className="inline-block text-sm font-semibold text-emerald-500 hover:text-amber-600 underline transition-colors duration-150 mt-2"
            >
              Kembali ke Pilihan Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
