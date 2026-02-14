import { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { saveDraft, reviewPost } from "../features/posts/postSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../hooks/useAuth";

const NewPost = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()

const { user } = useAuth();
const { role } = useRole();

  const post = location?.state?.post;
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const isAnyfiledEmpty =
  title.trim() !== "" || excerpt.trim() !== "" || content.trim() !== "";
  
  const isAllFieldsFilled =
  title.trim() !== "" && excerpt.trim() !== "" && content.trim() !== "";
  
  const postId = post?.id || Date.now();
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
    }
  }, [post]);
  
  const currentUserId = user?.role;
 
  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
  };

  const buildPayload = () => ({
    id: postId,
    title,
    excerpt,
    content,
    authorId: currentUserId,
    date: post?.date ?? new Date().toLocaleDateString("en-US"),
  });

  const handleSaveDraft = () => {
    const payload = buildPayload();
    dispatch(saveDraft(payload));
    // console.log("Saving Draft:", payload);
    toast.info("Post saved as draft!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
    // console.log("role",role)
    resetForm();
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    dispatch(reviewPost(payload));
    toast.success("Post send for review!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
      // navigate(`/${role}/dashboard`)

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
              className=" w-full h-16 px-3 py-2 border-2 rounded-lg text-base resize-none overflow-hidden"
              placeholder="Enter post title..."
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="font-medium">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full h-20 px-3 py-2 border-2 rounded-lg text-base resize-none"
              placeholder="Brief summary of your post..."
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[160px] px-3 py-2 border-2 rounded-lg text-base"
              placeholder="Write your post content here..."
            />
          </div>
          <hr className="border-1" />

          <div className="flex gap-4">
            <button
              disabled={!isAnyfiledEmpty}
              className={`flex items-center bg-gray-700 text-white gap-2 p-2 border rounded-xl 
                  ${!isAnyfiledEmpty ? "hover:bg-gray-900" : "disabled:opacity-50 cursor-not-allowed"}
                `}
              onClick={handleSaveDraft}
            >
              <TfiSave />
              Save Draft
            </button>
            <button
              disabled={!isAllFieldsFilled}
              className={`flex items-center bg-gray-700 text-white gap-2 p-2 border rounded-xl 
                    ${isAllFieldsFilled ? "hover:bg-gray-900" : "disabled:opacity-50 cursor-not-allowed"}
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
