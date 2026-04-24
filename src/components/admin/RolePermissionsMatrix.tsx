import { Badge } from "@/components/ui/badge";
import type { AppRole } from "@/hooks/useUserRole";
import { CheckCircle2, CircleMinus } from "lucide-react";

const ROLES: { key: AppRole; label: string }[] = [
  { key: "admin", label: "Admin" },
  { key: "editor", label: "Editor" },
  { key: "partner", label: "Partner" },
  { key: "supplier", label: "Supplier" },
  { key: "buyer", label: "Buyer" },
  { key: "user", label: "User" },
];

const PERMISSIONS: { label: string; roles: AppRole[] }[] = [
  { label: "Akses admin dashboard", roles: ["admin", "editor"] },
  { label: "Kelola role pengguna", roles: ["admin"] },
  { label: "Kelola katalog produk", roles: ["admin", "editor", "partner", "supplier"] },
  { label: "Kelola supplier dan program", roles: ["admin", "editor"] },
  { label: "Kelola RFQ dan order", roles: ["admin", "partner", "supplier"] },
  { label: "Lihat katalog publik", roles: ["admin", "editor", "partner", "supplier", "buyer", "user"] },
];

export function RolePermissionsMatrix() {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <h3 className="font-display text-xl font-bold text-foreground">Izin per Role</h3>
        <p className="text-sm text-muted-foreground">Hak akses mengikuti role yang ditetapkan pada pengguna.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left font-semibold">Izin</th>
              {ROLES.map((role) => (
                <th key={role.key} className="p-4 text-center font-semibold">
                  <Badge variant="outline" className="bg-background text-foreground">
                    {role.label}
                  </Badge>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((permission) => (
              <tr key={permission.label} className="border-t border-border">
                <td className="p-4 font-medium text-foreground">{permission.label}</td>
                {ROLES.map((role) => {
                  const allowed = permission.roles.includes(role.key);
                  return (
                    <td key={role.key} className="p-4 text-center">
                      {allowed ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-primary" />
                      ) : (
                        <CircleMinus className="mx-auto h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}