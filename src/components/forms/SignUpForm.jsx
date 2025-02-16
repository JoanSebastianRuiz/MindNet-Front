"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { hasLowerCase, hasNoSpaces, hasNumber, hasUpperCase, hasSpecialChar } from "@/util/validators/validators";
import { useUser } from "@/context/UserContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const router = useRouter();
    const [error, setError] = useState(null);
    const { saveUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toCapitalize = (text) => text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

    const onSubmit = async (data) => {
        setError(null); 
        try {
            const { confirmPassword, ...dataWithoutConfirmPassword } = data;
            const userData = {
                ...dataWithoutConfirmPassword,
                imageUrl: null,
                biography: null,
                fullname: toCapitalize(data.fullname),
                username: data.username.toLowerCase()
            };

            const response = await axios.post("http://localhost:8080/auth/register", userData, { withCredentials: true });

            if (response.status === 200) {
                console.log("Usuario registrado correctamente");
                saveUser(userData);
                router.push("/home");
            } else {
                setError("Error registering user");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error registering user");
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

            {/* Password */}
            <div className="relative">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "At least 8 characters" },
                            maxLength: { value: 20, message: "At most 20 characters" },
                            validate: (value) => {
                                if (!hasUpperCase(value)) return "Must have an uppercase letter";
                                if (!hasLowerCase(value)) return "Must have a lowercase letter";
                                if (!hasNumber(value)) return "Must have a number";
                                if (!hasSpecialChar(value)) return "Must have a special character";
                                if (!hasNoSpaces(value)) return "Must not contain spaces";
                                return true;
                            },
                        })}
                        className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === watch("password") || "Passwords do not match",
                        })}
                        className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
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
