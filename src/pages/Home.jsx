import { BsSearch } from "react-icons/bs";
import { AiFillAmazonCircle } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

import Header from "../components/Header";
import Post from "../components/Post";
import SearchBar from "../components/SeachInput";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Home = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [likes, setlikes] = useState(0);
  const [comments, setComments] = useState(0);

  const todayDate = new Date().toLocaleDateString("en-US");

  return (
    <>
      {/* <div className="p-10 mx-auto w-1/2"> */}
    <div className="px-[15rem] pt-10">
        {" "}
        <div>
          <Header />
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Post
            todayDate={todayDate}
            likes={likes}
            comments={comments}
            id={id}
          />

          <br />
        </div>
      </div>
    </>
  );
};

export default Home;
