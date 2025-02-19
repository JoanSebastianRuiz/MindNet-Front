"use client";

import Container from "@/components/containers/Container";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Post from "@/components/common/Post";
import { useUser } from "@/context/UserContext";

const PostPage = () => {
    const params = useParams();
    console.log("Params:", params);
    const id = params?.id;
    const [post, setPost] = useState(null);
    const { user } = useUser();

    const fetchPost = async () => {
        if (!id) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                withCredentials: true,
            });
            setPost(res.data);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    if (!id) return <Container>Error: ID no encontrado</Container>;
    if (!post) return <Container>Loading...</Container>;
    if (!user) return <Container>Usuario no autenticado</Container>;

    return (
        <Container>
            <div className="flex justify-center items-center py-10">
                <Post post={post} user={user} />
            </div>
        </Container>
    );
};

export default PostPage;
