"use client"

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "@/components/containers/Container";
import { useRouter } from "next/navigation";
import { UserPlus, ThumbsUp, MessageSquare, AtSign } from "lucide-react";

const NotificationPage = () => {
    const { user, setNotificationsCount } = useUser();
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`, {
                withCredentials: true,
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleChangeSeen = async (notification) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/markseen/${notification.id}`, {}, {
                withCredentials: true,
            });
            fetchNotifications();
            setNotificationsCount((prevCount) => prevCount - 1)
            if (notification.nameNotificationType === 'follow') {
                router.push(`/profile/${notification.usernameUserTrigger}`);
            } else if (notification.nameNotificationType === 'comment' || notification.nameNotificationType === 'like' || notification.nameNotificationType === 'mention') {
                router.push(`/post/${notification.idPost}`);
            }
        } catch (error) {
            console.error("Error changing notification seen status:", error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user]);

    const getNotificationStyle = (type) => {
        switch (type) {
            case "follow":
                return { bg: "bg-blue-100 dark:bg-blue-900", icon: <UserPlus className="text-blue-600 dark:text-blue-400 w-6 h-6" /> };
            case "like":
                return { bg: "bg-green-100 dark:bg-green-900", icon: <ThumbsUp className="text-green-600 dark:text-green-400 w-6 h-6" /> };
            case "comment":
                return { bg: "bg-orange-100 dark:bg-orange-900", icon: <MessageSquare className="text-orange-600 dark:text-orange-400 w-6 h-6" /> };
            case "mention":
                return { bg: "bg-purple-100 dark:bg-purple-900", icon: <AtSign className="text-purple-600 dark:text-purple-400 w-6 h-6" /> };
            default:
                return { bg: "bg-gray-100 dark:bg-gray-800", icon: null };
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <Container>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Notifications
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notifications.map((notification) => {
                    const { bg, icon } = getNotificationStyle(notification.nameNotificationType);
                    return (
                        <button
                            key={notification.id}
                            className={`flex items-center justify-between p-4 h-24 rounded-xl shadow-md transition-all duration-300 
                    ${bg} hover:scale-105 hover:shadow-lg`}
                            onClick={() => handleChangeSeen(notification)}
                        >
                            <div className="flex items-center gap-4">
                                {icon}
                                <div className="text-left">
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {notification.message}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {new Date(notification.createdAt).toLocaleString('en-GB', {
                                            year: 'numeric', month: 'short', day: '2-digit',
                                            hour: '2-digit', minute: '2-digit', hour12: false
                                        })}
                                    </p>
                                </div>
                            </div>
                            {!notification.seen && (
                                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </Container>

    );
};

export default NotificationPage;