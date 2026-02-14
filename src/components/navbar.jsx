import { GoSignOut } from "react-icons/go";
import React, { useEffect, useState } from "react";
import img1 from "../assets/blog.png";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

// Define navigation items for each role
const NAV_ITEMS = {
  reader: [
    { label: "Dashboard", path: "/" },
  ],
  editor: [
    { label: "Dashboard", path: "/editor/dashboard" },
    { label: "Posts", path: "/editor/posts" },
    { label: "new-posts", path: "/editor/new-posts" },
  ],
  author: [
    { label: "Dashboard", path: "/author/dashboard" },
    { label: "Posts", path: "/author/review" },
    { label: "new-posts", path: "/author/new-posts" },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
    });
  }, []);

  // Get role of the user
  const { role, loading } = useRole(userId);

  // Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      navigate("/login");
    }
  };

  const dashboardNavigate=()=>{
    if(role == "author"){
      navigate("/author/dashboard")
    }
    else if(role === "editor"){
      navigate("editor")
    }
    else{
      navigate("/")
    }
  }

  return (
    <div className="flex justify-between items-center p-2 w-full bg-gray-200 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex ml-5 items-center gap-2">
        <img className="w-10 h-10" src={img1} alt="Logo" onClick={()=>dashboardNavigate()}/>
        <h1 onClick={()=>dashboardNavigate()} className="font-bold text-lg">BlobHib</h1>
      </div>

      {/* Navigation Items */}
      <div className="flex gap-6">
        {!loading &&
          NAV_ITEMS[role || "reader"].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="rounded-xl px-3 py-2 hover:bg-blue-600 transition"
            >
              {item.label}
            </button>
          ))}
      </div>

      {/* Role and Logout */}
      <div className="flex gap-4 mr-4 items-center">
        <span className="rounded-xl px-2 py-1 bg-gray-300">
          {loading ? "..." : role?.toUpperCase()}
        </span>

        <button
          className="rounded-xl px-2 py-1 flex gap-2 items-center hover:bg-red-500"
          onClick={handleLogout}
        >
          <GoSignOut size={20} className="text-red-700" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
