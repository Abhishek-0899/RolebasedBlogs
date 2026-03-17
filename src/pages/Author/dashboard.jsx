import Statsgrid from "../../components/Statsgrid";
import { getDashboardStats } from "../../utils/getDashboardStats";
import editImage from "../../assets/edit.png";
import deleteImage from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePost, fetchPosts } from "../../features/posts/postSlice";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  // ✅ Fetch posts from Supabase on mount
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  /* ===== READ FROM REDUX ===== */
  const posts = useSelector((state) => state.posts.posts);

  // /* ===== FILTER POSTS ===== */

  const currentUserID = user?.id;

  const authorPosts = posts.filter((post) => post.created_by === currentUserID);

  /* ===== STATS ===== */
  // Calculate stats for current author only
  const authorStats = {
    drafts: authorPosts.filter((p) => p.status === "draft").length,
    review: authorPosts.filter((p) => p.status === "pending").length,
    published: authorPosts.filter((p) => p.status === "published").length,
    totalPosts: authorPosts.length,
  };

  const stats = getDashboardStats({
    role: "author",
    data: authorStats,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="mb-6">
          <h1 className="text-4xl sm:text-3xl font-extrabold text-gray-800">
            Author Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your blog posts and track performance
          </p>
        </div>

        <Statsgrid stats={stats} />

        <div className="mt-6">
          <h2 className="text-2xl sm:text-2xl text-gray-800 font-semibold mb-3">
            Your Posts
          </h2>

          {authorPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No posts yet ✍️ <br />
              Start writing your first story!
            </p>
          ) : (
            <div className="space-y-4">
              {authorPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition"
                >
                  {/* TOP */}
                  <div className="flex flex-row justify-between sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {post.title}
                      </h3>

                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${
                          post.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : post.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-2">
                      {post.status !== "published" && (
                        <button
                          onClick={() =>
                            navigate(`/author/new-posts/${post?.id}`, {
                              state: { post },
                            })
                          }
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <img src={editImage} className="w-4 h-4" />
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => dispatch(deletePost(post.id))}
                        className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <img src={deleteImage} className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* EXCERPT */}
                  <p className="mt-2 text-gray-600 text-sm sm:text-base">
                    {post.excerpt}
                  </p>

                  {/* DATE */}
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
