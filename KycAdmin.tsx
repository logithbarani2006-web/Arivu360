import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Loader2, ShieldCheck, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface KycRow {
  id: string;
  user_id: string;
  full_name: string;
  id_type: string;
  id_number_masked: string;
  document_url: string;
  status: string;
  admin_note: string | null;
  submitted_at: string;
  verified_at: string | null;
}

const KycAdmin = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submissions, setSubmissions] = useState<KycRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"pending" | "verified" | "rejected" | "all">("pending");

  const fetchSubmissions = async () => {
    let query = supabase.from("kyc_submissions").select("*").order("submitted_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setSubmissions((data as KycRow[]) || []);
    setLoadingData(false);
  };

  useEffect(() => {
    if (user && role === "admin") fetchSubmissions();
  }, [user, role, filter]);

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!user || role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const handleAction = async (sub: KycRow, approved: boolean) => {
    setProcessing(sub.id);
    try {
      const updateData: any = {
        status: approved ? "verified" : "rejected",
        admin_note: notes[sub.id] || null,
      };
      if (approved) updateData.verified_at = new Date().toISOString();

      const { error } = await supabase.from("kyc_submissions").update(updateData).eq("id", sub.id);
      if (error) throw error;

      // Credit 500 AC on approval
      if (approved) {
        await supabase.from("coin_transactions").insert({
          user_id: sub.user_id,
          amount: 500,
          type: "earn",
          source: "milestone",
          description: "KYC verification reward (அடையாள சரிபார்ப்பு வெகுமதி)",
        });
      }

      toast({ title: approved ? "KYC Approved ✅" : "KYC Rejected ❌" });
      fetchSubmissions();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const getDocUrl = async (path: string) => {
    const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const statusIcon = (s: string) => {
    if (s === "verified") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (s === "rejected") return <XCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary border-b border-navy-light/20">
        <div className="container mx-auto flex items-center gap-3 py-3 px-4">
          <Link to="/dashboard"><ArrowLeft className="w-5 h-5 text-primary-foreground" /></Link>
          <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          <h1 className="font-display text-lg font-bold text-primary-foreground">KYC Admin Panel</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["pending", "verified", "rejected", "all"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => { setFilter(f); setLoadingData(true); }}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>

          {loadingData ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : submissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No {filter} submissions found.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <motion.div key={sub.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-5 shadow-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{sub.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{sub.id_type} · {sub.id_number_masked}</p>
                    </div>
                    <div className="flex items-center gap-1">{statusIcon(sub.status)} <span className="text-xs capitalize text-muted-foreground">{sub.status}</span></div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>Submitted: {new Date(sub.submitted_at).toLocaleDateString()}</span>
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => getDocUrl(sub.document_url)}>
                      <Eye className="w-3 h-3 mr-1" /> View Document
                    </Button>
                  </div>

                  {sub.status === "pending" && (
                    <div className="space-y-3 border-t border-muted pt-3">
                      <Textarea
                        placeholder="Admin note (optional)..."
                        value={notes[sub.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [sub.id]: e.target.value })}
                        className="text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(sub, true)}
                          disabled={processing === sub.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processing === sub.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(sub, false)}
                          disabled={processing === sub.id}
                        >
                          {processing === sub.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KycAdmin;
