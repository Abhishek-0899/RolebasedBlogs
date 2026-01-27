import { useEffect, useState } from "react"
import supabase from "../utils/supabase";

export const useRole = (userId) => {  // ← Add userId param
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (!error) setRole(data?.role);
        setLoading(false)
      })
  }, [userId])  // ← Fixed dependency

  return { role, loading }
}
