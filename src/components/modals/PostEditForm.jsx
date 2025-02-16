"use client";

import { useForm } from "react-hook-form";
import { isValidImageUrl, isImageUrlAccessible } from "@/util/validators/validators";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

const PostEditForm = ({ post, setIsOpen }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm();
  const { user } = useUser();
  const { id, body, imageUrl } = post;

  useEffect(() => {
    setValue("body", body);
    setValue("imageUrl", imageUrl);
  }, [post, setValue]);

  const onSubmit = async (data) => {
    const dataModified = {
      ...data,
      imageUrl: data.imageUrl || null,
      user: { id: user.id },
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/posts/${id}`, dataModified, { withCredentials: true });
      if (response.status === 200) {
        console.log("Post updated successfully");
        reset();
        setIsOpen(false);
      } else {
        console.log("Error updating post");
      }
    } catch (error) {
      console.log("Error updating post");
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
      {/* Botón de cerrar */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
      >
        <CircleX className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-4">
        Edit Post
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Área de texto */}
        <textarea
          {...register("body", {
            required: "Post is required",
            maxLength: { value: 500, message: "Max 500 characters" },
            minLength: { value: 5, message: "At least 5 characters" }
          })}
          className="w-full h-28 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="What's on your mind?"
        />
        {errors.body && <p className="text-red-500 text-xs">{errors.body.message}</p>}

        {/* Input de URL de imagen */}
        <input
          type="url"
          placeholder="Image URL (optional)"
          {...register("imageUrl", {
            required: "Image URL is required",
            validate: (value) => {
              if (!isValidImageUrl(value)) {
                return "Invalid URL";
              }
              if (!isImageUrlAccessible(value)) {
                return "Image is not accessible";
              }
              return true;
            }

          })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}

        {/* Botón de actualizar */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default PostEditForm;
