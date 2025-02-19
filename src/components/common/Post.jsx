"use client"

import { Heart, MessageCircle, UserIcon, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Comment from "@/components/common/Comment";
import ReactModal from "react-modal";
import PostEditForm from "@/components/modals/PostEditForm";
import CommentForm from "@/components/forms/CommentForm";
import { useRouter } from "next/navigation";
import HighlightText from "@/components/common/HighlightText";

const Post = ({ post, fetchPosts, refreshUser, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const deleteHandle = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, {
        withCredentials: true,
      });
      if (fetchPosts) {
        fetchPosts();
      }
      if (refreshUser) {
        refreshUser();
      }

      console.log("Post eliminado correctamente");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIsLiked = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${post.id}/is-liked`, {
        params: { idUser: user.id },
        withCredentials: true,
      });
      setIsLiked(response.data);
    } catch (error) {
      console.error("Error al obtener el estado de like:", error);
    }
  };

  const handleLike = async () => {
    if (!user || !user.id) {
      console.log("Usuario no autenticado");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${post.id}/like`,
        { idUser: user.id },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Actualizar likesCount basado en el estado anterior de isLiked
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked); // Cambiar el estado de like
        post.likesCount = newIsLiked ? post.likesCount + 1 : post.likesCount - 1;
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchIsLiked();
    }
  }, [user]);

  if (!user) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg space-y-5 max-w-lg w-full mx-auto border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        {post.imageUrlUser ? (
          <img
            src={post.imageUrlUser}
            alt="Profile"
            className="w-12 h-12 aspect-square rounded-full object-cover border border-gray-300 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 aspect-square flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 dark:bg-gray-700 shadow-sm">
            <UserIcon className="w-2/3 h-2/3 text-gray-400" />
          </div>
        )}
        <div>
          <button
            onClick={() => router.push(`/profile/${post.username}`)}>
            <h1 className="text-lg font-semibold">{post.fullname}</h1>
          </button>
          <p className="text-sm text-gray-500">@{post.username}</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-wrap-anywhere">
        {<HighlightText text={post.body} mentionedUsers={post.mentionedUsers} />}
      </p>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(post.datetime).toLocaleString('en-GB', {
                    year: 'numeric', month: 'short', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false
                })}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 mt-3">
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
          onClick={handleLike}>
          <Heart className={`w-5 h-5 ${isLiked ? "text-red-500" : ""}`} />
          <span>{post.likesCount > 0 ? `${post.likesCount}` : ""}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments.length > 0 ? `${post.comments.length}` : ""}</span>
        </button>

        {/* Edit and Delete Buttons */}
        {user && user.id === post.idUser && (
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={deleteHandle}
              className="text-red-500 hover:text-red-600 transition-colors font-medium"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>



      <div className="flex justify-between">
        {/* Button to toggle comment form */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-500 hover:text-blue-600 transition-colors mt-4"
        >
          {showForm ? "Hide Reply" : "Reply"}
        </button>


        {/* Button to toggle comments visibility */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-500 hover:text-blue-600 transition-colors mt-4"
          >
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>
        )}

      </div>

      {showForm && <CommentForm post={post} fetchPosts={fetchPosts} />}

      {/* Comments Section */}
      {showComments && post.comments && post.comments.length > 0 && (
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {post.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
        className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-xl w-[90%] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto transform transition-all duration-300 ease-out scale-100 border border-gray-300 dark:border-gray-700"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-out"
      >
        <PostEditForm post={post} setIsOpen={setIsOpen} fetchPosts={fetchPosts} refreshUser={refreshUser} />
      </ReactModal>

    </div>
  );
};

export default Post;
