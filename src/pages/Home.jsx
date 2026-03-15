import Header from "../components/Header";
import Post from "../components/Post";
import SearchBar from "../components/SeachInput";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

const Home = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);

  const fetchPublishedPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*",)
      .eq("status", "published")
      .order("created_at", { ascending: true });
      console.log(data.count)
    if (error) {
      console.error(error);
      return;
    }
    setPosts(data);
  };
  useEffect(() => {
    fetchPublishedPosts();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4">
      <div className="w-full  bg-white rounded-2xl shadow-md p-6">
        <Header />

        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="grid grid-cols-3 gap-4 mt-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400">No published post</p>
          ) : (
            posts
              .filter((post) =>
                post.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  comments={post.comments}
                  likes={post.likes}
                  todayDate={new Date(post.created_at).toLocaleDateString()}
                  userId={post.created_by}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
