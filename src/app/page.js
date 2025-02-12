"use client";

import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { useState } from "react";

export default function Login() {
  const [signIn, setSignIn] = useState(true);

  return (
    <>
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
    <h1 className="text-3xl font-bold mb-4">MindNet</h1>
    
    <section className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <nav className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setSignIn(true)}
          className={`px-4 py-2 rounded-md transition ${
            signIn
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setSignIn(false)}
          className={`px-4 py-2 rounded-md transition ${
            !signIn
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Sign up
        </button>
      </nav>

      {signIn ? <SignInForm /> : <SignUpForm />}
    </section>
  </div>
</>
  );
}
