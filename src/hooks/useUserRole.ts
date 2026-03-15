import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "editor" | "partner" | "supplier" | "buyer" | "user";

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (authLoading) {
      setLoading(true);
      return () => {
        isMounted = false;
      };
    }

    if (!user) {
      setRoles([]);
      setResolvedUserId(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setResolvedUserId(null);

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          console.error("Error fetching roles:", error);
          setRoles([]);
        } else {
          setRoles((data?.map((r) => r.role) as AppRole[]) || []);
        }

        setResolvedUserId(user.id);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.id]);

  const isRoleResolvedForCurrentUser = !authLoading && (!user || resolvedUserId === user.id);
  const isLoading = authLoading || loading || !isRoleResolvedForCurrentUser;

  const hasRole = (role: AppRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isEditor = hasRole("editor");
  const isPartner = hasRole("partner") || hasRole("supplier");
  const isUser = hasRole("user");

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

  return { roles, loading: isLoading, hasRole, isAdmin, isEditor, isPartner, isUser, primaryRole, dashboardRoute };
}
