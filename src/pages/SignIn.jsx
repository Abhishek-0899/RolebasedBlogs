import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);

  const roles = ["reader", "author", "editor"];

  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setloading(true);

    // ✅ STEP 1: Create user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (authError) {
      alert(authError.message);
      setloading(false);
      return;
    }

    const user = data.user;
    const session = data.session;

    if (!user) {
      alert("Signup failed");
      setloading(false);
      return;
    }

    if (!session) {
      alert("please verify credentials");
      setloading(false);
      return;
    }
    const userId = data.user?.id;

    console.log("🔥 START INSERT:", { userId, name, role: role.toLowerCase() });

    // ✅ STEP 2: Insert into profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        role: role.toLowerCase(),
        name: name,
        email : user.email
      })
      .maybeSingle();

    if (profileError) {
      console.error("💥 FULL ERROR:", profileError);
      alert("Profile failed: " + profileError.message);
      setloading(false);
      return;
    }

    console.log("✅ SUCCESS - Check table!");
    alert("Profile created! Check Supabase table.");

    // ✅ STEP 3: Role-based navigation
    const roleRoute = {
      reader: "/",
      editor: "/editor/dashboard",
      author: "/author/dashboard",
    };

    // Debug logs
    console.log("Selected role (state):", role);
    console.log("Role lowercase:", role?.toLowerCase());
    console.log("Navigating to:", roleRoute[role?.toLowerCase()] || "/");

    // Navigate to role dashboard
    navigate(roleRoute[role?.toLowerCase()] || "/");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-200 p-5">
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

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="text-left">
            <label className="block text-gray-600 text-sm mb-1">
              Full Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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

          {/* Role select */}
          <div className="relative text-left" ref={dropdownRef}>
            <label className="block text-gray-600 text-sm mb-1">
              Select Role
            </label>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left"
            >
              <div className="flex justify-between">
                <span className="capitalize">{role}</span>
              <span
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              >
                ▼
              </span>
              </div>
            </button>

            {open && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {roles.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setRole(item);
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 w-full text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition hover:scale-105 active:scale-95 duration-200 ease-in-out"
          >
            {loading ? "Create an Account...." : "Create an Account"}
          </button>

          <p className="text-sm">
            Already have an account?{" "}
            <button
            type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline hover:scale-105 active:scale-95 transition duration-200 ease-in-out"
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
