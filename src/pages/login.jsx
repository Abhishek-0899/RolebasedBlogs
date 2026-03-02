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

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

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
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-200 px-4">
      <div className="bg-white shadow-xl w-full max-w-md md:max-w-xl lg:max-w-2xl p-8 md:p-12 rounded-2xl text-center">
        <img
          src={img1}
          alt="Blog logo"
          className="mx-auto mb-6 w-28 sm:w-32 md:w-40 h-auto"
        />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-sm sm:text-base mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label className="block text-gray-700 text-base md:text-lg font-medium mb-2">
              {" "}
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 sm:py-3 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label className="block text-gray-700 text-base md:text-lg font-medium mb-2">
              {" "}
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3 md:py-4 text-base md:text-lg border border-gray-300 rounded-xl 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg 
                       font-medium hover:bg-blue-700 transition duration-200 
                       ease-in-out hover:scale-105 active:scale-95"
          >
            Sign In
          </button>

          <p className="text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/SignIn")}
              className="text-blue-500 hover:underline transition"
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
