import { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../features/posts/postSlice";
import { useParams } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../hooks/useAuth";
import supabase from "../utils/supabase";

const NewPost = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user } = useAuth();
  const { role } = useRole(user?.id);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [postStatus, setPostStatus] = useState(null);

  const isPublished = postStatus === "published";

  const isAnyFieldFilled =
    title.trim() !== "" ||
    excerpt.trim() !== "" ||
    content.trim() !== "";

  const isAllFieldsFilled =
    title.trim() !== "" &&
    excerpt.trim() !== "" &&
    content.trim() !== "";

  // 🔥 Fetch post if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        toast.error("Error loading post");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setPostStatus(data.status);

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setPostStatus(null);
  };

  const handleSaveDraft = async () => {
    if (!user) return;

    const payload = {
      title,
      excerpt,
      content,
      status: "draft",
    };

    let query;

    if (id) {
      query = supabase
        .from("posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
    } else {
      query = supabase
        .from("posts")
        .insert({
          ...payload,
          created_by: user.id,
        })
        .select()
        .single();
    }

    const { error } = await query;

    if (error) {
      toast.error("Error saving draft");
      return;
    }

    toast.info("Post saved as draft!", { theme: "colored" });

    dispatch(fetchPosts());
    if (!id) resetForm();
  };

  const handleSubmit = async () => {
    if (!user) return;

    const newStatus = role === "editor" ? "published" : "pending";

    const payload = {
      title,
      excerpt,
      content,
      status: newStatus,
    };

    let query;

    if (id) {
      query = supabase
        .from("posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
    } else {
      query = supabase
        .from("posts")
        .insert({
          ...payload,
          created_by: user.id,
        })
        .select()
        .single();
    }

    const { error } = await query;

    if (error) {
      toast.error("Error submitting post");
      return;
    }

    toast.success(
      role === "editor"
        ? "Post published!"
        : "Post sent for review!",
      { theme: "colored" }
    );

    dispatch(fetchPosts());
    if (!id) resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gray-100 overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-6 bg-white shadow-md md:p-8 p-4 rounded-lg">
          <h1 className="md:text-5xl text-2xl font-bold">
            {id ? "Edit Post" : "Create New Post"}
          </h1>

          <div>
            <label className="font-bold text-xl">Title</label>
            <textarea
              rows={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={isPublished}
              className={`w-full h-16 px-3 py-2 border-2 rounded-lg resize-none ${
                isPublished ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Enter post title..."
            />
          </div>

          <div>
            <label className="font-bold text-xl">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              readOnly={isPublished}
              className={`w-full h-20 px-3 py-2 border-2 rounded-lg ${
                isPublished ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Brief summary..."
            />
          </div>

          <div>
            <label className="font-bold text-xl">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={isPublished}
              className={`w-full min-h-[160px] px-3 py-2 border-2 rounded-lg ${
                isPublished ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Write your content..."
            />
          </div>

          {isPublished && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✓ This post is published and read-only.
            </div>
          )}

          <div className="flex gap-4">
            <button
              disabled={!isAnyFieldFilled || isPublished}
              onClick={handleSaveDraft}
              className={`flex items-center gap-2 bg-gray-700 text-white p-2 rounded-xl ${
                !isAnyFieldFilled || isPublished
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-900"
              }`}
            >
              <TfiSave />
              Save Draft
            </button>

            <button
              disabled={!isAllFieldsFilled || isPublished}
              onClick={handleSubmit}
              className={`flex items-center gap-2 bg-gray-700 text-white p-2 rounded-xl ${
                !isAllFieldsFilled || isPublished
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-900"
              }`}
            >
              <CiLocationArrow1 />
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;