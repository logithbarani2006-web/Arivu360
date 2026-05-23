import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, CalendarCheck, Award, Video, ChevronRight, Landmark, Crown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { useUserPlan, useUserCoinBalance, useUserTransactions } from "@/hooks/useUserPlan";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import logo from "@/assets/logo.jpg";

const sourceIcons: Record<string, typeof Coins> = {
  "daily_checkin": CalendarCheck,
  "quiz": Award,
  "video": Video,
  "milestone": Award,
};

const Wallet = () => {
  const { user, profile } = useAuth();
  const { data: userPlan } = useUserPlan();
  const { data: coinBalance = 0 } = useUserCoinBalance();
  const { data: transactions = [] } = useUserTransactions();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const plan = userPlan?.plan;
  const withdrawalThreshold = plan?.withdrawal_threshold ?? 30000;
  const multiplier = plan?.reward_multiplier ?? 1;
  const payoutProgress = Math.min(100, Math.round((coinBalance / withdrawalThreshold) * 100));
  const canWithdraw = coinBalance >= withdrawalThreshold;

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleWithdraw = async () => {
    if (!user || !upiId.trim()) return;
    setSubmitting(true);
    const amountInr = coinBalance * 0.01;

    const { error } = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount_coins: coinBalance,
      amount_inr: amountInr,
      upi_id: upiId.trim(),
      status: "pending",
    });

    if (error) {
      toast({ title: "Error", description: "Failed to submit request. Try again.", variant: "destructive" });
    } else {
      // Record the withdrawal transaction
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: coinBalance,
        type: "withdraw",
        source: "payout",
        description: `Payout request ₹${amountInr.toFixed(2)} to ${upiId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["coin_balance"] });
      queryClient.invalidateQueries({ queryKey: ["coin_transactions"] });
      toast({ title: "Request Submitted!", description: `₹${amountInr.toFixed(2)} payout to ${upiId} is pending approval.` });
      setShowWithdraw(false);
      setUpiId("");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Header */}
      <div className="border-b border-navy-light/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-navy-light/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Arivu 360" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display text-lg font-bold">Arivu360</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-navy-light flex items-center justify-center text-sm font-bold">
            {(profile?.display_name || profile?.username || "U")[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Title */}
        <motion.h1
          className="text-2xl font-display font-bold mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          MY ARIVU COIN WALLET
        </motion.h1>
        <p className="text-primary-foreground/50 text-sm mb-6">அறிவு காயின் பணப்பை</p>

        {/* Plan Badge */}
        {plan && (
          <motion.div
            className="flex items-center justify-between rounded-xl px-4 py-3 mb-4"
            style={{ background: "hsl(230 55% 16% / 0.8)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-secondary" />
              <div>
                <p className="font-semibold text-sm">{plan.display_name} Plan</p>
                <p className="text-primary-foreground/40 text-xs">{multiplier}x coin rewards</p>
              </div>
            </div>
            <Link to="/plans" className="text-secondary text-xs font-semibold hover:underline">
              {plan.name === "free" ? "Upgrade" : "Manage"}
            </Link>
          </motion.div>
        )}

        {/* Balance Card */}
        <motion.div
          className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(230 55% 18%), hsl(228 45% 28%))" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute top-3 right-3 opacity-20">
            <Coins className="w-20 h-20 text-secondary" />
          </div>
          <p className="text-primary-foreground/60 text-sm mb-1">Current Balance</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-display font-bold text-gradient-gold">{coinBalance.toLocaleString()}</span>
            <span className="text-secondary font-bold text-lg">AC</span>
          </div>
          <p className="text-primary-foreground/50 text-sm">
            Current Value: ₹{(coinBalance / 100).toFixed(2)} (100 AC = ₹1)
          </p>
        </motion.div>

        {/* Earnings Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold">Your Earnings</h2>
              <p className="text-primary-foreground/40 text-xs">சம்பாதித்தவை</p>
            </div>
            <Link to="/earn" className="text-secondary text-sm font-semibold hover:underline">
              Earn More
            </Link>
          </div>
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-primary-foreground/30 text-sm">
                No transactions yet. Start learning to earn coins!
              </div>
            ) : (
              transactions.map((item: any, i: number) => {
                const Icon = sourceIcons[item.source] || Coins;
                const isEarn = item.type === "earn";
                return (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "hsl(230 55% 16% / 0.8)" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.description || item.source}
                      </p>
                      <p className="text-primary-foreground/40 text-xs">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`font-bold text-sm whitespace-nowrap ${isEarn ? "text-secondary" : "text-destructive"}`}>
                      {isEarn ? "+" : "-"}{item.amount} AC
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Progress to Payout */}
        <motion.div
          className="rounded-xl p-5 mb-6"
          style={{ background: "hsl(230 55% 16% / 0.8)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm font-semibold mb-3">Progress to Next Payout ({payoutProgress}%)</p>
          <Progress value={payoutProgress} className="h-2 bg-navy-light" />
          <p className="text-primary-foreground/40 text-xs mt-2">
            {coinBalance.toLocaleString()} / {withdrawalThreshold.toLocaleString()} AC
          </p>
        </motion.div>

        {/* Redeem Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold">Redeem Your Coins</h2>
              <p className="text-primary-foreground/40 text-xs">மாற்றுக</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              className="w-full flex items-center gap-3 rounded-xl px-4 py-4 hover:bg-navy-light/30 transition-colors"
              style={{ background: "hsl(230 55% 16% / 0.8)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">Apply to Next Course Fee</p>
                <p className="text-primary-foreground/40 text-xs">(-₹20.00 / 2,000 AC)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-foreground/30" />
            </button>

            <button
              onClick={() => canWithdraw ? setShowWithdraw(true) : toast({ title: "Not eligible yet", description: `You need ${withdrawalThreshold.toLocaleString()} AC to withdraw.` })}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-4 hover:bg-navy-light/30 transition-colors"
              style={{ background: "hsl(230 55% 16% / 0.8)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">Request Payout</p>
                <p className="text-primary-foreground/40 text-xs">
                  Min. ₹{(withdrawalThreshold / 100).toLocaleString()} / {withdrawalThreshold.toLocaleString()} AC
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-foreground/30" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Withdrawal Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="bg-primary border-navy-light/30 text-primary-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Request Payout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm text-primary-foreground/60 mb-1">Amount</p>
              <p className="text-2xl font-display font-bold text-gradient-gold">
                ₹{(coinBalance / 100).toFixed(2)}
              </p>
              <p className="text-xs text-primary-foreground/40">{coinBalance.toLocaleString()} AC</p>
            </div>
            <div>
              <label className="text-sm text-primary-foreground/60 mb-1 block">UPI ID</label>
              <Input
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="bg-navy-light/30 border-navy-light/40 text-primary-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={handleWithdraw}
              disabled={!upiId.trim() || submitting}
              className="w-full bg-gradient-cta text-primary font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting..." : "Confirm Withdrawal"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;
