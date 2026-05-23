import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShieldCheck, Clock, XCircle, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ID_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving License", "Passport"];

const statusDisplay: Record<string, { icon: typeof CheckCircle2; label: string; labelTa: string; color: string }> = {
  pending: { icon: Clock, label: "Under Review", labelTa: "சரிபார்ப்பில் உள்ளது", color: "text-yellow-500" },
  verified: { icon: CheckCircle2, label: "Verified", labelTa: "சரிபார்க்கப்பட்டது", color: "text-green-500" },
  rejected: { icon: XCircle, label: "Rejected", labelTa: "நிராகரிக்கப்பட்டது", color: "text-destructive" },
};

const KycSubmit = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<any>(null);
  const [loadingKyc, setLoadingKyc] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("kyc_submissions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setExisting(data);
        setLoadingKyc(false);
      });
  }, [user]);

  if (authLoading || loadingKyc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const maskId = (id: string) => id.replace(/./g, (c, i) => (i < id.length - 4 ? "*" : c));

  const handleSubmit = async () => {
    if (!fullName.trim() || !idType || !idNumber.trim() || !file) {
      toast({ title: "All fields are required", description: "அனைத்து புலங்களும் அவசியம்!", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Upload document
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("kyc-documents").upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const maskedId = maskId(idNumber.trim());
      const docUrl = filePath;

      if (existing && existing.status === "rejected") {
        // Re-submit
        const { error } = await supabase
          .from("kyc_submissions")
          .update({
            full_name: fullName.trim(),
            id_type: idType,
            id_number_masked: maskedId,
            document_url: docUrl,
            status: "pending",
            admin_note: null,
            submitted_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("kyc_submissions").insert({
          user_id: user.id,
          full_name: fullName.trim(),
          id_type: idType,
          id_number_masked: maskedId,
          document_url: docUrl,
        });
        if (error) throw error;
      }

      toast({ title: "KYC Submitted!", description: "Your details are under review. விரைவில் சரிபார்க்கப்படும்!" });
      // Refresh
      const { data } = await supabase.from("kyc_submissions").select("*").eq("user_id", user.id).maybeSingle();
      setExisting(data);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Show status if already submitted and not rejected
  if (existing && existing.status !== "rejected") {
    const s = statusDisplay[existing.status];
    const Icon = s.icon;
    return (
      <div className="min-h-screen bg-background">
        <nav className="bg-primary border-b border-navy-light/20">
          <div className="container mx-auto flex items-center gap-3 py-3 px-4">
            <Link to="/dashboard"><ArrowLeft className="w-5 h-5 text-primary-foreground" /></Link>
            <h1 className="font-display text-lg font-bold text-primary-foreground">KYC Verification</h1>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto bg-card rounded-xl p-8 shadow-card text-center">
            <Icon className={`w-16 h-16 mx-auto mb-4 ${s.color}`} />
            <h2 className="text-xl font-display font-bold text-foreground mb-1">{s.label}</h2>
            <p className="text-muted-foreground text-sm mb-4">{s.labelTa}</p>
            <div className="bg-muted rounded-lg p-4 text-left text-sm space-y-2">
              <p><span className="text-muted-foreground">Name:</span> <span className="font-semibold text-foreground">{existing.full_name}</span></p>
              <p><span className="text-muted-foreground">ID Type:</span> <span className="font-semibold text-foreground">{existing.id_type}</span></p>
              <p><span className="text-muted-foreground">ID:</span> <span className="font-mono text-foreground">{existing.id_number_masked}</span></p>
              <p><span className="text-muted-foreground">Submitted:</span> <span className="text-foreground">{new Date(existing.submitted_at).toLocaleDateString()}</span></p>
              {existing.verified_at && (
                <p><span className="text-muted-foreground">Verified:</span> <span className="text-foreground">{new Date(existing.verified_at).toLocaleDateString()}</span></p>
              )}
            </div>
            {existing.admin_note && (
              <p className="mt-4 text-sm text-muted-foreground italic">Note: {existing.admin_note}</p>
            )}
          </motion.div>
        </main>
      </div>
    );
  }

  // Show form (new or rejected re-submit)
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary border-b border-navy-light/20">
        <div className="container mx-auto flex items-center gap-3 py-3 px-4">
          <Link to="/dashboard"><ArrowLeft className="w-5 h-5 text-primary-foreground" /></Link>
          <h1 className="font-display text-lg font-bold text-primary-foreground">KYC Verification</h1>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          {existing?.status === "rejected" && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-sm">
              <p className="font-semibold text-destructive">KYC Rejected</p>
              {existing.admin_note && <p className="text-muted-foreground mt-1">{existing.admin_note}</p>}
              <p className="text-muted-foreground mt-1">Please re-submit with correct details.</p>
            </div>
          )}

          <div className="bg-card rounded-xl p-6 shadow-card space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-secondary" />
              <div>
                <h2 className="font-display font-bold text-foreground">Verify Your Identity</h2>
                <p className="text-xs text-muted-foreground">உங்கள் அடையாளத்தை சரிபார்க்கவும்</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Full Name (முழு பெயர்)</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" maxLength={100} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">ID Type (அடையாள வகை)</label>
              <Select value={idType} onValueChange={setIdType}>
                <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">ID Number (அடையாள எண்)</label>
              <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter your ID number" maxLength={20} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Upload Document (ஆவணத்தை பதிவேற்றவும்)</label>
              <label className="flex items-center gap-2 border border-dashed border-muted-foreground/30 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{file ? file.name : "Choose a file..."}</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <Button onClick={handleSubmit} disabled={submitting} className="btn-glow w-full text-primary-foreground font-semibold relative overflow-visible">
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit KYC"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your ID number will be masked for security. 500 AC reward on verification!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default KycSubmit;
