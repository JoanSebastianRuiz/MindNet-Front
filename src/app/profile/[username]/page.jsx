"use client";

import Container from "@/components/containers/Container";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { User, UserRoundCheck, UserRoundPlus, UserRoundMinus, Pencil, Mail, Phone, Calendar, CircleX } from "lucide-react";
import axios from "axios";
import Post from "@/components/common/Post";
import ReactModal from "react-modal";
import ListUsers from "@/components/modals/ListUsers";
import { useUser } from "@/context/UserContext";
import ProfileEditForm from "@/components/modals/ProfileEditForm";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isOpenFollowers, setIsOpenFollowers] = useState(false);
  const [isOpenFollowing, setIsOpenFollowing] = useState(false);
  const [isOpenEditProfile, setIsOpenEditProfile] = useState(false);
  const [userFollow, setUserFollow] = useState(false);
  const [isHoveringUnfollow, setIsHoveringUnfollow] = useState(false);
  const { user: currentUser } = useUser();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/users/username/${username}`, { withCredentials: true });
      setUser(data);
    } catch (error) {
      console.error("Error getting user", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/posts/user/${username}`, { withCredentials: true });
      setPosts(data);
    } catch (error) {
      console.error("Error getting posts", error);
    }
  };

  const refreshUser =  async () => {
    await fetchPosts();
    await fetchUser();
  };

  const handleFollow = async () => {
    try {
      const data = {
        username: currentUser.username,
        usernameFollowed: user.username
      };
      await axios.post(`http://localhost:8080/api/users/follow`, data, { withCredentials: true });
      setUserFollow(true);
      refreshUser();
    } catch (error) {
      console.error("Error following user", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const data = {
        username: currentUser.username,
        usernameUnfollowed: user.username
      };
      await axios.delete(`http://localhost:8080/api/users/unfollow`, {
        data: data, // Debe ir dentro del objeto de configuración
        withCredentials: true
      });
      setUserFollow(false);
      refreshUser();
    } catch (error) {
      console.error("Error unfollowing user", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [username]);

  useEffect(() => {
    if (!currentUser || !user) return;

    if (
      currentUser.id !== user.id &&
      Array.isArray(user.followers) &&
      user.followers.some((u) => u.username === currentUser.username)
    ) {
      setUserFollow(true);
    } else {
      console.log(user);
      setUserFollow(false);
    }
  }, [user, currentUser]);

  if (!user) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (!currentUser) return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <Container>
      {/* Perfil del usuario */}
      <div className="flex items-center space-x-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="Profile" className="w-28 h-28 rounded-full border-4 border-blue-400 object-cover" />
        ) : (
          <User className="w-28 h-28 text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full p-3" />
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{user.fullname}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>

          {/* Seguidores y seguidos */}
          <div className="flex space-x-6 mt-2">
            <button
              onClick={() => setIsOpenFollowers(true)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-semibold transition"
            >
              <span className="text-xl font-bold">{user.followers.length}</span> Followers
            </button>
            <button
              onClick={() => setIsOpenFollowing(true)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-semibold transition"
            >
              <span className="text-xl font-bold">{user.following.length}</span> Following
            </button>

            {/* Botón de seguir o editar perfil */}
            {currentUser.id === user.id ? (
              <button className="flex items-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setIsOpenEditProfile(true)}>
                <Pencil className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span>Edit Profile</span>
              </button>
            ) : userFollow ? (
              <button
                onClick={handleUnfollow}
                onMouseEnter={() => setIsHoveringUnfollow(true)}
                onMouseLeave={() => setIsHoveringUnfollow(false)}
                className="flex items-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all bg-green-500 text-white hover:bg-red-600"
              >
                {isHoveringUnfollow ? <UserRoundMinus className="w-5 h-5" /> : <UserRoundCheck className="w-5 h-5" />}
                <span>{isHoveringUnfollow ? "Unfollow" : "Following"}</span>
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="flex items-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all bg-blue-500 text-white hover:bg-blue-600"
              >
                <UserRoundPlus className="w-5 h-5" />
                <span>Follow</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Informacion personal */}
      <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div className="flex items-center space-x-4 border-l-4 border-blue-500 pl-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all p-3">
            <Mail className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <div>
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Email</h3>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Cellphone */}
          <div className="flex items-center space-x-4 border-l-4 border-green-500 pl-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all p-3">
            <Phone className="w-6 h-6 text-green-500 dark:text-green-400" />
            <div>
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Cellphone</h3>
              <p className="text-gray-500 dark:text-gray-400">{user.cellphone}</p>
            </div>
          </div>

          {/* Birthday */}
          <div className="flex items-center space-x-4 border-l-4 border-purple-500 pl-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all p-3">
            <Calendar className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            <div>
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Birthday</h3>
              <p className="text-gray-500 dark:text-gray-400">{user.birthday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biografía */}
      <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Biography</h2>
        <p className={user.biography ? "text-gray-700 dark:text-gray-300" : "text-gray-400 italic"}>
          {user.biography || "No biography available"}
        </p>
      </div>

      {/* Publicaciones */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Posts</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-gray-400 italic text-center">No posts available</p>
          )}
        </section>
      </div>

      {/* Modal de seguidores */}
      <ReactModal
        isOpen={isOpenFollowers}
        onRequestClose={() => setIsOpenFollowers(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all scale-95">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Followers</h2>
          <ListUsers users={user.followers} />
          <button
            onClick={() => setIsOpenFollowers(false)}
            className="w-full mt-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 transition rounded-lg"
          >
            Close
          </button>
        </div>
      </ReactModal>

      {/* Modal de seguidos */}
      <ReactModal
        isOpen={isOpenFollowing}
        onRequestClose={() => setIsOpenFollowing(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all scale-95">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Following</h2>
          <ListUsers users={user.following} />
          <button
            onClick={() => setIsOpenFollowing(false)}
            className="w-full mt-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 transition rounded-lg"
          >
            Close
          </button>
        </div>
      </ReactModal>

      {/* Modal de editar perfil */}
      <ReactModal
        isOpen={isOpenEditProfile}
        onRequestClose={() => setIsOpenEditProfile(false)}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Botón de cierre */}
          <button
            onClick={() => setIsOpenEditProfile(false)}
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
          >
            <CircleX size={24} />
          </button>

          {/* Contenido del formulario */}
          <ProfileEditForm user={user} refreshUser={refreshUser} setIsOpenEditProfile={setIsOpenEditProfile} />
        </div>
      </ReactModal>
    </Container >
  );
};

export default Profile;
