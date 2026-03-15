import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Suppliers", path: "/suppliers" },
  { label: "Programs", path: "/programs" },
  { label: "Impact", path: "/impact" },
  { label: "About", path: "/about" },
];

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === "/" || location.pathname === "/home";
  const { user, signOut } = useAuth();
  const { isAdmin, isEditor, isPartner } = useUserRole();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors ${isHome ? "bg-primary/80 backdrop-blur-md" : "bg-primary shadow-md"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-primary-foreground font-display text-xl font-bold tracking-tight">
          PasarBaik
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path ? "text-accent" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              {(isAdmin || isEditor) && (
                <Link to="/admin">
                  <Button variant="hero-outline" size="sm" className="ml-2">Admin Panel</Button>
                </Link>
              )}
              {isPartner && (
                <Link to="/dashboard">
                  <Button variant="hero-outline" size="sm" className="ml-1">Dashboard</Button>
                </Link>
              )}
              <Button variant="hero" size="sm" className="ml-1" onClick={signOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="hero-outline" size="sm" className="ml-2">Sign In</Button>
              </Link>
              <Link to="/rfq">
                <Button variant="hero" size="sm" className="ml-1">Request Quote</Button>
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10 pb-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-medium ${location.pathname === item.path ? "text-accent" : "text-primary-foreground/80"}`}>
              {item.label}
            </Link>
          ))}
          <div className="px-6 pt-2 space-y-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="hero-outline" size="sm" className="w-full">Admin Panel</Button>
                  </Link>
                )}
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero-outline" size="sm" className="w-full">Dashboard</Button>
                </Link>
                <Button variant="hero" size="sm" className="w-full" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero-outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/rfq" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">Request Quote</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
