import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const ListUsers = ({ users }) => {
    const router = useRouter();
    const { user: currentUser } = useUser();

    return (
        <div className="space-y-4 p-4">
            {users.length > 0 ? (
                users.map((user) => (
                    <button
                        key={user.username}
                        onClick={() => router.push(`/profile/${user.username}`)}
                        className={`flex items-center gap-4 p-4 w-full min-w-[250px] rounded-lg border border-gray-300 dark:border-gray-700 
                        hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-md
                        ${user.username === currentUser.username ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                    >
                        {user.imageUrl ? (
                            <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 
                            text-gray-500 dark:text-gray-400 rounded-full border border-gray-300 dark:border-gray-600">
                                <User className="w-8 h-8" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{user.fullname}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</p>
                        </div>
                    </button>
                ))
            ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-center">No users available</p>
            )}
        </div>
    );
};

export default ListUsers;
