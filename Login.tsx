import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpg";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingInput = ({
  id,
  type = "text",
  value,
  onChange,
  label,
  shake,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  shake: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isActive = focused || value.length > 0;
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <motion.div
      className="relative"
      animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        className={cn(
          "peer w-full h-13 px-4 pt-5 pb-2 rounded-xl border-2 bg-card/50 backdrop-blur-sm text-foreground text-base outline-none transition-all duration-300",
          focused
            ? "border-secondary shadow-gold"
            : "border-border hover:border-secondary/40",
          shake && "border-destructive"
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          isActive
            ? "top-1.5 text-[11px] font-semibold text-secondary"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        )}
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </motion.div>
  );
};

const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-secondary/30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShake(false);

    const email = username.includes("@") ? username : `${username}@arivu360.app`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setShake(true);
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setTimeout(() => setShake(false), 600);
    } else {
      toast({ title: "Welcome back!" });
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, hsl(var(--secondary) / 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <ParticleField />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <Link to="/" className="inline-block">
            <motion.img
              src={logo}
              alt="Arivu 360"
              className="h-20 w-20 rounded-full object-cover mx-auto mb-3 shadow-elevated ring-2 ring-secondary/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </Link>
          <h1 className="text-2xl font-display font-bold text-primary-foreground">
            Welcome Back
          </h1>
          <p className="text-primary-foreground/50 mt-1 text-sm">
            Sign in to your Arivu 360 account
          </p>
        </motion.div>

        {/* Form card */}
        <motion.form
          onSubmit={handleLogin}
          className="bg-card/90 backdrop-blur-xl rounded-2xl p-6 shadow-elevated space-y-4 border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        >
          <FloatingInput
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Username or Email"
            shake={shake}
          />

          <FloatingInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            shake={shake}
          />

          {/* Login button with micro-animations */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 bg-gradient-cta text-primary font-semibold text-base rounded-xl transition-all duration-300",
                !loading && "hover:shadow-gold hover:brightness-110 active:brightness-95"
              )}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Biometric fingerprint icon */}
          <motion.div
            className="flex justify-center pt-1"
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              type="button"
              className="p-3 rounded-full border border-secondary/30 text-secondary/60 hover:text-secondary hover:border-secondary/60 transition-colors duration-300"
              animate={{
                boxShadow: [
                  "0 0 0 0 hsl(var(--secondary) / 0)",
                  "0 0 0 8px hsl(var(--secondary) / 0.1)",
                  "0 0 0 0 hsl(var(--secondary) / 0)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ scale: 0.9 }}
            >
              <Fingerprint className="w-6 h-6" />
            </motion.button>
          </motion.div>

          <p className="text-center text-sm text-muted-foreground pt-1">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-secondary font-semibold hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
