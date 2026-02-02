import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import supabase from "../utils/supabase";
import { useState } from "react";

const RequireRole = ({ role: requiredRole, children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(data?.role || null);
      setLoading(false);
    };

    getRole();
  }, []);

  // ⏳ WAIT — DO NOT REDIRECT YET
  if (loading) return null; // or loader


  // ✅ Allowed
  return children || <Outlet />;
};

export default RequireRole;
