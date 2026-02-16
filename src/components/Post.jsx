import { AiFillAmazonCircle, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
const Post = ({ todayDate , id}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole(user);
  const posts = useSelector((state) => state.posts.posts);
  const currentuser = role;
console.log(currentuser)
  return (
    <>
      {posts.length === 0 && (
        <p className="p-4 flex justify-center">No posts available</p>
      )}
      {posts.map((post) => (
        <div
          className="w-52 h-32 bg-gray-200 flex border-2 flex-col p-2 shadow
      hover:shadow-lg hover:shadow-gray-500
     
  transition-shadow duration-300 mt-8 rounded-md
          "
          // onClick={() => navigate(`/${currentuser}/:${post.id}`)}
        >
          <h1>ds</h1>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center justify-center gap-1">
              <AiFillAmazonCircle />
              <p>{post.title}</p>
            </div>

            <div className="flex gap-4 ">
              <div className="flex justify-center items-center gap-1">
                <AiOutlineHeart />
                <p>{post.likes}</p>
              </div>
              <div className="flex justify-center items-center gap-1">
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
