import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase otomatis handle token dari URL hash
      // Kita tinggal tunggu session ter-populate
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error(error.message || "Gagal memverifikasi sesi");
        navigate("/login");
        return;
      }

      if (!data.session) {
        // Session belum ada — mungkin token expired atau invalid
        toast.error("Link verifikasi tidak valid atau sudah kedaluwarsa");
        navigate("/login");
        return;
      }

      const userId = data.session.user.id;

        // Fetch role dari tabel user_roles dan nama dari profiles
      try {
          const [{ data: userRoles, error: rolesError }, { data: profile }] = await Promise.all([
            supabase.from("user_roles").select("role").eq("user_id", userId),
            supabase.from("profiles").select("name").eq("user_id", userId).maybeSingle(),
          ]);

          if (rolesError) {
            // Role belum ada — kemungkinan trigger handle_auto_admin belum jalan
          // Atau ada race condition. Retry sekali lagi.
          await new Promise((resolve) => setTimeout(resolve, 500));
          
            const { data: retryRoles } = await supabase
              .from("user_roles")
            .select("role")
              .eq("user_id", userId);

            const retryRoleList = retryRoles?.map((item) => item.role) || [];
            const role = getPrimaryRole(retryRoleList);
          redirectByRole(role);
          return;
        }

          toast.success(`Selamat datang${profile?.name ? `, ${profile.name}` : ""}!`);
          redirectByRole(getPrimaryRole(userRoles?.map((item) => item.role) || []));
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat profil");
        navigate("/");
      }
    };

    const getPrimaryRole = (roles: string[]) => {
      if (roles.includes("admin")) return "admin";
      if (roles.includes("partner") || roles.includes("supplier")) return "supplier";
      return "buyer";
    };

    const redirectByRole = (role: string) => {
      if (role === "admin") navigate("/admin");
      else if (role === "supplier" || role === "partner") navigate("/partner");
      else navigate("/dashboard"); // default untuk buyer
    };

    handleCallback();
  }, [navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Memverifikasi akun kamu...</p>
      </div>
    </main>
  );
}
