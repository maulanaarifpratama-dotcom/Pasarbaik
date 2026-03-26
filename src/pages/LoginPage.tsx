import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error(error.message || "Apple sign-in failed");
      setAppleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data: signInData, error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully!");

      const signedInUser = signInData?.user ?? (await supabase.auth.getUser()).data.user;

      if (!signedInUser) {
        navigate("/");
        setLoading(false);
        return;
      }

      const fetchRoles = async (attempt = 0): Promise<string[]> => {
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", signedInUser.id);

        if (rolesError) {
          throw rolesError;
        }

        const roleList = roles?.map((r) => r.role) || [];

        if (roleList.length === 0 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return fetchRoles(attempt + 1);
        }

        return roleList;
      };

      try {
        const roleList = await fetchRoles();

        if (roleList.includes("admin")) navigate("/admin");
        else if (roleList.includes("partner") || roleList.includes("supplier")) navigate("/partner");
        else if (roleList.includes("editor")) navigate("/dashboard");
        else navigate("/");
      } catch (rolesError: any) {
        toast.error(rolesError.message || "Failed to load user roles");
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to confirm.");
      }
    }

    setLoading(false);
  };

  return (
    <main className="pt-16 min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-card rounded-xl border border-border shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="text-primary" size={24} />
            </div>
            <h1 className="font-display text-2xl font-bold text-card-foreground">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Access the PasarBaik platform" : "Join the impact supply ecosystem"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
