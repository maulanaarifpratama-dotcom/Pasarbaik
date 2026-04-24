import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function LoginPage() {
  const [mode, setMode] = useState<"magiclink" | "password">("magiclink");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: !isLogin && name ? { full_name: name } : undefined,
      },
    });

    if (error) {
      toast.error(error.message || "Gagal mengirim magic link");
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    toast.success("Magic link terkirim! Cek email kamu.");
    setLoading(false);
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Berhasil masuk!");

      const signedInUser = signInData?.user;
      if (!signedInUser) {
        navigate("/");
        setLoading(false);
        return;
      }

      await redirectByRole(signedInUser.id);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: name },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Akun berhasil dibuat! Cek email untuk konfirmasi.");
      }
    }

    setLoading(false);
  };

  const redirectByRole = async (userId: string) => {
    try {
      // Fetch role dari tabel user_roles (primary source)
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      const roles = userRoles?.map((item) => item.role) || [];
      const role = roles.includes("admin")
        ? "admin"
        : roles.includes("partner") || roles.includes("supplier")
        ? "supplier"
        : "buyer";

      if (role === "admin") navigate("/admin");
      else if (role === "supplier") navigate("/supplier");
      else navigate("/marketplace"); // default: buyer
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data user");
      navigate("/");
    }
  };

  // State: magic link sudah terkirim
  if (magicLinkSent) {
    return (
      <main className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <h1 className="font-display text-2xl font-bold text-card-foreground">Cek Email Kamu</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Kami sudah kirim magic link ke <strong>{email}</strong>. Klik link tersebut untuk masuk ke PasarBaik.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Link berlaku 1 jam. Tidak terima email? Cek folder spam.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setMagicLinkSent(false);
                setEmail("");
              }}
            >
              Kembali
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-card rounded-xl border border-border shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="text-primary" size={24} />
            </div>
            <h1 className="font-display text-2xl font-bold text-card-foreground">{isLogin ? "Masuk" : "Buat Akun"}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Masuk ke platform PasarBaik" : "Bergabung ke ekosistem impact supply"}
            </p>
          </div>

          {/* Toggle mode: magic link vs password */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setMode("magiclink")}
              className={`flex-1 text-sm py-2 rounded-md transition ${
                mode === "magiclink" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex-1 text-sm py-2 rounded-md transition ${
                mode === "password" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              Password
            </button>
          </div>

          {mode === "magiclink" ? (
            <form onSubmit={handleMagicLink} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email-magic">Email</Label>
                <Input
                  id="email-magic"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Magic Link"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Kami akan kirim link ke email kamu. Tidak perlu password.
              </p>
            </form>
          ) : (
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name-pw">Nama Lengkap</Label>
                  <Input id="name-pw" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email-pw">Email</Label>
                <Input
                  id="email-pw"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Memproses..." : isLogin ? "Masuk" : "Buat Akun"}
              </Button>
            </form>
          )}

          <div className="text-center mt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
              {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
