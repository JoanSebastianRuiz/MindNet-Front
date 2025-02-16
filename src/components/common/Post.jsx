"use client";

import { Heart, MessageCircle, UserIcon, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Comment from "@/components/common/Comment";
import { useUser } from "@/context/UserContext";
import ReactModal from "react-modal";
import PostEditForm from "@/components/modals/PostEditForm";
import CommentForm from "@/components/forms/CommentForm";

const Post = ({ post }) => {
  const [comments, setComments] = useState(null);
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/comments/post/${post.id}`,
          { withCredentials: true }
        );
        setComments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, []);

  const deleteHandle = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, {
        withCredentials: true,
      });
      console.log("Post eliminado correctamente");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg space-y-5 max-w-lg w-full mx-auto border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        {post.imageUrlUser ? (
          <img
            src={post.imageUrlUser}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        ) : (
          <UserIcon className="w-12 h-12 text-gray-400 bg-gray-200 rounded-full p-2" />
        )}
        <div>
          <h1 className="text-lg font-semibold">{post.fullname}</h1>
          <p className="text-sm text-gray-500">@{post.username}</p>
        </div>
      </div>

      {/* Post Content con palabras que no se salen del contenedor */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-wrap-anywhere">
        {post.body}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(post.datetime).toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 mt-3">
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
          <Heart className="w-5 h-5" />
          <span>{post.likesCount > 0 ? `${post.likesCount} likes` : "Like"}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{post.commentsCount > 0 ? `${post.commentsCount} comments` : "Comment"}</span>
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
      <CommentForm post={post} />

      {/* Edit Modal */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100 border border-gray-300 dark:border-gray-700"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
      >
        <PostEditForm post={post} setIsOpen={setIsOpen} />
      </ReactModal>

      {/* Comments Section */}
      {comments && comments.length > 0 && (
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
