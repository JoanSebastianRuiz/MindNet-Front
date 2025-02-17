"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import ProgressCharacterBar from "@/components/common/ProgressCharacterBar";

const CommentForm = ({ post, fetchPosts }) => {
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
    const { username, id } = post;
    const [characters, setCharacters] = useState(0);
    const maxLength = 200;

    const onSubmit = async (data) => {
        try {
            const now = new Date();
            const dataModified = {
                ...data,
                idPost: id,
                username: username,
                datetime: now.toISOString()
            };
            const response = await axios.post("http://localhost:8080/api/comments", dataModified, { withCredentials: true });
            if (response.status === 200) {
                console.log(response.data);
                fetchPosts();
                reset();
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.log("Error creating comment");
        }
    };

    useEffect(() => {
        setCharacters(watch("body")?.length || 0);
    }, [watch("body")]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-5 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl space-y-3">

            {/* Textarea */}
            <div className="relative">
                <textarea
                    {...register("body", {
                        required: "Comment is required",
                        minLength: { value: 3, message: "At least 3 characters required" },
                        maxLength: { value: maxLength, message: "Maximum 200 characters allowed" }
                    })}
                    className="w-full h-24 p-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    placeholder="Write a comment..."
                ></textarea>
                <ProgressCharacterBar characters={characters} maxLength={maxLength} />
            </div>
            {/* Mensajes de error */}
            {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}

            {/* Botón de envío */}
            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-semibold tracking-wide transition-all duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700 disabled:bg-gray-400"
                disabled={characters === 0 || characters > maxLength}
            >
                Comment
            </button>
        </form>
    );
};

export default CommentForm;
