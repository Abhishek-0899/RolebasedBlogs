import React, { useState } from "react";
import Post from "../../components/Post";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/SeachInput";

const ManagePost = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [likes, setlikes] = useState(0);
  const [comments, setComments] = useState(0);
  const todayDate = new Date().toLocaleDateString("en-US");
  return (
    <div className="p-10">
      <h1 className="font-bold text-3xl m-4">All post</h1>
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />{" "}
      <Post
        todayDate={todayDate}
        likes={likes}
        comments={comments}
        id={id}
      />{" "}
    </div>
  );
};

export default ManagePost;
