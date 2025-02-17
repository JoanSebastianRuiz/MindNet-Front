"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import PostForm from "@/components/forms/PostForm";
import Container from "@/components/containers/Container";
import Post from "@/components/common/Post";
import { useUser } from "@/context/UserContext";
import { Globe, Users, Flame, Sparkles, Sun, Moon } from "lucide-react";

const Home = () => {
    const [posts, setPosts] = useState(null);
    const [filter, setFilter] = useState("trending");
    const [scope, setScope] = useState("all");
    const { user } = useUser();
    const [darkMode, setDarkMode] = useState(
        typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const fetchPosts = async () => {
        if (user?.id) {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/posts?filter=${filter}&scope=${scope}&iduser=${user.id}`, {
                    withCredentials: true,
                });
                setPosts(data);
            } catch (error) {
                console.error("Error getting posts", error);
            }
        } else {
            console.error("User ID is not available");
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchPosts();
        }
    }, [filter, scope, user]);

    return (
        <Container className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all">

            {/* Formulario de publicación */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <PostForm fetchPosts={fetchPosts} />
            </div>

            {/* Barra de filtros */}
            <div className="flex flex-wrap justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 shadow-md">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("trending")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            filter === "trending"
                                ? "bg-blue-500 text-white font-semibold shadow-md"
                                : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
                        }`}
                    >
                        <Flame className="w-5 h-5" />
                        Trending
                    </button>

                    <button
                        onClick={() => setFilter("newest")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            filter === "newest"
                                ? "bg-blue-500 text-white font-semibold shadow-md"
                                : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
                        }`}
                    >
                        <Sparkles className="w-5 h-5" />
                        Newest
                    </button>
                </div>

                <button
                    onClick={() => setScope(scope === "all" ? "following" : "all")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                        scope === "all"
                            ? "bg-green-500 text-white font-semibold shadow-md"
                            : "bg-orange-500 text-white font-semibold shadow-md"
                    }`}
                >
                    {scope === "all" ? (
                        <>
                            <Globe className="w-5 h-5" /> <span>Global Feed</span>
                        </>
                    ) : (
                        <>
                            <Users className="w-5 h-5" /> <span>Inner Circle</span>
                        </>
                    )}
                </button>
            </div>

            {/* Lista de publicaciones */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts ? (
                    posts.length > 0 ? (
                        posts.map((post) => (
                            <Post
                                key={post.id}
                                post={post}
                                fetchPosts={fetchPosts}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md transition-transform hover:scale-105 bg-white dark:bg-gray-800"
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 text-lg italic">No posts found.</p>
                    )
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg italic">Loading posts...</p>
                )}
            </section>
        </Container>
    );
};

export default Home;
