
-- Plans table
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  base_reward_coins int NOT NULL DEFAULT 10,
  reward_multiplier int NOT NULL DEFAULT 1,
  withdrawal_threshold int NOT NULL DEFAULT 30000,
  price_inr numeric NOT NULL DEFAULT 0,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT TO authenticated USING (true);

-- Seed the 3 plans
INSERT INTO public.plans (name, display_name, base_reward_coins, reward_multiplier, withdrawal_threshold, price_inr, features)
VALUES
  ('free', 'Free', 10, 1, 30000, 0, '["Access to free courses", "Basic quizzes", "Community support", "100 AC = ₹1"]'::jsonb),
  ('plus', 'Plus', 10, 2, 15000, 299, '["All Free features", "2x coin rewards", "Lower withdrawal threshold (15K)", "Priority support", "Offline downloads"]'::jsonb),
  ('pro', 'Pro', 10, 3, 5000, 799, '["All Plus features", "3x coin rewards", "Lowest threshold (5K)", "1-on-1 mentoring", "Certificate programs", "Early access to new courses"]'::jsonb);

-- User plans table
CREATE TABLE public.user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plan" ON public.user_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plan" ON public.user_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Coin transactions table
CREATE TABLE public.coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount int NOT NULL,
  type text NOT NULL CHECK (type IN ('earn', 'redeem', 'withdraw')),
  source text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.coin_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.coin_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Withdrawal requests table
CREATE TABLE public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_coins int NOT NULL,
  amount_inr numeric NOT NULL,
  upi_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawals" ON public.withdrawal_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can request withdrawals" ON public.withdrawal_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Function to get user coin balance
CREATE OR REPLACE FUNCTION public.get_user_coin_balance(_user_id uuid)
RETURNS int
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(
    CASE WHEN type = 'earn' THEN amount ELSE -amount END
  ), 0)::int
  FROM public.coin_transactions
  WHERE user_id = _user_id
$$;

-- Auto-assign free plan to new users
CREATE OR REPLACE FUNCTION public.assign_free_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_plans (user_id, plan_id)
  SELECT NEW.id, p.id FROM public.plans p WHERE p.name = 'free';
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_free_plan();
