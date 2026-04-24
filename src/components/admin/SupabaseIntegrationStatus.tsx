import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Database, RefreshCw, ServerCog, XCircle } from "lucide-react";

const ACTIVE_TABLES = [
  "profiles",
  "user_roles",
  "products",
  "suppliers",
  "programs",
  "rfq_requests",
  "rfq_quotes",
  "orders",
] as const;

type TableStatus = {
  name: string;
  ok: boolean;
  count: number | null;
  error: string | null;
};

export function SupabaseIntegrationStatus() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["supabase-integration-status"],
    queryFn: async () => {
      const tableChecks = await Promise.all(
        ACTIVE_TABLES.map(async (table) => {
          const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

          return {
            name: table,
            ok: !error,
            count: count ?? null,
            error: error?.message ?? null,
          } satisfies TableStatus;
        })
      );

      const connectionOk = tableChecks.some((table) => table.ok);
      const { data: functionData, error: functionError } = await supabase.functions.invoke("admin-users");

      return {
        connectionOk,
        tables: tableChecks,
        adminUsersFunction: {
          ok: !functionError,
          userCount: functionData?.users?.length ?? null,
          error: functionError?.message ?? null,
        },
      };
    },
  });

  const healthyTables = data?.tables.filter((table) => table.ok).length ?? 0;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Status Integrasi Supabase</h2>
          <p className="text-sm text-muted-foreground">Pantau koneksi, tabel aktif, dan function admin-users.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatusCard
              icon={Database}
              title="Koneksi Supabase"
              value={data?.connectionOk ? "Terhubung" : "Gagal"}
              ok={Boolean(data?.connectionOk)}
              detail={data?.connectionOk ? "Client berhasil membaca database." : "Tidak ada tabel yang bisa diakses."}
            />
            <StatusCard
              icon={Database}
              title="Tabel Aktif"
              value={`${healthyTables}/${ACTIVE_TABLES.length}`}
              ok={healthyTables === ACTIVE_TABLES.length}
              detail="Tabel utama yang digunakan aplikasi."
            />
            <StatusCard
              icon={ServerCog}
              title="Function admin-users"
              value={data?.adminUsersFunction.ok ? "Berhasil" : "Gagal"}
              ok={Boolean(data?.adminUsersFunction.ok)}
              detail={
                data?.adminUsersFunction.ok
                  ? `${data.adminUsersFunction.userCount ?? 0} user auth terbaca.`
                  : data?.adminUsersFunction.error || "Function belum merespons."
              }
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold">Tabel</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Jumlah Data</th>
                  <th className="p-4 text-left font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {data?.tables.map((table) => (
                  <tr key={table.name} className="border-t border-border">
                    <td className="p-4 font-mono text-xs text-foreground">{table.name}</td>
                    <td className="p-4">
                      <HealthBadge ok={table.ok} />
                    </td>
                    <td className="p-4 text-muted-foreground">{table.count ?? "—"}</td>
                    <td className="p-4 text-muted-foreground">{table.error || "Aktif"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function HealthBadge({ ok }: { ok: boolean }) {
  return (
    <Badge variant="outline" className={ok ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
      {ok ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
      {ok ? "OK" : "Error"}
    </Badge>
  );
}

function StatusCard({ icon: Icon, title, value, detail, ok }: { icon: typeof Database; title: string; value: string; detail: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <Icon className={ok ? "h-5 w-5 text-primary" : "h-5 w-5 text-destructive"} />
        <HealthBadge ok={ok} />
      </div>
      <div className="font-display text-xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{title}</div>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}