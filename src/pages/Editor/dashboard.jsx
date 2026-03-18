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
      ? posts.filter((post) => post?.status === "pending")
      : posts;

  /* ===== STATS ===== */
  const stats = getDashboardStats({ role: "editor", data: statsData });

  const postPublished = (id) => {
    dispatch(publishPost(id));
    // setFilter("draft");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Editor Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Review and manage all blog posts</p>
        </div>

        {/* {Stats} */}
        <Statsgrid stats={stats} />

        {/* FILTER + TITLE */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            All Posts
          </h2>
          {/* FILTER Tab */}
          {/* <div className=" mt-3 "> */}
          <div className="flex bg-gray-200 rounded-xl p-1 w-fit">
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === "pending"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter !== "pending"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600"
              }`}
            >
              All Posts
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="mt-4 space-y-4">
          {editorPost.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No posts found 💤</p>
          ) : (
            <>
              {editorPost.map((post) => (
                <div
                  key={post?.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 sm:p-5 border
                    ${post?.status === "published" ? "border-l-4 border-green-500" : "bg-gray-200"}`}
                >
                  {/* TOP ROW */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    {/* TITLE + STATUS */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <h3 className="text-lg sm:text-xl break-words font-semibold">
                        {post?.title}
                      </h3>

                      <span
                        className={`text-sm px-2 py-1 rounded-full capitalize font-medium 
                          ${
                            post?.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : post?.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {post?.status}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3 mt-2 mb-2">
                      {/* {post?.status === "pending" ? (
                        <> */}

                      <button
                        className="px-3 py-1 text-sm rounded-lg bg-blue-50
                        text-blue-500 hover:bg-blue-100 transition"
                        onClick={() =>
                          navigate(`/editor/new-posts/${post?.id}`, {
                            state: { post },
                          })
                        }
                      >
                        View
                      </button>
                      {post?.status === "pending" && (
                        <>
                          <button
                            onClick={() => postPublished(post?.id)}
                            className="flex items-center gap-1 px-3 py-1
                            text-sm rounded-lg bg-green-50 text-green-600
                            hover:bg-green-50 transition"
                          >
                            <img
                              className="w-5 h-5"
                              src={acceptImage}
                              alt="Logo"
                            />
                            Approve
                          </button>

                          <button
                            onClick={() => dispatch(deletePost(post?.id))}
                            className="flex items-center gap-1 px-3 py-1
                            text-sm rounded-lg bg-red-50 text-red-600
                            hover:bg-reg-50 transition
                             "
                          >
                            <img
                              className="w-4 h-4"
                              src={declineImage}
                              alt="Logo"
                            />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* CONTENT */}
                  <p className="mt-2 text-gray-600 text-sm sm:text-base break-words">
                    {post?.excerpt}
                  </p>

                  {/* DATE */}
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(post?.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
