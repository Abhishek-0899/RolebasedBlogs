import { AiFillAmazonCircle } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const toNvaigate = useNavigate();
  const todayDate = new Date().toLocaleDateString("en-US");

  return (
    <>
      <div className="p-10">
        <div>
          <h1 className="font-bold text-2xl">Latest Posts</h1>
          <p className="text-gray-400">
            Discover the newest content from our authors
          </p>

          <hr className="w-full border-gray-300 my-4" />
          <div
            className="w-52 h-32 bg-gray-200 flex border-2 flex-col p-2 shadow
  hover:shadow-lg hover:shadow-gray-500
  transition-shadow duration-300 mt-8 rounded-md
          "
            onClick={() => toNvaigate("/posts/:id")}
          >
            <h1>ds</h1>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center justify-center gap-1">
                <AiFillAmazonCircle />
                <p>ds</p>
              </div>

              <div className="flex gap-4 ">
                <div className="flex justify-center items-center gap-1">
                  <AiOutlineHeart />
                  <p>0</p>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <FaRegComment />
                  <p>0</p>
                </div>
              </div>
            </div>
            <p className="mt-auto text-sm text-gray-600">
              🕒 <span className="text-black">{todayDate}</span>
            </p>
          </div>
          <br />
        </div>
      </div>
    </>
  );
};

export default Home;
