import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    const validate = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        const data = await res.json();
        if (!res.ok) { setStatus("invalid"); return; }
        setStatus(data.valid === false && data.reason === "already_unsubscribed" ? "already" : "valid");
      } catch { setStatus("invalid"); }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      setStatus(error ? "error" : "success");
    } catch { setStatus("error"); }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          {status === "loading" && <Loader2 className="h-10 w-10 mx-auto animate-spin text-muted-foreground" />}
          {status === "valid" && (
            <>
              <MailX className="h-12 w-12 mx-auto text-destructive" />
              <h1 className="text-xl font-bold text-foreground">Berhenti Berlangganan</h1>
              <p className="text-muted-foreground text-sm">Anda akan berhenti menerima email notifikasi dari PasarBaik.</p>
              <Button onClick={handleUnsubscribe} disabled={submitting} variant="destructive" className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Konfirmasi Berhenti Langganan
              </Button>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <h1 className="text-xl font-bold text-foreground">Berhasil</h1>
              <p className="text-muted-foreground text-sm">Anda telah berhenti berlangganan email dari PasarBaik.</p>
            </>
          )}
          {status === "already" && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h1 className="text-xl font-bold text-foreground">Sudah Berhenti Langganan</h1>
              <p className="text-muted-foreground text-sm">Email Anda sudah tidak lagi menerima notifikasi.</p>
            </>
          )}
          {(status === "invalid" || status === "error") && (
            <>
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <h1 className="text-xl font-bold text-foreground">Link Tidak Valid</h1>
              <p className="text-muted-foreground text-sm">Link berhenti langganan tidak valid atau sudah kedaluwarsa.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
