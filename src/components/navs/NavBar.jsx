"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Home, User, Bell, LogOut, Brain } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/common/ThemeToggle";

const NavBar = () => {
    const { user, logout: logoutSession } = useUser();
    const router = useRouter();

    const logout = async () => {
        try {
            const respuesta = await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            if (respuesta.status === 200) {
                logoutSession();
                router.push("/");
            }
        } catch {
            console.error("❌ Error logging out");
        }
    };

    if (!user) return <p className="text-center text-gray-500">Loading profile...</p>;

    return (
        <>
            {/* 🌟 Desktop NavBar */}
            <nav className="hidden md:block bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-all relative">
                <div className="flex items-center justify-between mb-5 relative">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                        <Brain className="w-6 h-6 mr-2" /> MindNet
                    </h2>
                </div>
                <ul className="space-y-4">
                    <li className="text-lg hover:text-blue-500 transition">
                        <Link href="/home" className="flex items-center">
                            <Home className="w-5 h-5 mr-2" />Home
                        </Link>
                    </li>
                    <li className="text-lg hover:text-blue-500 transition">
                        <Link href={`/profile/${user.username}`} className="flex items-center">
                            <User className="w-5 h-5 mr-2" />Profile
                        </Link>
                    </li>
                    <li>
                        <button onClick={logout} className="flex items-center text-lg hover:text-red-500 transition">
                            <LogOut className="w-5 h-5 mr-2" />Logout
                        </button>
                    </li>
                    <li className="flex p-2 justify-center">
                        <ThemeToggle />
                    </li>
                </ul>
            </nav>

            {/* 📱 Mobile NavBar */}
            <nav className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-800 p-4 flex justify-around items-center md:hidden border-t border-gray-300 dark:border-gray-700">
                <Link href="/home" className="text-xl hover:text-blue-500 transition">
                    <Home className="w-6 h-6" />
                </Link>
                <Link href={`/profile/${user.username}`} className="text-xl hover:text-blue-500 transition">
                    <User className="w-6 h-6" />
                </Link>
                <Link href="/signup" className="text-xl hover:text-blue-500 transition">
                    <Bell className="w-6 h-6" />
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
