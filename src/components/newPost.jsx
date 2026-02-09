import { useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { saveDraft, reviewPost } from "../features/posts/postSlice";

const NewPost = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const isAnyfiledEmpty =
    title.trim() !== "" || excerpt.trim() !== "" || content.trim() !== "";

  const isAllFieldsFilled =
    title.trim() !== "" && excerpt.trim() !== "" && content.trim() !== "";

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
  };

  const handleSaveDraft = () => {
    dispatch(
      saveDraft({
        id: Date.now(),
        title,
        excerpt,
        content,
        authorId: 1,
        date: new Date().toLocaleDateString("en-US"),
      }),
      console.log("Draft saved!"),
    );
    toast.info("Post saved as draft!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
    resetForm();
  };
  const handleSubmit = () => {
    dispatch(
      reviewPost({
        id: Date.now(),
        title,
        excerpt,
        content,
        authorId: 1,
        date: new Date().toLocaleDateString("en-US"),
      }),
         console.log("Post submitted for review!"),
    );
    toast.success("Post send for review!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
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
