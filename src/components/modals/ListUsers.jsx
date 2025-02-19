import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const ListUsers = ({ users }) => {
    const router = useRouter();
    const { user: currentUser } = useUser();

    return (
        <div className="p-4">
            {users.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {users.map((user) => (
                        <button
                            key={user.username}
                            onClick={() => router.push(`/profile/${user.username}`)}
                            className={`flex items-center gap-4 p-4 w-full rounded-lg border border-gray-300 dark:border-gray-700 
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-md group 
          ${user.username === currentUser.username ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                        >
                            {/* Imagen de perfil */}
                            {user.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt="Profile"
                                    className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 flex items-center justify-center bg-gray-200 dark:bg-gray-700 
            text-gray-500 dark:text-gray-400 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0">
                                    <User className="w-8 h-8" />
                                </div>
                            )}

                            {/* Información del usuario */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                    {user.fullname}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">@{user.username}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-center">No users available</p>
            )}
        </div>

    );
};

export default ListUsers;
