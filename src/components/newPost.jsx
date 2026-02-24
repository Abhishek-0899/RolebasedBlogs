import { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../features/posts/postSlice";
import { useLocation } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../hooks/useAuth";
import supabase from "../utils/supabase";

const NewPost = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useAuth();
  const { role } = useRole();

  const post = location?.state?.post;
  const isPublished = post?.status === "published";
  
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const isAnyfiledEmpty =
    title.trim() !== "" || excerpt.trim() !== "" || content.trim() !== "";

  const isAllFieldsFilled =
    title.trim() !== "" && excerpt.trim() !== "" && content.trim() !== "";

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
    }
  }, [post]);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        excerpt,
        content,
        created_by: user.id,
        status: "draft",
      },
    ])
    .select()
    .single();
    console.log("data : ", data);
    if (error) {
      console.log(error);
      toast.error("Error saving draft", { theme: "colored" });
      return;
    }
    
    toast.info("Post saved as draft!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
    
    // ✅ Fetch fresh posts from Supabase instead of local dispatch
    dispatch(fetchPosts());
    resetForm();
  };

  const handleSubmit = async () => {
    if (!user) return;
    const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        excerpt,
        content,
        created_by: user?.id,
        status: role === "editor" ? "published" : "pending",
      },
    ])
    .select().single();
    
    if (error) {
      console.log(error);
      toast.error("Error in submitting post", { theme: "colored" });
      return;
    }
    
    console.log("data : ", data);
    toast.success("Post send for review!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
    
    // ✅ Fetch fresh posts from Supabase instead of local dispatch
    dispatch(fetchPosts());
    resetForm();
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
        pauseOnHover
      />
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-3xl mx-auto space-y-6 bg-white bg-shadow-md p-8 rounded-lg">
          <h1 className="text-3xl font-bold">Create New Post</h1>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-medium">Title</label>
            <textarea
              rows={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={isPublished}
              className={`w-full h-16 px-3 py-2 border-2 rounded-lg text-base resize-none overflow-hidden ${isPublished ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter post title..."
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="font-medium">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              readOnly={isPublished}
              className={`w-full h-20 px-3 py-2 border-2 rounded-lg text-base resize-none ${isPublished ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Brief summary of your post..."
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={isPublished}
              className={`w-full min-h-[160px] px-3 py-2 border-2 rounded-lg text-base ${isPublished ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Write your post content here..."
            />
          </div>
          <hr className="border-1" />

          {isPublished && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✓ This post has been published and is now read-only.
            </div>
          )}

          <div className="flex gap-4">
            <button
              disabled={!isAnyfiledEmpty || isPublished}
              className={`flex items-center bg-gray-700 text-white gap-2 p-2 border rounded-xl 
                  ${!isAnyfiledEmpty || isPublished ? "disabled:opacity-50 cursor-not-allowed" : "hover:bg-gray-900"}
                `}
              onClick={handleSaveDraft}
            >
              <TfiSave />
              Save Draft
            </button>
            <button
              disabled={!isAllFieldsFilled || isPublished}
              className={`flex items-center bg-gray-700 text-white gap-2 p-2 border rounded-xl 
                    ${isAllFieldsFilled && !isPublished ? "hover:bg-gray-900" : "disabled:opacity-50 cursor-not-allowed"}
                `}
              onClick={handleSubmit}
            >
              <CiLocationArrow1 />
              Submit for review
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;
