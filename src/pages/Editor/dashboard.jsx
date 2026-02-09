import Navbar from "../../components/navbar";
import Statsgrid from "../../components/Statsgrid";
import { getDashboardStats } from "../../utils/getDashboardStats";
import editImage from "../../assets/edit.png";
import deleteImage from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../../features/posts/postSlice";
const EditorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dateTime = new Date().toLocaleDateString("en-US");
  // const statsData = {
  //   PendingReview: 0,
  //   Published: 0,
  //   TotalPosts: 0,
  // };

  const posts = useSelector((state) => state.posts.posts);
  const statsData = useSelector((state) => state.posts.stats);

  const authorId = 1;
  const editorPost = posts.filter((post) => post.authorId === authorId);

  /* ===== STATS ===== */
  const stats = getDashboardStats({ role: "editor", data: statsData });

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
            {editorPost.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              <h2>Your Posts</h2>
            )}
            {editorPost.map((post) => (
              <div className="bg-gray-200 w-full flex flex-col p-5">
                <hr className="bg-white" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center ">
                    <h3 className="text-xl font-semibold">{post.title}</h3>{" "}
                    <span
                      className={`px-2 py-1 rounded-lg capitalize ${post.status === "pending" ? "bg-yellow-400" : "bg-gray-300"}`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <div className="flex gap-3 ">
                    <button
                      className="hover:bg-gray-300 p-1 rounded-lg "
                      onClick={() => navigate(`/editor/new-posts/${post.id}`)}
                    >
                      <img className="w-6 h-6" src={editImage} alt="Logo" />
                    </button>
                    <button
                      onClick={() => dispatch(deletePost(post.id))}
                      className="hover:bg-gray-300 p-1 rounded-lg"
                    >
                      <img className="w-6 h-6" src={deleteImage} alt="Logo" />
                    </button>
                  </div>
                </div>
                <p className="mt-1">{post.excerpt}</p>
                <p className="mt-3">{dateTime}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
