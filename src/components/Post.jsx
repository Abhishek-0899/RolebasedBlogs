// components/Post.jsx
import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Post = ({ todayDate, comments, title, id, likes }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // debugger;
  // if (!user) return <p className="p-4 text-center">Loading...</p>;

  const handleOpenPost = () => {
    if (!user) return;
    if (user.role === "author") {
      navigate(`/author/posts/${id}`);
    } else if (user.role === "editor") {
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
        <AiFillAmazonCircle />
        <p className="font-medium truncate">{title}</p>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <AiOutlineHeart />
            <p>{likes || 0}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaRegComment />
            <p>{comments || 0}</p>
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        🕒 <span className="text-black">{todayDate}</span>
      </p>
    </div>
  );
};

export default Post;
