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

      // Fetch role dari profiles table
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", userId)
          .single();

        if (profileError) {
          // Profile belum ada — kemungkinan trigger handle_new_user belum jalan
          // Atau ada race condition. Retry sekali lagi.
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const { data: retryProfile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

          const role = retryProfile?.role || "buyer";
          redirectByRole(role);
          return;
        }

        toast.success(`Selamat datang${profile.full_name ? `, ${profile.full_name}` : ""}!`);
        redirectByRole(profile.role || "buyer");
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat profil");
        navigate("/");
      }
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
