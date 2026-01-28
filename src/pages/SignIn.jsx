import { useState } from "react";
import img1 from "../assets/blog.png";
import "../index.css";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [role, setRole] = useState("reader");

  const roles = ["reader", "author", "editor"];

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setloading(true);

    // ✅ STEP 1: Create user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    // ✅ STEP 2: Edge cases

    if (authError) {
      alert(authError.message);
      setloading(false);
      return;
    }
  
    const userId = data.user?.id;

    console.log("🔥 START INSERT:", { userId, name, role: role.toLowerCase() });

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        role: role.toLowerCase(),
      })
      .select();

    
    // console.log("📊 INSERT RESULT:", { profileData, profileError }); // 🔥 CRITICAL

    if (profileError) {
      console.error("💥 FULL ERROR:", profileError);
      alert("Profile failed: " + profileError.message);
      setloading(false);
      return;
    }

    console.log("✅ SUCCESS - Check table!");
    alert("Profile created! Check Supabase table.");
    const roleRoute = {
      reader : "/",
      editor: "/editor/dashboard",
      author : "/author/dashboard"
    }

    navigate(roleRoute[role] || "/")
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-200 overflow-hidden">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full text-center">
        <img
          src={img1}
          alt="Blog logo"
          className="mx-auto mb-4 w-32 sm:p-3 h-auto"
        />

        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="text-gray-500 text-sm mb-6">
          Join our blog platform today
        </p>

        <form className="space-y-4">
          <div className="text-left">
            <label className="block text-gray-600 text-sm mb-1">
              Full Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jonn doe"
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xyz@gmail.com"
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {/* role based buttons */}
          <select
            className="w-full px-4 py-2 border rounded-lg bg-white
             focus:outline-none focus:ring-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((item) => (
              <option
                className=" text-blue-900 rounded-lg w-full font-extrabold"
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            onClick={handleSignUp}
            className="bg-blue-600 w-full text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition hover:scale-105 active:scale-95
            duration-200 ease-in-out"
          >
            {loading ? "Create an Account...." : "Create an Account"}
          </button>

          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline hover:scale-105 active:scale-95
              transition
            duration-200 ease-in-out"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
