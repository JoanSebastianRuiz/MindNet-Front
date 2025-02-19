import { UserIcon } from "lucide-react";
import HighlightText from "@/components/common/HighlightText"

const Comment = ({ comment }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2">

            {/* Sección superior con avatar y nombre */}
            <div className="flex items-center gap-3">
                {comment.imageUrlUser ? (
                    <img
                        src={comment.imageUrlUser}
                        alt={comment.username}
                        className="w-12 h-12 aspect-square rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                ) : (
                    <div className="w-12 h-12 aspect-square flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
                        <UserIcon size={32} className="text-gray-500 dark:text-gray-400" />
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">{comment.fullname}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{comment.username}</p>
                </div>
            </div>

            {/* Contenido del comentario */}
            <p className="text-gray-700 dark:text-gray-300 text-sm break-words overflow-hidden leading-relaxed">
                {<HighlightText text={comment.body} mentionedUsers={comment.mentionedUsers} />}
            </p>

            {/* Fecha del comentario */}
            <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(comment.datetime).toLocaleString('en-GB', {
                    year: 'numeric', month: 'short', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false
                })}
            </p>

        </div>

    );
};

export default Comment;
