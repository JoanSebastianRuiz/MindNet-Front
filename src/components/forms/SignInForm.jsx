"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";


const SignInForm = () => {
    const { register, handleSubmit, formState:{errors}, watch } = useForm();
    const router = useRouter();
    const [error, setError] = useState(null);
    const { setUser } = useUser();

    const onSubmit = async (data) => {
        try {
            const respuesta = await axios.post("http://localhost:8080/auth/login", data, {withCredentials: true});
            if (respuesta.status === 200) {
                const user = await axios.get(`http://localhost:8080/api/users/username/${data.username}`, {withCredentials: true});
                setUser(user.data);
                console.log(user.data);
                
                router.push("/home");
            } else {
                setError("Username or password incorrect");
            }

        } catch (error) {
            setError("Error logging in");
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
                    {...register("username")}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Sign In
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

    );
};

export default SignInForm;
