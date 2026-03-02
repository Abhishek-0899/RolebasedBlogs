// components/Post.jsx
import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postSlice";
import { useEffect } from "react";

const Post = ({ todayDate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch]);
  if (loading || !user) {
    return <p className="p-4 flex justify-center">Loading...</p>;
  }

  const role = user.role; // author/editor
  // console.log(role);

  // Filter posts based on role
  let filteredPosts = posts;
  if (role === "author") {
    // Authors can only see their own posts
    filteredPosts = posts.filter((post) => post.created_by === user.id);
  }
  // Editors see all posts (for review)

  if (loading) {
    return <p className="p-4 text-center">Loading...</p>;
  }

  if (!posts.length) {
    return <p className="p-4 text-center">No posts available</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-200 flex flex-col p-4 shadow rounded-md cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate(`/${role}/posts/${post.id}`)}
        >
          <div className="flex items-center gap-2">
            <AiFillAmazonCircle />
            <p className="font-medium truncate">{post.title}</p>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <AiOutlineHeart />
                <p>{post.likes}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaRegComment />
                <p>{post.comments}</p>
              </div>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            🕒 <span className="text-black">{todayDate}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Post;
