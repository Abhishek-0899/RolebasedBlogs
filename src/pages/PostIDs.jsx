import { AiFillLike, AiOutlineLike, AiOutlineHeart } from "react-icons/ai";
import { BiLeftArrowAlt } from "react-icons/bi";
import { AiFillAmazonCircle } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  /* ================= FETCH COMMENTS + REPLIES ================= */

  useEffect(() => {
    const fetchComment = async () => {
      const { data: commentData, error } = await supabase
        .from("comments")
        .select("*,profiles(name)")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      const { data: replyData } = await supabase.from("replies").select("*");

      if (!error && commentData) {
        const safeComment = commentData.map((c) => ({
          ...c,
          replies: (replyData || []).filter((r) => r.comment_id === c.id),
          liked: false,
          countLike: c.likes || 0,
          showReplyBox: false,
          replyText: "",
        }));

        setComments(safeComment);
      }
    };

    if (id) fetchComment();
  }, [id]);

  /* ================= MAIN POST LIKE ================= */

  const handleLike = async () => {
    const newLiked = liked ? countLike - 1 : countLike + 1;
    setLiked(!liked);
    setCountLike(newLiked);

    await supabase.from("posts").update({ likes: newLiked }).eq("id", id);
  };

  /* ================= COMMENT LIKE ================= */

  const handleCommentLike = async (comment) => {
  const newLikes = (comment.likes || 0) + 1;

  const { error } = await supabase
    .from("comments")
    .update({ likes: newLikes })
    .eq("id", comment.id);

  if (error) {
    console.log("LIKE ERROR:", error);
    return;
  }

  setComments((prev) =>
    prev.map((c) =>
      c.id === comment.id ? { ...c, likes: newLikes } : c
    )
  );
};

  /* ================= ADD COMMENT ================= */

  const handleComment = async () => {
    if (!commentText.trim()) return;

    const { data } = await supabase
      .from("comments")
      .insert([
        {
          post_id: id,
          user_id: user?.id,
          text: commentText.trim(),
        },
      ])
      .select("*, profiles(name)")
      .single();

    setComments((prev) => [
      ...prev,
      {
        ...data,
        replies: [],
        liked: false,
        countLike: 0,
        showReplyBox: false,
        replyText: "",
      },
    ]);

    setCommentText("");
  };

  /* ================= ADD REPLY ================= */

  const handleReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;

    const { data, error } = await supabase
      .from("replies")
      .insert([
        {
          comment_id: commentId,
          user_id: user?.id,
          text: replyText.trim(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...(c.replies || []), data],
              replyText: "",
              showReplyBox: false,
            }
          : c,
      ),
    );
  };

  const goToPostPage = (role) => {
    if (role === "author") navigate("/author/posts");
    else if (role === "editor") navigate("/editor/posts");
    else navigate("/");
  };

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
        onClick={() => goToPostPage(user?.role)}
        className="mb-7 flex items-center text-blue-900 font-semibold hover:text-blue-400 transition"
      >
        <BiLeftArrowAlt className="mr-1" />
        Back to post page
      </button>

      <div className="min-h-screen flex justify-center px-4 py-10">
        <div className="w-full max-w-3xl space-y-6">
          {/* POST CARD */}

          <div className="p-6 bg-yellow-200 rounded-xl shadow">
            <div className="bg-yellow-200 rounded-xl shadow p-6 mb-4">
              <h1 className="text-3xl font-bold mb-2 break-words">
                {post.title}
              </h1>

              <p className="text-gray-700 italic mb-4">{post.excerpt}</p>

              <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <AiFillAmazonCircle />
                <p>By {post?.profiles?.name?.[0] || "Unknown"}</p>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <div
                onClick={handleLike}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition
                ${liked ? "bg-red-200" : "bg-gray-200"}`}
              >
                {liked ? "❤️" : <AiOutlineHeart />}
               <span>{countLike}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="border bg-gray-100 rounded-full p-2">
                  <FaRegComment />
                </div>
                <span>{comments.length}</span>
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

            <div className="mt-6 space-y-4">
              {(comments || []).map((comment, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    U
                  </div>

                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow break-words">
                      <p className="text-sm">{comment.text}</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mt-1 ml-2">
                      <button
                        onClick={() =>
                          handleCommentLike(comment)
                        }
                        className="flex items-center gap-1 hover:text-blue-600 transition"
                      >
                        {comment.liked ? (
                          <>
                            <AiFillLike className="text-blue-600" />
                            <span className="text-blue-600">
                              {comment.likes}
                            </span>
                          </>
                        ) : (
                          <>
                            <AiOutlineLike />
                            <span>{comment.likes}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setComments((prev) =>
                            prev.map((c, i) =>
                              i === index
                                ? { ...c, showReplyBox: !c.showReplyBox }
                                : c,
                            ),
                          );
                        }}
                        className="hover:text-blue-600 transition"
                      >
                        Reply
                      </button>
                    </div>

                    {comment.showReplyBox && (
                      <div className="mt-3 ml-6">
                        <textarea
                          value={comment.replyText}
                          onChange={(e) => {
                            const value = e.target.value;

                            setComments((prev) =>
                              prev.map((c, i) =>
                                i === index ? { ...c, replyText: value } : c,
                              ),
                            );
                          }}
                          className="w-full border rounded-lg p-3 text-sm"
                          rows={2}
                        />

                        <button
                          onClick={() =>
                            handleReply(comment.id, comment.replyText)
                          }
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          Post Reply
                        </button>
                      </div>
                    )}

                    {(comment.replies || []).map((reply, rIndex) => (
                      <div
                        key={rIndex}
                        className="flex gap-3 items-start mt-2 ml-12"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                          U
                        </div>

                        <div className="bg-gray-100 rounded-2xl px-3 py-1.5 shadow break-words flex-1 max-w-[85%]">
                          <p className="text-sm">{reply.text}</p>
                        </div>
                      </div>
                    ))}
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
