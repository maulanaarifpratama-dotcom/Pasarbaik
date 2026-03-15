import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data: signInData, error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        const signedInUser = signInData?.user ?? (await supabase.auth.getUser()).data.user;

        if (signedInUser) {
          const { data: roles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", signedInUser.id);

          if (rolesError) {
            toast.error(rolesError.message);
            navigate("/");
          } else {
            const roleList = roles?.map(r => r.role) || [];
            if (roleList.includes("admin")) navigate("/admin");
            else if (roleList.includes("partner") || roleList.includes("supplier")) navigate("/partner");
            else if (roleList.includes("editor")) navigate("/dashboard");
            else navigate("/");
          }
        } else {
          navigate("/");
        }
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
