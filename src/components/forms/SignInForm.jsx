"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";

const SignInForm = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const router = useRouter();
    const [error, setError] = useState(null);
    const { saveUser } = useUser();  // Ahora usa saveUser para guardar el usuario en sessionStorage

    const onSubmit = async (data) => {
        setError(null); 
        try {
            const response = await axios.post("http://localhost:8080/auth/login", data, { withCredentials: true });
            if (response.status === 200) {
                const userResponse = await axios.get(`http://localhost:8080/api/users/username/${data.username}`, { withCredentials: true });
                saveUser(userResponse.data);  // Guardar usuario en contexto y sessionStorage
                
                router.push("/home");
            } else {
                setError("Username or password incorrect");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error logging in");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col gap-4"
        >
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    {...register("username", { required: "Username is required" })}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Sign In
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
    );
};

export default SignInForm;
