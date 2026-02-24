import Navbar from "../../components/navbar";
import Statsgrid from "../../components/Statsgrid";
import { getDashboardStats } from "../../utils/getDashboardStats";
import acceptImage from "../../assets/accept.png";
import declineImage from "../../assets/decline.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePost,
  fetchPosts,
  publishPost,
} from "../../features/posts/postSlice";
import { useState, useEffect } from "react";
const EditorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dateTime = new Date().toLocaleDateString("en-US");

  // ✅ Fetch posts from Supabase on mount
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  /* ===== READ FROM REDUX ===== */
  const posts = useSelector((state) => state.posts.posts);
  const statsData = useSelector((state) => state.posts.stats);

  const [filter, setFilter] = useState("pending");
  const editorPost =
    filter === "pending"
      ? posts.filter((post) => post.status === "pending")
      : posts;

  /* ===== STATS ===== */
  const stats = getDashboardStats({ role: "editor", data: statsData });

  const postPublished = (id) => {
    dispatch(publishPost(id));
    setFilter("draft");
  };

  return (
    <div className="">
      {/* <Navbar /> */}
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-6xl p-10 mt-10">
          <h1 className="text-4xl font-extrabold">Editor Dashboard</h1>
          <p className="text-gray-500 mt-2">Review and manage all blog posts</p>

          <Statsgrid stats={stats} />
          {/* displayed data */}
          <div className=" mt-3 ">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">All Posts</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter("pending")}
                  className={`rounded-xl p-2 ${
                    filter === "pending"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-400 text-black"
                  }`}
                >
                  Pending Only
                </button>
                <button
                  onClick={() => setFilter("draft")}
                  className={`rounded-xl p-2 ${
                    filter !== "pending"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-400 text-black"
                  }`}
                >
                  All Posts
                </button>
              </div>
            </div>
            {editorPost.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              <>
                {editorPost.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-200 w-full flex flex-col p-5"
                  >
                    <hr className="bg-white" />

                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <h3 className="text-xl font-semibold">{post.title}</h3>{" "}
                        <span
                          className={`px-2 py-1 rounded-lg capitalize ${post.status === "pending" ? "bg-yellow-400" : post.status === "published" ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        {post.status === "pending" ? (
                          <>
                            <button
                              className="text-blue-500 font-semibold hover:text-blue-700 p-1 rounded-lg text-center"
                              onClick={() =>
                                navigate(`/editor/new-posts/${post.id}`, {
                                  state: { post },
                                })
                              }
                            >
                              View
                            </button>
                            <button
                              onClick={() => postPublished(post.id)}
                              className="hover:bg-gray-300 p-1 rounded-lg"
                            >
                              <img
                                className="w-5 h-5"
                                src={acceptImage}
                                alt="Logo"
                              />
                            </button>
                            <button
                              onClick={() => dispatch(deletePost(post.id))}
                              className="hover:bg-gray-300 p-1 rounded-lg"
                            >
                              <img
                                className="w-7 h-7"
                                src={declineImage}
                                alt="Logo"
                              />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-blue-500 font-semibold hover:text-blue-700 p-1 rounded-lg text-center"
                              onClick={() =>
                                navigate(`/editor/new-posts/${post.id}`, {
                                  state: { post },
                                })
                              }
                            >
                              View
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="mt-1">{post.excerpt}</p>
                    <p className="mt-3">{dateTime}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
