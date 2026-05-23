import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarCheck, Users, Play, Coins, Loader2, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan, useUserCoinBalance } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import logo from "@/assets/logo.jpg";

type RewardTask = {
  id: string;
  label: string;
  labelTamil: string;
  baseCoins: number;
  icon: typeof Coins;
  source: string;
  description: string;
};

const rewardTasks: RewardTask[] = [
  {
    id: "daily_login",
    label: "Daily Login",
    labelTamil: "தினசரி உள்நுழைவு",
    baseCoins: 10,
    icon: CalendarCheck,
    source: "daily_checkin",
    description: "Log in every day to earn coins",
  },
  {
    id: "watch_ad",
    label: "Watch Ad",
    labelTamil: "விளம்பரம் பார்க்கவும்",
    baseCoins: 20,
    icon: Play,
    source: "video",
    description: "Watch a short video ad to earn coins",
  },
  {
    id: "referral",
    label: "Refer a Friend",
    labelTamil: "நண்பரை அறிமுகப்படுத்து",
    baseCoins: 500,
    icon: Users,
    source: "milestone",
    description: "Invite a friend and earn when they join",
  },
];

const EarnCoins = () => {
  const { user } = useAuth();
  const { data: userPlan } = useUserPlan();
  const { data: coinBalance = 0 } = useUserCoinBalance();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const multiplier = userPlan?.plan?.reward_multiplier ?? 1;
  const planName = userPlan?.plan?.display_name ?? "Free";

  const handleClaim = async (task: RewardTask) => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to earn coins.", variant: "destructive" });
      return;
    }

    setClaimingId(task.id);
    const coinsToAdd = task.baseCoins * multiplier;

    const { error } = await supabase.from("coin_transactions").insert({
      user_id: user.id,
      amount: coinsToAdd,
      type: "earn",
      source: task.source,
      description: `${task.label} reward (${multiplier}x ${planName})`,
    });

    if (error) {
      toast({ title: "Error", description: "Could not claim reward. Try again.", variant: "destructive" });
    } else {
      toast({ title: `+${coinsToAdd} AC Earned!`, description: `${task.label} reward claimed successfully.` });
      queryClient.invalidateQueries({ queryKey: ["coin_balance"] });
      queryClient.invalidateQueries({ queryKey: ["coin_transactions"] });
    }
    setClaimingId(null);
  };

  const convertToCash = (totalCoins: number) => totalCoins / 100;

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Header */}
      <div className="border-b border-navy-light/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/wallet" className="p-2 -ml-2 rounded-lg hover:bg-navy-light/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Arivu 360" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-lg font-bold">Earn Coins</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Balance Summary */}
        <motion.div
          className="rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(230 55% 18%), hsl(228 45% 28%))" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <Gift className="w-16 h-16 text-secondary" />
          </div>
          <p className="text-primary-foreground/60 text-sm mb-1">Your Balance</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-display font-bold text-gradient-gold">{coinBalance.toLocaleString()}</span>
            <span className="text-secondary font-bold">AC</span>
          </div>
          <p className="text-primary-foreground/50 text-xs">
            ≈ ₹{convertToCash(coinBalance).toFixed(2)} • {multiplier}x rewards with {planName}
          </p>
        </motion.div>

        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-display font-bold mb-1">Complete Tasks</h2>
          <p className="text-primary-foreground/40 text-xs mb-4">பணிகளை நிறைவு செய்யுங்கள்</p>

          <div className="space-y-3">
            {rewardTasks.map((task, i) => {
              const Icon = task.icon;
              const coins = task.baseCoins * multiplier;
              const isClaiming = claimingId === task.id;

              return (
                <motion.div
                  key={task.id}
                  className="rounded-xl px-4 py-4 flex items-center gap-4"
                  style={{ background: "hsl(230 55% 16% / 0.8)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{task.label}</p>
                    <p className="text-primary-foreground/40 text-[11px]">{task.labelTamil}</p>
                    <p className="text-primary-foreground/50 text-xs mt-0.5">{task.description}</p>
                  </div>
                  <button
                    onClick={() => handleClaim(task)}
                    disabled={isClaiming}
                    className="bg-gradient-cta text-primary font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    {isClaiming ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>+{coins} AC</>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          className="mt-8 rounded-xl p-4 text-center"
          style={{ background: "hsl(230 55% 16% / 0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-primary-foreground/40 text-xs">
            Rewards are multiplied by your plan tier. <Link to="/plans" className="text-secondary hover:underline">Upgrade your plan</Link> to earn more coins per task.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EarnCoins;
