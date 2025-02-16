"use client"

import { set, useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";
import { hasLowerCase, hasNoSpaces, hasNumber, hasUpperCase, hasSpecialChar } from "@/util/validators/validators";
import { useUser } from "@/context/UserContext";

const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [error, setError] = useState(null);
    const { setUser } = useUser();

    const toCapitalize = (text) => {
        return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    const onSubmit = async (data) => {
        try {
            const dataModified = {
                ...data, "imageUrl": null,
                "biography": null,
                "fullname": toCapitalize(data.fullname),
                "username": data.username.toLowerCase()
            };
            console.log(dataModified);
            const respuesta = await axios.post("http://localhost:8080/auth/register", dataModified, { withCredentials: true })

            if (respuesta.status === 200) {
                console.log("Usuario registrado correctamente");
                setUser(dataModified);
                router.push("/home");
            } else {
                setError("Error registering user");
            }
        } catch (error) {
            setError("Error registering user");
        }

    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col gap-4"
        >
            <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fullname
                </label>
                <input
                    id="fullname"
                    type="text"
                    {...register("fullname",
                        {
                            required: "Fullname is required",
                            minLength: { value: 4, message: "Fullname must have at least 4 characters" },
                            maxLength: { value: 200, message: "Fullname must have at most 200 characters" }
                        }
                    )}

                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
            </div>

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                </label>
                <input
                    id="username"
                    {...register("username",
                        {
                            required: "Username is required",
                            minLength: { value: 4, message: "Username must have at least 4 characters" },
                            maxLength: { value: 50, message: "Username must have at most 50 characters" },
                            validate: (value) => {
                                if (hasNoSpaces(value)) return true;
                                return "Username must not have spaces";
                            }
                        }
                    )}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email",
                        {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Invalid email"
                            }
                        }
                    )}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="cellphone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cellphone
                </label>
                <input
                    id="cellphone"
                    type="number"
                    {...register("cellphone",
                        {
                            required: "Cellphone is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Invalid cellphone"
                            }
                        }
                    )}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.cellphone && <p className="text-red-500 text-sm">{errors.cellphone.message}</p>}
            </div>

            <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Birthday
                </label>
                <input
                    id="birthday"
                    type="date"
                    {...register("birthday",
                        {
                            required: "Birthday is required",
                            validate: (value) => {
                                const date = new Date(value);
                                const now = new Date();
                                if (date > now) return "Birthday must be in the past";
                                if (now.getFullYear() - date.getFullYear() < 14) return "You must be at least 14 years old";
                                return true;
                            }
                        }
                    )}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday.message}</p>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password",
                        {
                            required: "Password is required",
                            minLength: { value: 8, message: "Password must have at least 8 characters" },
                            maxLength: { value: 12, message: "Password must have at most 20 characters" },
                            validate: (value) => {
                                if (!hasUpperCase(value)) return "Password must have at least one uppercase character";
                                if (!hasLowerCase(value)) return "Password must have at least one lowercase character";
                                if (!hasNumber(value)) return "Password must have at least one number";
                                if (!hasSpecialChar(value)) return "Password must have at least one special character";
                                if (!hasNoSpaces(value)) return "Password must not have spaces";
                                return true;
                            }
                        }
                    )}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Sign Up
            </button>
        </form>

    );
}

export default SignUpForm;
