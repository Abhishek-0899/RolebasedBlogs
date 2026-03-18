import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { FaRegComment } from "react-icons/fa";

const Post = ({ todayDate, comments, title, id, likes, userId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      setAvatar(data.avatar_url || null);
    };
    fetchPost();
  }, [userId]);

  const handleOpenPost = () => {
    if (user?.role === "author") {
      navigate(`/author/posts/${id}`);
    } else if (user?.role === "editor") {
      navigate(`/editor/posts/${id}`);
    } else {
      navigate(`/posts/${id}`);
    }
  };
  return (
    <div
      className="bg-gray-200 flex flex-col p-4 shadow rounded-md cursor-pointer hover:shadow-lg transition"
      onClick={() => handleOpenPost()}
    >
      <div className="flex items-center gap-2">
        <img
          src={avatar || ""}
          alt="avatar"
          className="w-6 h-6 rounded-full object-cover"
        />

        <p className="font-bold text-2xl truncate">{title}</p>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            {likes === 0 ? (
              <span className="text-xl">❤️ 0</span>
            ) : (
              <span className="text-xl">❤️ {likes} </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {comments === 0 ? (
              <span className="text-xl">📰 0</span>
            ) : (
              <span className="text-xl"> 📰 {comments}</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        <span className="text-black text-xl">⏱️{todayDate}</span>
      </p>
    </div>
  );
};

export default Post;
