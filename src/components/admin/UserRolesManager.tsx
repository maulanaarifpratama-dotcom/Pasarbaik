import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Shield, ShieldCheck, UserCheck, User } from "lucide-react";
import type { AppRole } from "@/hooks/useUserRole";

const ALL_ROLES: AppRole[] = ["admin", "editor", "partner", "supplier", "buyer", "user"];

const roleMeta: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: "Admin", color: "bg-destructive/10 text-destructive border-destructive/20", icon: ShieldCheck },
  editor: { label: "Editor", color: "bg-primary/10 text-primary border-primary/20", icon: Shield },
  partner: { label: "Partner", color: "bg-accent/20 text-accent-foreground border-accent/30", icon: UserCheck },
  supplier: { label: "Supplier", color: "bg-accent/20 text-accent-foreground border-accent/30", icon: UserCheck },
  buyer: { label: "Buyer", color: "bg-secondary text-secondary-foreground border-border", icon: User },
  user: { label: "User", color: "bg-muted text-muted-foreground border-border", icon: User },
};

interface ProfileWithRoles {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  roles: AppRole[];
}

export function AdminUsers() {
  const qc = useQueryClient();
  const [addDialogUser, setAddDialogUser] = useState<ProfileWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ userId: string; role: AppRole } | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-with-roles"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, user_id, name, email, created_at")
        .order("created_at", { ascending: false });
      if (pErr) throw pErr;

      const { data: allRoles, error: rErr } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (rErr) throw rErr;

      const roleMap = new Map<string, AppRole[]>();
      allRoles?.forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role as AppRole);
        roleMap.set(r.user_id, existing);
      });

      return (profiles || []).map((p) => ({
        ...p,
        roles: roleMap.get(p.user_id) || [],
      })) as ProfileWithRoles[];
    },
  });

  const handleAddRole = async () => {
    if (!addDialogUser || !selectedRole) return;
    const { error } = await supabase.from("user_roles").insert({
      user_id: addDialogUser.user_id,
      role: selectedRole as AppRole,
    });
    if (error) {
      if (error.code === "23505") toast.error("User already has this role");
      else toast.error(error.message);
    } else {
      toast.success(`Role "${selectedRole}" added`);
      qc.invalidateQueries({ queryKey: ["admin-users-with-roles"] });
    }
    setAddDialogUser(null);
    setSelectedRole("");
  };

  const handleRemoveRole = async () => {
    if (!deleteConfirm) return;
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", deleteConfirm.userId)
      .eq("role", deleteConfirm.role);
    if (error) toast.error(error.message);
    else {
      toast.success(`Role "${deleteConfirm.role}" removed`);
      qc.invalidateQueries({ queryKey: ["admin-users-with-roles"] });
    }
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Users & Roles</h2>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Joined</th>
                <th className="text-left p-4 font-semibold">Roles</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{u.name || "—"}</td>
                  <td className="p-4 text-muted-foreground">{u.email || "—"}</td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {new Date(u.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">No roles</span>
                      )}
                      {u.roles.map((role) => {
                        const meta = roleMeta[role] || roleMeta.user;
                        return (
                          <Badge
                            key={role}
                            variant="outline"
                            className={`${meta.color} text-xs cursor-pointer group`}
                            onClick={() => setDeleteConfirm({ userId: u.user_id, role })}
                          >
                            {meta.label}
                            <Trash2 size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Badge>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setAddDialogUser(u); setSelectedRole(""); }}
                    >
                      <Plus size={14} className="mr-1" /> Add Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Role Dialog */}
      <Dialog open={!!addDialogUser} onOpenChange={(v) => { if (!v) setAddDialogUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role to {addDialogUser?.name || addDialogUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                {ALL_ROLES.filter((r) => !addDialogUser?.roles.includes(r)).map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleMeta[r]?.label || r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddRole} disabled={!selectedRole} className="w-full">
              Assign Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Role Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => { if (!v) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Role</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove role <strong>"{deleteConfirm?.role}"</strong> from this user?
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveRole}>Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
