"use client"

import { useForm } from "react-hook-form";
import { isValidImageUrl, isImageUrlAccessible } from "@/util/validators/validators";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import ProgressCharacterBar from "@/components/common/ProgressCharacterBar";

const PostForm = ({fetchPosts}) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const { user } = useUser();
    const [characters, setCharacters] = useState(0);
    const maxLength = 500;

    useEffect(() => {
        setCharacters(watch("body")?.length || 0);
    }, [watch("body")]);

    const onSubmit = async (data) => {
        const now = new Date();
        const dataModified = {
            ...data,
            imageUrl: data.imageUrl || null,
            user: { id: user.id },
            datetime: now.toISOString()
        };

        try {
            const response = await axios.post("http://localhost:8080/api/posts", dataModified, { withCredentials: true });
            if (response.status === 200) {
                console.log("Post created successfully");
                fetchPosts();
                reset();
            } else {
                console.log("Error creating post else");
            }
        } catch (error) {
            console.log("Error creating post");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-xl shadow-md space-y-3 max-w-md mx-auto"
        >
            
            <textarea
                {...register("body", {
                    required: "Post is required",
                    maxLength: { value: 500, message: "Max 500 characters" },
                    minLength: { value: 5, message: "At least 5 characters" }
                })}
                className="w-full h-24 p-2 resize-none border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                placeholder="What's on your mind?"
            />
            <ProgressCharacterBar characters={characters} maxLength={maxLength} />
            {errors.body && <p className="text-red-500 text-xs">{errors.body.message}</p>}

            <input
                type="url"
                placeholder="Image URL (optional)"
                {...register("imageUrl", {
                    validate: (value) => {
                        if (!value) return true;
                        if (!isValidImageUrl(value)) return "Invalid image URL";
                        if (!isImageUrlAccessible(value)) return "Image not accessible";
                        return true;
                    }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
            />
            {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}

            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
                Post
            </button>
        </form>
    );
};

export default PostForm;
