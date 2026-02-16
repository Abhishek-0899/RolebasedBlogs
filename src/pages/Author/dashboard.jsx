import Statsgrid from "../../components/Statsgrid";
import { getDashboardStats } from "../../utils/getDashboardStats";
import editImage from "../../assets/edit.png";
import deleteImage from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../../features/posts/postSlice";

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ===== READ FROM REDUX ===== */
  const posts = useSelector((state) => state.posts.posts);
  const statsData = useSelector((state) => state.posts.stats);

  // /* ===== FILTER POSTS ===== */

  const currentUserID = "author";

  const authorPosts = posts.filter((post) => post.authorId === currentUserID);

  /* ===== STATS ===== */
  const stats = getDashboardStats({
    role: "author",
    data: statsData,
  });

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl p-10 mt-10">
        <h1 className="text-4xl font-extrabold">Author Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Manage your blog posts and track performance
        </p>

        <Statsgrid stats={stats} />

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">Your Posts</h2>

          {authorPosts.length === 0 && (
            <p className="text-gray-500">No posts yet.</p>
          )}

          {authorPosts.map((post) => (
            <div key={post.id} className="bg-gray-200 rounded-lg p-5 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <span
                    className={` px-2 py-1 rounded-lg capitalize ${post.status === "pending" ? "bg-yellow-400" : post.status === "published" ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    {post.status}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/author/new-posts/${post?.id}`, {
                        state: { post },
                      })
                    }
                    className="hover:bg-gray-300 p-1 rounded-lg"
                  >
                    {post.status !== "published" ? (
                      <img src={editImage} className="w-6 h-6" />
                    ) : (
                      ""
                    )}
                  </button>

                  <button
                    onClick={() => dispatch(deletePost(post.id))}
                    className="hover:bg-gray-300 p-1 rounded-lg"
                  >
                    <img src={deleteImage} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <p className="mt-2">{post.excerpt}</p>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
