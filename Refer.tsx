import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Users, Gift, Share2, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpg";

const Refer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.id?.slice(0, 8).toUpperCase() || "ARIVU360";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const { data: referrals = [] } = useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const totalEarned = referrals.reduce((sum: number, r: any) => sum + (r.coins_credited || 0), 0);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Arivu 360",
          text: `Join Arivu 360 and start earning coins! Use my referral code: ${referralCode}`,
          url: referralLink,
        });
      } catch {
        handleCopy(referralLink);
      }
    } else {
      handleCopy(referralLink);
    }
  };

  const steps = [
    { icon: Share2, title: "Share Your Link", titleTamil: "இணைப்பை பகிரவும்", desc: "Send your unique referral link to friends" },
    { icon: Users, title: "Friend Joins", titleTamil: "நண்பர் சேருவார்", desc: "They sign up using your referral code" },
    { icon: Gift, title: "Both Earn 500 AC", titleTamil: "இருவரும் 500 AC பெறுவீர்கள்", desc: "You and your friend get rewarded!" },
  ];

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Header */}
      <div className="border-b border-navy-light/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-navy-light/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Arivu 360" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-lg font-bold">Refer & Earn</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Hero */}
        <motion.div
          className="rounded-2xl p-6 mb-6 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(230 55% 18%), hsl(228 45% 28%))" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-2 right-2 opacity-10">
            <Gift className="w-24 h-24 text-secondary" />
          </div>
          <Users className="w-12 h-12 text-secondary mx-auto mb-3" />
          <h1 className="text-2xl font-display font-bold mb-1">Invite Friends, Earn Coins</h1>
          <p className="text-primary-foreground/40 text-sm">நண்பர்களை அழைத்து காயின்கள் பெறுங்கள்</p>
          <p className="text-primary-foreground/60 text-sm mt-3">
            Earn <span className="text-secondary font-bold">500 AC</span> for every friend who joins Arivu 360 using your referral link!
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="rounded-xl p-4 text-center" style={{ background: "hsl(230 55% 16% / 0.8)" }}>
            <Users className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="text-2xl font-display font-bold text-gradient-gold">{referrals.length}</p>
            <p className="text-primary-foreground/40 text-xs">Friends Invited</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "hsl(230 55% 16% / 0.8)" }}>
            <Coins className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="text-2xl font-display font-bold text-gradient-gold">{totalEarned.toLocaleString()}</p>
            <p className="text-primary-foreground/40 text-xs">AC Earned</p>
          </div>
        </motion.div>

        {/* Referral Code */}
        <motion.div
          className="rounded-xl p-5 mb-6"
          style={{ background: "hsl(230 55% 16% / 0.8)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-primary-foreground/50 text-xs mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-display font-bold text-gradient-gold tracking-widest flex-1">
              {referralCode}
            </span>
            <button
              onClick={() => handleCopy(referralCode)}
              className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-secondary" /> : <Copy className="w-5 h-5 text-secondary" />}
            </button>
          </div>

          <p className="text-primary-foreground/50 text-xs mb-2">Referral Link</p>
          <div className="bg-navy-light/30 rounded-lg p-3 text-xs text-primary-foreground/60 break-all mb-4">
            {referralLink}
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-gradient-cta text-primary font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Referral Link
          </button>
        </motion.div>

        {/* Recent referrals */}
        {referrals.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-lg font-display font-bold mb-1">Recent Referrals</h2>
            <p className="text-primary-foreground/40 text-xs mb-3">சமீபத்திய பரிந்துரைகள்</p>
            <div className="space-y-2">
              {referrals.slice(0, 5).map((r: any, i: number) => (
                <motion.div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "hsl(230 55% 16% / 0.8)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Friend joined</p>
                    <p className="text-primary-foreground/40 text-xs">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-secondary font-bold text-sm">+{r.coins_credited} AC</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-display font-bold mb-1">How It Works</h2>
          <p className="text-primary-foreground/40 text-xs mb-4">எப்படி செயல்படுகிறது</p>

          <div className="space-y-3">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="flex items-center gap-4 rounded-xl px-4 py-4"
                  style={{ background: "hsl(230 55% 16% / 0.8)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-primary-foreground/40 text-[11px]">{step.titleTamil}</p>
                    <p className="text-primary-foreground/50 text-xs mt-0.5">{step.desc}</p>
                  </div>
                  <StepIcon className="w-5 h-5 text-secondary/40 shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Refer;
