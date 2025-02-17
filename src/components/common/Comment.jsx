import { UserIcon } from "lucide-react";
import highlightTags from "@/util/text/highlightTags";

const Comment = ({ comment }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
                {comment.imageUrlUser ? (
                    <img
                        src={comment.imageUrlUser}
                        alt={comment.username}
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                ) : (
                    <UserIcon size={40} className="text-gray-500 dark:text-gray-400" />
                )}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">{comment.fullname}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{comment.username}</p>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm break-words overflow-hidden">
                {highlightTags(comment.body)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(comment.datetime).toLocaleString('en-GB', {
                    year: 'numeric', month: '2-digit', day: '2-digit', 
                    hour: '2-digit', minute: '2-digit', hour12: false
                })}
            </p>
        </div>
    );
};

export default Comment;
