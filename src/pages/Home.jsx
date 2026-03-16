import Header from "../components/Header";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import SearchBar from "../components/SeachInput";
import Pager from "../components/pager";
import Filter from "../components/Filter";

const POSTS_PER_PAGE = 6;

const Home = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postCount, setPostCount] = useState(0);
  const [filter, setFilter] = useState("Latest");

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

  const filteredPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "Latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (filter === "Oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (filter === "A-Z") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-3 sm:px-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-4 sm:p-6">

        <Header />

        {/* Search + Filter */}
        <div className="flex justify-center">
          <div className="flex w-full md:w-3/4 max-w-4xl items-center gap-3 mb-4">

            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Filter onFilterChange={(selected) => setFilter(selected)} />
            </div>

          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No published post
            </p>
          ) : (
            filteredPosts.map((post) => (
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

        {/* Pagination */}
        <Pager
          page={page}
          setPage={setPage}
          totalpage={Math.ceil(postCount / POSTS_PER_PAGE)}
        />
        
      </div>
    </div>
  );
};

export default Home;