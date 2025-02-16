import { User } from "lucide-react";

const ListUsers = ({ users }) => {
    return (
        <div className="space-y-4 p-4">
            {users.length > 0 ? (
                users.map((user) => (
                    <div
                        key={user._id}
                        className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700
                        hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    >
                        {user.imageUrl ? (
                            <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover"
                            />
                        ) : (
                            <div className="w-14 h-14 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full border border-gray-300 dark:border-gray-600">
                                <User className="w-7 h-7" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{user.fullname}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-center">No users available</p>
            )}
        </div>
    );
};

export default ListUsers;
