"use client";

import SignInForm from "@/components/forms/SignInForm";
import SignUpForm from "@/components/forms/SignUpForm";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Brain } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [signIn, setSignIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) return; // No hay token, se queda en la página de login

    const validateToken = async () => {
      try {
        const response = await axios.post("http://localhost:8080/auth/validate-token", null, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          router.push("/home"); // Token válido, redirigir a home
        } else {
          Cookies.remove("token"); // Token inválido, eliminar cookie
        }
      } catch (error) {
        Cookies.remove("token"); // Error al validar, eliminar cookie
      }
    };

    validateToken();
  }, [router]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors py-7">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Brain className="w-10 h-10 mr-3 text-blue-500 animate-pulse" /> MindNet
      </h1>

      <section className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-300 dark:border-gray-700">
        <div className="flex justify-center gap-3 mb-5">
          <button
            onClick={() => setSignIn(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${signIn ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setSignIn(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${!signIn ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            Sign up
          </button>
        </div>

        {signIn ? <SignInForm /> : <SignUpForm />}
      </section>

      <footer className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        © 2025 MindNet. All rights reserved.
      </footer>
    </div>
  );
}
