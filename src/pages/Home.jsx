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

    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("status", "published");

    // ✅ DB-level sorting (IMPORTANT)
    if (filter === "Latest") {
      query = query.order("created_at", { ascending: false });
    } else if (filter === "Oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (filter === "A-Z") {
      query = query.order("title", { ascending: true });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error(error);
      return;
    }

    setPosts(data || []);
    setPostCount(count || 0);
  };

  // ✅ refetch on page + filter
  useEffect(() => {
    fetchPublishedPosts();
  }, [page, filter]);

  // ✅ reset page when filter OR search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  // ✅ ONLY filter here (no sorting)
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

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
              <Filter onfilterChange={(selected) => setFilter(selected)} />
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
                todayDate={new Date(post.created_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
                userId={post.created_by}
              />
            ))
          )}
        </div>

        {/* Pagination (hide if no posts after search) */}
        {filteredPosts.length > 0 && (
          <Pager
            page={page}
            setPage={setPage}
            totalpage={Math.ceil(postCount / POSTS_PER_PAGE)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;