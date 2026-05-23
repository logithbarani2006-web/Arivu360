import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Plan {
  id: string;
  name: string;
  display_name: string;
  base_reward_coins: number;
  reward_multiplier: number;
  withdrawal_threshold: number;
  price_inr: number;
  features: string[];
}

export const usePlans = () =>
  useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("price_inr", { ascending: true });
      if (error) throw error;
      return (data as any[]).map((p) => ({ ...p, features: p.features as string[] })) as Plan[];
    },
  });

export const useUserPlan = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_plan", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_plans")
        .select("*, plan:plans(*)")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      const plan = data.plan as any;
      return {
        ...data,
        plan: { ...plan, features: plan.features as string[] } as Plan,
      };
    },
  });
};

export const useUserCoinBalance = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["coin_balance", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_coin_balance", {
        _user_id: user!.id,
      });
      if (error) throw error;
      return (data as number) ?? 0;
    },
  });
};

export const useUserTransactions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["coin_transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coin_transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
};
