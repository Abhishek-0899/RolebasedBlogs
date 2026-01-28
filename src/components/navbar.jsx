import { GoSignOut } from "react-icons/go";
import React, { useEffect, useState } from "react";
import img1 from "../assets/blog.png";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

const Navbar = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  // get logged In

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
    });
  }, []);

  const { role, loading } = useRole(userId);
  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
    navigate("/login");
  };
  return (
    <div className="flex justify-between items-center p-2 w-full bg-gray-200 sticky">
      <div className="flex ml-5">
        <img className="w-10 h-10" src={img1} alt="" />
        <h1>BlobHib</h1>
      </div>
      <div className="flex gap-10">
        <h1 className=" rounded-xl px-1.5 py-2 hover:bg-blue-200">dashboasr</h1>
        <h1 className=" rounded-xl px-1.5 py-2 hover:bg-blue-200">Post</h1>
      </div>

      <div className="flex gap-10 mr-4">
        <h1 className="  rounded-xl px-1.5 py-2 hover:bg-blue-200">
          {" "}
          {loading ? "..." : role?.toUpperCase()}
        </h1>

        <button
          className=" rounded-xl px-1.5 py-2 flex gap-3 hover:bg-blue-400"
          onClick={handleLogout}
        >
          <span>
            {" "}
            <GoSignOut size={22} className="text-blue-700 text-center" />
          </span>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
