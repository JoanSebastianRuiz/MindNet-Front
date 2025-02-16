"use client"

import PostForm from "@/components/forms/PostForm";
import Container from "@/components/containers/Container";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "@/components/common/Post";

const Home = () => {
    const [posts, setPosts] = useState(null);

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/posts", { withCredentials: true });
            setPosts(data);
        } catch (error) {
            console.error("Error getting posts", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Container className="space-y-6 p-6 bg-gray-100 rounded-xl shadow-lg">
            <PostForm className="mb-4" fetchPosts={fetchPosts} />
            <hr className="border-t-2 border border-gray-400 my-6" />
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts ? (
                    posts.map((post) => (
                        <Post key={post.id} post={post} className="rounded-lg border border-gray-200 shadow-md transition-transform hover:scale-105" />
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg italic">Loading posts...</p>
                )}
            </section>
        </Container>
    );
};

export default Home;
