import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiLeftArrowAlt } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import supabase from "../utils/supabase";

const PostID = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [countLike, setCountLike] = useState(0);
  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(name)")
        .eq("id", id)
        .single();

      if (!error && data) {
        setPost(data);
        setCountLike(data.likes || 0);
      }

      setLoading(false);
    };

    if (id) fetchPost();
  }, [id]);

  /* ================= LIKE ================= */
  const handleLike = () => {
    setCountLike((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  /* ================= COMMENT ================= */
  const handleComment = () => {
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        text: commentText.trim(),
        liked: false,
        countLike: 0,
        replies: [],
        showReplyBox: false,
      },
    ]);
    setCommentText("");
  };



  
  const DASHBOARD_ROUTES = {
    editor: "/editor/dashboard",
    author: "/author/dashboard",
    reader: "/",
  };

  const getDashboardRoute = (role) => DASHBOARD_ROUTES[role] || "/";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return <div className="p-10 text-center text-xl">Post not found.</div>;
  }

  return (
    <div className="p-10">
      <button
        onClick={() => navigate(getDashboardRoute(user?.role))}
        className="mb-7 flex items-center text-blue-900 font-semibold hover:text-blue-400 transition"
      >
        <BiLeftArrowAlt className="mr-1" />
        Back to home page
      </button>

      <div className="min-h-screen flex justify-center px-4 py-10">
        <div className="w-full max-w-3xl space-y-6">
          {/* POST CARD */}
          <div className="p-6 bg-yellow-200 rounded-xl shadow">
            <h1 className="font-bold text-3xl mb-3 break break-words">
              {post.content}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <AiFillAmazonCircle />
              <p className="text-sm text-gray-700">
                By {post?.profiles?.name || "Unknown"}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
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
                <p>{comments.length}</p>
              </div>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="p-4 bg-gray-200 rounded-xl shadow">
            <h2 className="mb-3 font-semibold">Comments ({comments.length})</h2>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Write a comment..."
              rows={3}
            />

            <button
              onClick={handleComment}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Post Comment
            </button>

            {comments.length === 0 && (
              <p className="text-center mt-4 text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            )}

            <div className="mt-6 space-y-3">
              {comments.map((comment, index) => (
                <div key={index} className="flex gap-3 items-center">
                  {/* Avatar circle */}
                  <div
                    className="w-9 h-9 rounded-full bg-gray-300 flex items-center
 justify-center text-sm font-semibold"
                  >
                    U
                  </div>

                  {/* Comment Section */}
                  <div className="flex-1 min-w-0">
                    {/* comment Bubble */}
                    <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow">
                      {/* <p className="text-sm font-semibold">user</p> */}
                      <p
                        className="
                      font-sm break-words 
                      "
                      >
                        {comment.text}
                      </p>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mt-1 ml-2">
                      <button
                        onClick={() => {
                          setComments((prev) =>
                            prev.map((c, i) =>
                              i === index
                                ? {
                                    ...c,
                                    liked: !c.liked,
                                    countLike: c.liked
                                      ? c.countLike - 1
                                      : c.countLike + 1,
                                  }
                                : c,
                            ),
                          );
                        }}
                        className="flex items-center gap-1 hover:text-blue-600 transition"
                      >
                        {comment.liked ? (
                          <>
                            <AiFillLike className="text-blue-600" />
                            <span className="text-blue-600 font-medium">
                              {comment.countLike}
                            </span>
                          </>
                        ) : (
                          <>
                            <AiOutlineLike />
                            <span>{comment.countLike}</span>
                          </>
                        )}
                      </button>
                      <button className="hover:text-blue-600 transition">
                        Reply
                      </button>
                      <button>Just now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostID;
