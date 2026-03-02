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

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError) {
      alert(authError.message);
      setloading(false);
      return;
    }

    const user = data.user;
    const session = data.session;

    if (!user || !session) {
      alert("Signup failed or verify email first");
      setloading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      role: role.toLowerCase(),
      name,
      email: user.email,
    });

    if (profileError) {
      alert("Profile failed: " + profileError.message);
      setloading(false);
      return;
    }

    const roleRoute = {
      reader: "/",
      editor: "/editor/dashboard",
      author: "/author/dashboard",
    };

    navigate(roleRoute[role.toLowerCase()] || "/");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-xl lg:max-w-2xl p-8 md:p-12 text-center">
        <img
          src={img1}
          alt="Blog logo"
          className="mx-auto mb-6 w-28 sm:w-32 md:w-40 h-auto"
        />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Create Account
        </h1>

        <p className="text-gray-500 text-sm sm:text-base mb-8">
          Join our blog platform today
        </p>

        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="text-left">
            <label className="block text-gray-700 text-base md:text-lg font-medium mb-2">
              Full Name
            </label>
            <input
className="w-full px-5 py-3 md:py-4 text-base md:text-lg border border-gray-300 rounded-xl 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="text-left">
            <label className="block text-gray-700 text-base md:text-lg font-medium mb-2">
              Email
            </label>
            <input
              className="w-full px-5 py-3 md:py-4 text-base md:text-lg border border-gray-300 rounded-xl 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xyz@gmail.com"
            />
          </div>

          <div className="text-left">
            <label className="block text-gray-700 text-base md:text-lg font-medium mb-2">
              Password
            </label>
            <input
className="w-full px-5 py-3 md:py-4 text-base md:text-lg border border-gray-300 rounded-xl 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Role dropdown */}
          <div className="relative text-left" ref={dropdownRef}>
            <label className="block text-gray-600 text-sm sm:text-base mb-1">
              Select Role
            </label>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-left"
            >
              <div className="flex justify-between items-center">
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
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer capitalize"
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
            className="bg-blue-600 w-full text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition hover:scale-105 active:scale-95 duration-200"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-sm sm:text-base">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline transition"
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
