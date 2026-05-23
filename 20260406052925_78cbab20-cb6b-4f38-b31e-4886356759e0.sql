
-- Referrals tracking table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL,
  referral_code TEXT NOT NULL,
  coins_credited INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals (as referrer)
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id);

-- Users can insert referrals (triggered at signup)
CREATE POLICY "Users can insert referrals" ON public.referrals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = referred_id);

-- Add referral_code column to profiles for quick lookups
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Populate referral_code for existing profiles
UPDATE public.profiles SET referral_code = UPPER(LEFT(user_id::text, 8)) WHERE referral_code IS NULL;

-- Function to auto-set referral code on new profile
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.referral_code := UPPER(LEFT(NEW.user_id::text, 8));
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_referral_code();

-- Function to process referral and credit coins
CREATE OR REPLACE FUNCTION public.process_referral(_referred_id UUID, _referral_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer_id UUID;
BEGIN
  -- Find the referrer by code
  SELECT user_id INTO _referrer_id FROM public.profiles WHERE referral_code = _referral_code;
  
  IF _referrer_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Don't allow self-referral
  IF _referrer_id = _referred_id THEN
    RETURN FALSE;
  END IF;
  
  -- Check if already referred
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = _referred_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Record the referral
  INSERT INTO public.referrals (referrer_id, referred_id, referral_code, coins_credited)
  VALUES (_referrer_id, _referred_id, _referral_code, 500);
  
  -- Credit 500 AC to referrer
  INSERT INTO public.coin_transactions (user_id, amount, type, source, description)
  VALUES (_referrer_id, 500, 'earn', 'milestone', 'Referral bonus: a friend joined using your code');
  
  -- Credit 500 AC to the referred user too
  INSERT INTO public.coin_transactions (user_id, amount, type, source, description)
  VALUES (_referred_id, 500, 'earn', 'milestone', 'Welcome bonus: joined via referral');
  
  RETURN TRUE;
END;
$$;
