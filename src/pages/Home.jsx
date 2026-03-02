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
    <div className="min-h-screen bg-gray-100 flex justify-center px-4">
      <div className="w-full  bg-white rounded-2xl shadow-md p-6">
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
      </div>
    </div>
  );
};

export default Home;