import { useState } from "react";
import img1 from "../assets/blog.png";
import "../index.css";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) return;

    // ✅ Fetch role from profiles table

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (profileError) {
      alert("Failed to get user role: " + profileError.message);
      return;
    }

    const role = profileData?.role || "reader";

    const roleRoute = {
      author: "/author/dashboard",
      editor: "/editor/dashboard",
    };
    navigate(roleRoute[role] || "/");
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-200 overflow-hidden">
      <div className="bg-white shadow-xl w-full max-w-md p-8 rounded-xl text-center ">
        <img
          src={img1}
          alt="Blog logo"
          className="mx-auto mb-4 w-32 sm:p-3 h-auto"
        />

        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-6">
          Sign in to your account to continue
        </p>

        <form className="space-y-4">
          <div className="text-left">
            <label className="block text-gray-600 text-sm mb-1">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg 
                       font-medium hover:bg-blue-700 transition duration-200 ease-in-out hover:scale-105 active:scale-95"
          >
            Sign In
          </button>

          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/SignIn")}
              className="text-blue-500 cursor-pointer hover:underline transition duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
