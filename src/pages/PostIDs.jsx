import { BiLeftArrowAlt } from "react-icons/bi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const PostID = () => {
  const navigate = useNavigate();
  const [countLike, setCountLike] = useState(0);
  const [liked, setLiked] = useState(false);
  const [CoutComment, setCountComment] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const handleComment = () => {
    if (commentText.trim()) {
      //   setCountComment((c) => c + 1);

      setCountComment((prev) => [...prev, commentText.trim()]);
      setCommentText("");
    }
  };

  const handleLike = () => {
    if (liked) {
      setCountLike((c) => c - 1);
    } else {
      setCountLike((c) => c + 1);
    }
    setLiked(!liked);
  };
  const role = user?.role;
  const DASHBOARD_ROUTES = {
    editor: "/editor/dashboard",
    author: "/author/dashboard",
    reader: "/",
  };
  const getDashboardRoute = (role) => {
    return DASHBOARD_ROUTES[role] || "/";
  };

  return (
    <>
      <div className="p-10">
        <button
          onClick={() => navigate(getDashboardRoute(role))}
          className="mb-7 flex justify-center items-center text-blue-900 font-semibold transform transition-all duration-200 ease-out
      hover:text-blue-400 hover:translate-x-2 hover:shadow-lg cursor-pointer "
        >
          <BiLeftArrowAlt /> back to home page
        </button>

        <div className="w-2/4 mb-3 h-auto p-2 bg-yellow-200 rounded-xl">
          <h1 className="font-bold text-3xl">ds</h1>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center justify-center gap-1">
              <AiFillAmazonCircle />

              <p>ds</p>
            </div>

            <div className="flex gap-4 ">
              <div className="flex justify-center items-center gap-1">
                <p
                  onClick={handleLike}
                  className={`flex justify-center items-center gap-2
              p-2 rounded-lg
              transition-colors durations-200 
              ${liked ? "bg-red-200" : "bg-gray-200"}`}
                >
                  {liked ? "❤️" : <AiOutlineHeart />}

                  <span>{countLike}</span>
                </p>
              </div>
              <div className="flex justify-center items-center gap-1">
                <p className="border-2 bg-gray-100 rounded-full p-2">
                  <FaRegComment />
                </p>
                <p>{CoutComment.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/4 h-auto p-2 bg-gray-200 rounded-xl mr-4">
          <h1 className="mb-3">
            Comments <span>{CoutComment.length}</span>
          </h1>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm
             focus:border-green-500 focus:ring-1 focus:ring-green-500
             transition"
            placeholder="Write a comment…"
            rows={2}
          />

          <button
            onClick={handleComment}
            className={`mt-3 p-2 rounded-lg bg-blue-200
            ${CoutComment > 0 ? "hover:bg-blue-700" : "bg-blue-200"}
            `}
          >
            Post comment
          </button>
          {CoutComment.length === 0 && (
            <h1 className="text-center m-4 pt-3">
              No comments yet. Be the first to comment!
            </h1>
          )}

          {/* display all comments*/}

          <div className="mt-4 space-y-2">
            {CoutComment.map((comment, index) => (
              <div
                key={index}
                className="p-2 bg-white rounded-lg shadow-sm border"
              >
                {comment}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostID;
