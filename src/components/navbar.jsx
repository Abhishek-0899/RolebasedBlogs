import { GoSignOut } from "react-icons/go";
import React, { useEffect, useState } from "react";
import img1 from "../assets/blog.png";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import dark from "../assets/dark.png";
import light from "../assets/light.png";

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
  const [avatar, setAvatar] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [loadingSession, setLoadingSession] = useState(true);
  const [mode, setMode] = useState("light");

  const { role, loading } = useRole(userId || undefined);

  const navItems = NAV_ITEMS[role] || NAV_ITEMS["reader"];

  const modes = [
    { type: "light", icon: light, alt: "light-mode" },
    { type: "dark", icon: dark, alt: "dark-mode" },
  ];

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);

    if (newMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  /* -------------------------------- */
  /* Fetch profile function */
  /* -------------------------------- */

  const fetchProfile = async (uid) => {
    if (!uid) return;

    const { data } = await supabase
      .from("profiles")
      // .select("name, avatar_url")
      .select("*")
      .eq("id", (await supabase.auth.getUser()).data.user.id)
      .maybeSingle();
    // console.log(data);
    setUserName(data?.name || null);
    setAvatar(data?.avatar_url || null);
  };

  /* -------------------------------- */
  /* Get initial user */
  /* -------------------------------- */

  useEffect(() => {
    const getInitialUser = async () => {
      setLoadingSession(true);

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      setUserId(user?.id || null);

      if (user?.id) {
        await fetchProfile(user.id);
      }

      setLoadingSession(false);
    };

    getInitialUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user;

        setUserId(user?.id || null);

        if (user?.id) {
          await fetchProfile(user.id);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  /* -------------------------------- */
  /* Logout */
  /* -------------------------------- */

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUserId(null);
      setUserName(null);
      setIsOpen(false);

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err.message);
      alert(err.message);
    }
  };

  /* -------------------------------- */
  /* Dashboard redirect */
  /* -------------------------------- */

  const dashboardNavigate = () => {
    if (role === "author") navigate("/author/dashboard");
    else if (role === "editor") navigate("/editor/dashboard");
    else navigate("/");
  };

  if (loadingSession || loading) return null;

  return (
    <div className="relative flex justify-between items-center p-2 w-full bg-gray-200 dark:bg-gray-900 dark:text-white top-0 z-50">
      {/* Logo */}
      <div
        className="flex ml-5 items-center gap-2 cursor-pointer"
        onClick={dashboardNavigate}
      >
        <img className="w-10 h-10" src={img1} alt="Logo" />
        <h1 className="font-bold text-lg">BlobHib</h1>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-2xl mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="rounded-xl px-3 py-2 hover:bg-blue-600 transition font-medium"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="hidden md:flex gap-4 mr-4 items-center">
        {/* Theme switch */}
        <div className="p-1 dark:bg-gray-700 bg-gray-300 rounded-lg">
          <button className="flex items-center" onClick={toggleMode}>
            {modes.map((item) => (
              <div
                key={item.type}
                className={`p-1 rounded-lg transition-all duration-200
                ${mode === item.type ? "bg-white" : ""}`}
              >
                <img src={item.icon} alt={item.alt} className="w-5" />
              </div>
            ))}
          </button>
        </div>

        {/* User section */}
        <button
          onClick={() => navigate("/profile")}
          className=" flex items-center gap-3"
        >
          <span className="font-semibold capitalize">{userName ?? "User"}</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>

        {/* Logout */}
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
        className={`md:hidden absolute top-full left-0 w-full bg-gray-200 dark:bg-gray-900 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 py-2" : "max-h-0"
        }`}
      >
        {navItems.map((item) => (
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

        <button
          onClick={() => {
            navigate("/profile");
            setIsOpen(false);
          }}
          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-blue-600"
        >
          <span className="capitalize">{userName ?? "User"}</span>
        </button>
        {/* 
        <div className="block w-full text-left text-sm px-4 py-2 capitalize">
          {userName ?? "User"}
        </div> */}

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
