import { useEffect, useState } from "react";
import Post from "../../components/Post";
import supabase from "../../utils/supabase";
import SearchBar from "../../components/SeachInput";
import Pager from "../../components/pager";
import Filter from "../../components/Filter";

const POSTS_PER_PAGE = 6;

const ManagePost = () => {
  const [posts, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [postCount, setPostCount] = useState(0);

  const [filter, setFilter] = useState("Latest");
  //  fetchData Once

  const fetchPosts = async () => {
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    setLoading(true);
    let query = supabase.from("posts").select("*", { count: "exact" });

    if (filter === "Latest") {
      query = query.order("created_at", { ascending: false });
    }
    if (filter === "Oldest") {
      query = query.order("created_at", { ascending: true });
    }
    if (filter === "A-Z") {
      query = query.order("title", { ascending: true });
    }

    const { data, error, count } = await query.range(from, to);

    if (data && !error) {
      const uniquePostMap = new Map();
      data.forEach((post) => {
        if (!uniquePostMap.has(post.id)) {
          uniquePostMap.set(post.id, post);
        }
      });
      setPost(Array.from(uniquePostMap.values()));
      setPostCount(count);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchPosts();
  }, [page, filter]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
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
      <div className="flex justify-center">
        <div className="flex w-3/4 max-w-4xl items-center gap-4">
          <div className="w-3/4">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-1/4">
            <Filter onfilterChange={(selected) => setFilter(selected)} />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
        {filteredPosts.length > 0 ? (
          filteredPosts
            .sort((a, b) => {
              if (filter === "Latest") {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              if (filter === "Oldest") {
                return new Date(a.created_at) - new Date(b.created_at);
              } else if (filter === "A-Z") {
                return a.title.localeCompare(b.title);
              }
            })

            .map((post) => (
              <Post
                key={post}
                id={post.id}
                todayDate={new Date(post.created_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
                likes={post.likes || 0}
                comments={post.comments || 0}
                title={post.title}
                userId={post.created_by}
              />
            ))
        ) : (
          <p className="text-gray-500 mt-4 col-span-full text-center font-bold text-xl">
            {" "}
            No post
          </p>
        )}
      </div>
      {filteredPosts.length > 0 && (
        <Pager
          page={page}
          setPage={setPage}
          totalpage={Math.ceil(postCount / POSTS_PER_PAGE)}
        />
      )}
    </div>
  );
};

export default ManagePost;
