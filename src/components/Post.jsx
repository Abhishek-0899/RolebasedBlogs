// components/Post.jsx
import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

const Post = ({ todayDate }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const posts = useSelector((state) => state.posts.posts);

  if (loading || !user) {
    return <p className="p-4 flex justify-center">Loading...</p>;
  }

  const role = user.role; // author/editor
  console.log(role);
  
  // Filter posts based on role
  let filteredPosts = posts;
  if (role === "author") {
    // Authors can only see their own posts
    filteredPosts = posts.filter((post) => post.authorId === user.id);
  }
  // Editors see all posts (for review)
  
  if (!filteredPosts || filteredPosts.length === 0) {
    return <p className="p-4 flex justify-center">No posts available</p>;
  }

  return (
    <>
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="w-52 h-32 bg-gray-200 flex flex-col p-2 shadow mt-8 rounded-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate(`/${role}/posts/${post.id}`)}
        >
          <div className="flex items-center gap-2">
            <AiFillAmazonCircle />
            <p className="font-medium">{post.title}</p>
          </div>

          <div className="flex justify-between items-center mt-auto">
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

          <p className="mt-auto text-sm text-gray-600">
            🕒 <span className="text-black">{todayDate}</span>
          </p>
        </div>
      ))}
    </>
  );
};

export default Post;
