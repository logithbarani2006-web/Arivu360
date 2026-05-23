import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlans, useUserPlan } from "@/hooks/useUserPlan";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";

const planIcons: Record<string, typeof Crown> = {
  free: Sparkles,
  plus: Zap,
  pro: Crown,
};

const planGradients: Record<string, string> = {
  free: "from-muted-foreground/20 to-muted-foreground/5",
  plus: "from-secondary/30 to-secondary/10",
  pro: "from-secondary to-gold-dark",
};

const Plans = () => {
  const { user } = useAuth();
  const { data: plans, isLoading } = usePlans();
  const { data: userPlan } = useUserPlan();

  const currentPlanName = userPlan?.plan?.name ?? "free";

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Header */}
      <div className="border-b border-navy-light/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to={user ? "/dashboard" : "/"} className="p-2 -ml-2 rounded-lg hover:bg-navy-light/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Arivu 360" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-lg font-bold">Arivu360</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Choose Your <span className="text-gradient-gold">Plan</span>
          </h1>
          <p className="text-primary-foreground/50 text-sm">உங்கள் திட்டத்தை தேர்வு செய்யுங்கள்</p>
          <p className="text-primary-foreground/60 mt-3 max-w-md mx-auto">
            Earn more coins, unlock lower withdrawal thresholds, and access premium features.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl h-96 animate-pulse bg-navy-light/30" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans?.map((plan, i) => {
              const Icon = planIcons[plan.name] || Sparkles;
              const isCurrentPlan = currentPlanName === plan.name;
              const isPro = plan.name === "pro";

              return (
                <motion.div
                  key={plan.id}
                  className={`relative rounded-2xl p-6 flex flex-col border ${
                    isPro
                      ? "border-secondary/50 shadow-gold"
                      : "border-navy-light/30"
                  }`}
                  style={{ background: "hsl(230 55% 16% / 0.8)" }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-cta text-primary text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${planGradients[plan.name]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>

                  <h2 className="font-display text-2xl font-bold mb-1">{plan.display_name}</h2>

                  <div className="flex items-baseline gap-1 mb-4">
                    {plan.price_inr === 0 ? (
                      <span className="text-3xl font-display font-bold text-gradient-gold">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-display font-bold text-gradient-gold">₹{plan.price_inr}</span>
                        <span className="text-primary-foreground/40 text-sm">/month</span>
                      </>
                    )}
                  </div>

                  <div className="mb-4 p-3 rounded-lg bg-navy-light/20">
                    <p className="text-xs text-primary-foreground/50 mb-1">Coin Rewards</p>
                    <p className="font-bold text-secondary">{plan.reward_multiplier}x Multiplier</p>
                    <p className="text-xs text-primary-foreground/40 mt-1">
                      Withdrawal at {plan.withdrawal_threshold.toLocaleString()} AC
                    </p>
                  </div>

                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-primary-foreground/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <div className="text-center py-3 rounded-lg border border-secondary/30 text-secondary font-semibold text-sm">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                        isPro
                          ? "bg-gradient-cta text-primary hover:opacity-90"
                          : "bg-navy-light/40 text-primary-foreground hover:bg-navy-light/60"
                      }`}
                    >
                      {plan.price_inr === 0 ? "Get Started" : `Upgrade to ${plan.display_name}`}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Coin value info */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-6 rounded-xl px-6 py-4" style={{ background: "hsl(230 55% 16% / 0.8)" }}>
            <div>
              <p className="text-xs text-primary-foreground/40">Base Reward</p>
              <p className="font-bold text-secondary">10 AC / video</p>
            </div>
            <div className="w-px h-8 bg-navy-light/30" />
            <div>
              <p className="text-xs text-primary-foreground/40">Conversion Rate</p>
              <p className="font-bold text-secondary">100 AC = ₹1</p>
            </div>
            <div className="w-px h-8 bg-navy-light/30" />
            <div>
              <p className="text-xs text-primary-foreground/40">Payout Via</p>
              <p className="font-bold text-secondary">UPI</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Plans;
