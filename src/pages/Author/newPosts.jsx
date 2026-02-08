import { useNavigate } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import NewPost from "../../components/newPost";

const NewPosts = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="p-10">
        <button
          onClick={() => navigate("/author/dashboard")}
          className="mb-7 flex justify-center items-center text-blue-900 font-semibold transform transition-all duration-200 ease-out
           hover:text-blue-400 hover:translate-x-2 hover:shadow-lg cursor-pointer "
        >
          <BiLeftArrowAlt /> back to dashboard
        </button>
        <div className="bg-gray-100 h-auto rounded-lg p-10">

          <NewPost className="w-full"/>
        </div>
      </div>
    </div>
  );
};

export default NewPosts;
