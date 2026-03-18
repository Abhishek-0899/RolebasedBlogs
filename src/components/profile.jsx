import { BsFillCameraFill } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { ToastContainer,toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState(null); // new uploaded file
  const [avatarUrl, setAvatarUrl] = useState(null); // stored avatar url
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) return;

      setUserId(user?.id);
      setEmail(user?.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user?.id)
        .single();

      setName(profile?.name || "");
      setAvatarUrl(profile?.avatar_url || null);
    };

    getUser();
  }, []);

  const saveChanges = async (e) => {
    e.preventDefault();

    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) return;

      let avatarPublicUrl = null;

      // upload avatar
      if (avatar) {
        const filePath = `${user?.id}-${Date.now()}`;
        const { data: buckets } = await supabase.storage.listBuckets();
        console.log(buckets);
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarPublicUrl = publicUrlData.publicUrl;
      }

      // build update object
      const updates = {};

      if (name) updates.name = name;
      if (email) updates.email = email;
      if (avatarPublicUrl) updates.avatar_url = avatarPublicUrl;

      // update profile table
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user?.id);

        if (error) throw error;

        if (updates.name) setName(updates.name);
        if (updates.email) setEmail(updates.email);
        if (avatarPublicUrl) setAvatarUrl(avatarPublicUrl);
      }

      // password change
      if (newPassword && password) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (signInError) {
          toast.error("Current password incorrect");
          return;
        }

        const { error: passError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passError) throw passError;
      }

      toast.success("Profile updated successfully 🎉");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
   <ToastContainer/>
    <div className="min-h-screen bg-gray-100 px-4">
      <button
        className="flex items-center p-10 gap-1 cursor-pointer ml-0 sm:ml-32 text-lg sm:text-xl text-blue-500"
        onClick={() => navigate("/")}
      >
        <BiLeftArrowAlt className="sm:w-7 w-4" /> back
      </button>

      <div className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        Profile
      </div>

      <div className="flex items-center justify-center">
        <form
          onSubmit={saveChanges}
          className="w-full max-w-md bg-white shadow-2xl rounded-xl sm:p-6 p-5 space-y-4"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div
              className="rounded-full flex items-center justify-center
             w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 overflow-hidden"
            >
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                <BsFillCameraFill className="text-xl text-gray-600" />
              )}
            </div>

            <label className="text-sm text-blue-600 hover:underline cursor-pointer mt-2">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-black rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-black rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <label>Current Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-black rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-black rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save */}
          <button className="text-xl bg-blue-600 hover:bg-blue-800 text-white w-full rounded-xl p-2">
            Save Changes
          </button>
        </form>
      </div>
    </div>
     </>
  );
};

export default Profile;
