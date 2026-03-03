import { useEffect, useState } from "react";
import Post from "../../components/Post";
import SearchBar from "../../components/SeachInput";
import supabase from "../../utils/supabase";

const ManagePost = () => {
  const [posts, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const todayDate = new Date().toLocaleDateString("en-US");
  const [loading, setLoading] = useState(false);

  //  fetchData Once

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_by", { ascending: false });

      if (data && !error) {
        const uniquePostMap = new Map();
        data.forEach((post) => {
          if (!uniquePostMap.has(post.id)) {
            uniquePostMap.set(post.id, post);
          }
        });
        setPost(Array.from(uniquePostMap.values()));
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 2000);
    return () => clearTimeout(handler);
  }, [search]);

  // show loading first
  if (loading) {
    return <p className="p-4 text-center text-2xl"> Loading posts.....</p>;
  }

  // Filter posts based on search input
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div className="p-10">
      <h1 className="font-bold text-3xl m-4">All post</h1>
      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Post
              key={post}
              id={post.id}
              todayDate={todayDate}
              likes={post.likes || 0}
              comments={post.comments || 0}
              title={post.title}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-4 col-span-full"> No post</p>
        )}
      </div>
    </div>
  );
};

export default ManagePost;
