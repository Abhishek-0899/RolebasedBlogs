import { GoSignOut } from "react-icons/go";
import React, { useEffect, useState } from "react";
import img1 from "../assets/blog.png";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

const NAV_ITEMS = {
  reader: [{ label: "Dashboard", path: "/" }],
  editor: [
    { label: "Dashboard", path: "/editor/dashboard" },
    { label: "Posts", path: "/editor/posts" },
    { label: "new-posts", path: "/editor/new-posts" },
  ],
  author: [
    { label: "Dashboard", path: "/author/dashboard" },
    { label: "Posts", path: "/author/posts" },
    { label: "new-posts", path: "/author/new-posts" },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingSession,setLoadingSession]  = useState(false)

  // Get initial user session
  useEffect(() => {
    const getInitialUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      setUserId(user?.id || null);
      setUserName(user?.user_metadata?.name || null);
    };
    getInitialUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;
        setUserId(user?.id || null);
        setUserName(user?.user_metadata?.name || null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Get role
  const { role, loading } = useRole(userId || undefined);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear state
      setUserId(null);
      setUserName(null);
      setIsOpen(false);

      // Navigate to login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err.message);
      alert(err.message);
    }
  };

  const dashboardNavigate = () => {
    if (role === "author") navigate("/author/dashboard");
    else if (role === "editor") navigate("/editor/dashboard");
    else navigate("/");
  };

  return (
    <div className="relative flex justify-between items-center p-2 w-full bg-gray-200 top-0 z-50">
      {/* Logo */}
      <div
        className="flex ml-5 items-center gap-2 cursor-pointer"
        onClick={dashboardNavigate}
      >
        <img className="w-10 h-10" src={img1} alt="Logo" />
        <h1 className="font-bold text-lg">BlobHib</h1>
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden text-2xl mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6">
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

      {/* Desktop Role & Logout */}
      <div className="hidden md:flex gap-4 mr-4 items-center">
        <span className="font-semibold capitalize">{userName || "..."}</span>
        <button
          className="rounded-xl px-2 py-1 flex gap-2 items-center hover:bg-red-500"
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          <GoSignOut size={20} className="text-red-700" />
          Sign Out
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-gray-200 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 py-2" : "max-h-0"
        }`}
      >
        {!loading &&
          NAV_ITEMS[role || "reader"].map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="block w-full text-left py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              {item.label}
            </button>
          ))}

        <div className="block w-full text-left text-sm px-4 py-2 capitalize">
          {userName || "..."}
        </div>

        <button
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2">
            <GoSignOut size={18} className="text-red-700" />
            Sign Out
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
