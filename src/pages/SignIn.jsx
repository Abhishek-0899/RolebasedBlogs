import { use, useState } from "react";
import img1 from "../assets/blog.png";
import "../index.css";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [options, setoption] = useState("Reader");

  const roles = ["Reader", "Author", "Editor"];
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setloading(true);

    const { error } = await supabase.auth.signUp({
      email,
      name,
      password,
    });
    setloading(false);
    if (error) {
      alert(error.message);
      return;
    }
    navigate("/");
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
            value={options}
            onChange={(e) => setoption(e.target.value)}
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
