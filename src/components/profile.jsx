import { BsFillCameraFill } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      setUserId(user?.id);
      setEmail(user?.email || "");
      setName(user?.user_metadata?.name || "");
    };
    getUser();
  }, []);

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) return;

      let avatarUrl = null;

      // upload avatar if selected
      if (avatar) {
        const filePath = `${user?.id} - ${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      //   build update object dynamically

      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (avatarUrl) updates.avatar_url = avatarUrl;

      // update profile only if user want

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id);

          if (error) throw error;
        //   await supabase.auth.refreshSession();
        
      }

      // update password if provided
      if (newPassword) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (signInError) {
          alert("Current password is incorrect");
          return;
        }

        // update password
        const { error: passError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passError) throw passError;
      }
      alert("profile updated successfully 🎉");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="">
      <button
        className="flex items-center p-10 md:gap-1 cursor-pointer ml-32 text-xl text-blue-500"
        onClick={() => navigate("/")}
      >
        <BiLeftArrowAlt className="w-7" /> back
      </button>

      <div className="text-center text-4xl font-bold mb-3">Profile</div>

      <div className="w-full flex items-center justify-center ">
        <form
          onSubmit={saveChanges}
          className="w-full max-w-md bg-white shadow-2xl rounded-xl p-6 space-y-4"
        >
          <div className="flex flex-col items-center">
            <div className="rounded-full flex items-center justify-center w-24 h-24 bg-gray-200">
              {avatar ? (
                <img
                  alt="avatar"
                  src={URL.createObjectURL(avatar)}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <BsFillCameraFill className="text-xl text-gray-600" />
              )}
            </div>
            <label className="text-sm text-blue-600 hover:underline cursor-pointer">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Name"
              className="w-full  p-2 md:py-2 text-base md:text-lg border border-black rounded-xl
             focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              className="w-full  p-2 md:py-2 text-base md:text-lg border border-black rounded-xl
             focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Current Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter password"
              className="w-full  p-2 md:py-2 text-base md:text-lg border border-black rounded-xl
             focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">New Password</label>
            <input
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              placeholder="Enter new password"
              className="w-full  p-2 md:py-2 text-base md:text-lg border border-black rounded-xl
             focus:outline-none focus:ring-2 focus:ring-blue-500 
               transition duration-200"
            />
          </div>

          <div>
            <button className="text-xl bg-blue-600 hover:bg-blue-800 text-white items-center w-full rounded-xl border-2 p-2">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
