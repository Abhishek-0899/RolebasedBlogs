import Header from "../components/Header";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import SearchBar from "../components/SeachInput";
import Pagination from "../components/Pagination.jsx";

const POSTS_PER_PAGE = 6;

const Home = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postCount, setPostCount] = useState(0);

  const fetchPublishedPosts = async () => {
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      return;
    }

    setPosts(data || []);
    setPostCount(count || 0);
  };

  useEffect(() => {
    fetchPublishedPosts();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4">
      <div className="w-full bg-white rounded-2xl shadow-md p-6">
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

        <Pagination
          page={page}
          setPage={setPage}
          totalpage={Math.ceil(postCount / POSTS_PER_PAGE)}
        />
      </div>
    </div>
  );
};

export default Home;
