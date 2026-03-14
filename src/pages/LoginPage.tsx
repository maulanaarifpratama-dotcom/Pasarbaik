import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Login functionality requires backend integration with Lovable Cloud.");
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
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org">Organization</Label>
                  <Input id="org" placeholder="Company or organization name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select id="role" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground">
                    <option value="buyer">Corporate Buyer</option>
                    <option value="supplier">Supplier / UMKM</option>
                    <option value="csr">CSR / NGO Partner</option>
                  </select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
