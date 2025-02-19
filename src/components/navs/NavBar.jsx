"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Home, User, LogOut, Brain, Bell } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useEffect } from "react";

const NavBar = () => {
    const { user, notificationsCount, setNotificationsCount } = useUser();
    const router = useRouter();

    const logout = async () => {
        try {
            const respuesta = await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            if (respuesta.status === 200) {
                router.push("/");
            }
        } catch {
            console.error("❌ Error logging out");
        }
    };


    useEffect(() => {
        if (!user) return;
        const fetchNotificationsCount = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/notifications/count/user/${user.id}`, {
                    withCredentials: true,
                });
                setNotificationsCount(response.data);
            } catch (error) {
                console.error("Error fetching notifications count:", error);
            }
        };
        fetchNotificationsCount();
    }, [user]);


    if (!user) return <p className="text-center text-gray-500">Loading profile...</p>;

    return (
        <>
            {/* Desktop NavBar */}
            <nav className="hidden md:flex flex-col bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-all  justify-between items-center">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <Brain className="w-12 h-12 text-blue-500" />
                </div>

                {/* Menú */}
                <ul className="flex flex-col gap-6 flex-grow justify-center">
                    <li className="hover:text-blue-500 transition">
                        <Link href="/home" className="flex justify-center">
                            <Home className="w-9 h-9" />
                        </Link>
                    </li>
                    <li className="hover:text-blue-500 transition">
                        <Link href={`/profile/${user.username}`} className="flex justify-center">
                            <User className="w-9 h-9" />
                        </Link>
                    </li>
                    <li className="relative hover:text-blue-500 transition-all">
                        <Link href={`/notifications`} className="flex justify-center items-center relative">
                            <Bell className="w-9 h-9" />
                            {notificationsCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-2 shadow-md transition-transform transform scale-100 hover:scale-105">
                                    {notificationsCount}
                                </span>
                            )}
                        </Link>
                    </li>
                    <li className="hover:text-red-500 transition">
                        <button onClick={logout} className="flex justify-center">
                            <LogOut className="w-9 h-9" />
                        </button>
                    </li>
                </ul>

                {/* Modo Oscuro */}
                <div className="flex justify-center mb-4">
                    <ThemeToggle />
                </div>
            </nav>


            {/* Mobile NavBar */}
            <nav className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-800 p-4 flex justify-around items-center md:hidden border-t border-gray-300 dark:border-gray-700 z-30">
                <Link href="/home" className="text-xl hover:text-blue-500 transition">
                    <Home className="w-6 h-6" />
                </Link>
                <Link href={`/profile/${user.username}`} className="text-xl hover:text-blue-500 transition">
                    <User className="w-6 h-6" />
                </Link>
                <Link href={`/notifications`} className="relative text-xl hover:text-blue-500 transition flex justify-center items-center">
                    <Bell className="w-6 h-6" />
                    {notificationsCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 shadow-md transition-transform transform scale-100 hover:scale-105">
                            {notificationsCount}
                        </span>
                    )}
                </Link>
                <button onClick={logout} className="text-xl text-gray-700 dark:text-gray-300 hover:text-red-500 transition" aria-label="Logout">
                    <LogOut className="w-6 h-6" />
                </button>
                <ThemeToggle />
            </nav>
        </>
    );
};

export default NavBar;
