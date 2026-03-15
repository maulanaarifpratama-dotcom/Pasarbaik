import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "editor" | "partner" | "supplier" | "buyer" | "user";

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    // Reset loading when user changes to prevent premature redirects
    setLoading(true);

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching roles:", error);
          setRoles([]);
        } else {
          setRoles((data?.map((r) => r.role) as AppRole[]) || []);
        }
        setLoading(false);
      });
  }, [user]);

  const hasRole = (role: AppRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isEditor = hasRole("editor");
  const isPartner = hasRole("partner") || hasRole("supplier");
  const isUser = hasRole("user");

  // Determine highest priority role for routing
  const primaryRole: AppRole | null = isAdmin
    ? "admin"
    : isEditor
    ? "editor"
    : isPartner
    ? "partner"
    : isUser
    ? "user"
    : null;

  const dashboardRoute = isAdmin
    ? "/admin"
    : isEditor
    ? "/dashboard"
    : isPartner
    ? "/partner"
    : "/";

  return { roles, loading, hasRole, isAdmin, isEditor, isPartner, isUser, primaryRole, dashboardRoute };
}
