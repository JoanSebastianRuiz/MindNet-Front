"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import axios from "axios";
import { isValidImageUrl, hasNoSpaces, isImageUrlAccessible } from "@/util/validators/validators";

const ProfileEditForm = ({ user, refreshUser, setIsOpenEditProfile }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const toCapitalize = (text) => {
        return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    const onSubmit = async (data) => {
        try {
            const dataModified = {
                ...data,
                "fullname": toCapitalize(data.fullname)
            };
            const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, dataModified, { withCredentials: true });
            if (response.status === 200) {
                setError(null);
                setSuccess(response.data);
                refreshUser();
                setIsOpenEditProfile(false);
            } else {
                setSuccess(null);
                setError(response.data);
            }
        } catch (error) {
            setSuccess(null);
            setError(response.data);
            console.log("Error updating user");
        }
    };

    useEffect(() => {
        setValue("fullname", user.fullname);
        setValue("biography", user.biography);
        setValue("imageUrl", user.imageUrl);
        setValue("email", user.email);
        setValue("cellphone", user.cellphone);
        setValue("birthday", user.birthday);
    }, [user]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl flex flex-col gap-5"
        >
            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
                Edit Profile
            </h2>

            {/* Mensajes de éxito/error */}
            {success && <p className="text-green-500 text-sm text-center bg-green-100 dark:bg-green-900 py-2 rounded-md">{success}</p>}
            {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900 py-2 rounded-md">{error}</p>}

            {/* Fullname */}
            <div className="flex flex-col gap-1">
                <label htmlFor="fullname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fullname
                </label>
                <input
                    id="fullname"
                    type="text"
                    {...register("fullname", {
                        required: "Fullname is required",
                        minLength: { value: 4, message: "At least 4 characters" },
                        maxLength: { value: 200, message: "At most 200 characters" },
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                />
                {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>}
            </div>


            {/* Biography */}
            <div className="flex flex-col gap-1">
                <label htmlFor="biography" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Biography
                </label>
                <textarea
                    id="biography"
                    rows={3}
                    {...register("biography", {
                        minLength: { value: 4, message: "At least 4 characters" },
                        maxLength: { value: 500, message: "At most 500 characters" },
                    })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Write something about yourself..."
                />
                {errors.biography && <p className="text-red-500 text-xs mt-1">{errors.biography.message}</p>}
            </div>

            {/* Profile Image URL */}

            <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Image URL
            </label>
            <input
                type="url"
                id="imageUrl"
                placeholder="Paste an image URL (optional)"
                {...register("imageUrl", {
                    validate: (value) => {
                        if (!value) return true;
                        if (!isValidImageUrl(value)) return "Invalid image URL";
                        if (!isImageUrlAccessible(value)) return "Image URL is not accessible";
                        return true;
                    },
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}

            {/* Vista previa de la imagen si la URL es válida */}
            {watch("imageUrl") && isValidImageUrl(watch("imageUrl")) && isImageUrlAccessible(watch("imageUrl")) && (
                <img
                    src={watch("imageUrl")}
                    alt="Profile Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg shadow-md border border-gray-300 dark:border-gray-600"
                />
            )}


            {/* Email */}
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email",
                        },
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Cellphone */}
            <div className="flex flex-col gap-1">
                <label htmlFor="cellphone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cellphone
                </label>
                <input
                    id="cellphone"
                    type="tel"
                    maxLength={10}
                    placeholder="Enter your cellphone number"
                    {...register("cellphone", {
                        required: "Cellphone is required",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Invalid cellphone number",
                        },
                    })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                />
                {errors.cellphone && <p className="text-red-500 text-xs mt-1">{errors.cellphone.message}</p>}
            </div>

            {/* Birthday */}
            <div className="flex flex-col gap-1">
                <label htmlFor="birthday" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Birthday
                </label>
                <input
                    id="birthday"
                    type="date"
                    {...register("birthday", {
                        required: "Birthday is required",
                        validate: (value) => {
                            const date = new Date(value);
                            const now = new Date();
                            if (date > now) return "Birthday must be in the past";
                            if (now.getFullYear() - date.getFullYear() < 14) return "You must be at least 14 years old";
                            return true;
                        },
                    })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                />
                {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday.message}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all dark:bg-blue-500 dark:hover:bg-blue-600 flex justify-center items-center"
            >
                {isSubmitting ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                    "Update"
                )}
            </button>

        </form >

    );
}

export default ProfileEditForm;
