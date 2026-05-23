import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { User, BookOpen, Shield, Users, Coins, Trophy, Share2, ShieldCheck } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import logo from "@/assets/logo.jpg";
import AdminStudentsList from "@/components/AdminStudentsList";

const roleConfig = {
  student: { label: "Student", icon: BookOpen, color: "bg-secondary" },
  staff: { label: "Staff", icon: Users, color: "bg-navy-light" },
  admin: { label: "Admin", icon: Shield, color: "bg-destructive" },
};

const Dashboard = () => {
  const { user, profile, role, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const config = role ? roleConfig[role] : roleConfig.student;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-primary border-b border-navy-light/20">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Arivu 360" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-xl font-bold text-primary-foreground">Arivu 360</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className={`${config.color} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </div>
            <LogoutButton onLogout={signOut} />
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl p-8 shadow-card mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/profile" className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:ring-2 hover:ring-secondary/40 transition-all">
                <User className="w-8 h-8 text-primary-foreground" />
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Welcome, {profile?.display_name || profile?.username || "User"}!
                </h1>
                <p className="text-muted-foreground">@{profile?.username}</p>
                <Link to="/profile" className="text-xs text-secondary hover:underline">View Profile</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground">Role</p>
                <p className="font-semibold text-foreground capitalize">{role || "Student"}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground">Member since</p>
                <p className="font-semibold text-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Today"}
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Link */}
          <Link to="/wallet" className="flex items-center gap-3 bg-gradient-cta rounded-xl p-4 hover:opacity-90 transition-opacity mb-4">
            <Coins className="w-6 h-6 text-primary" />
            <div>
              <p className="font-bold text-primary text-sm">Arivu Coin Wallet</p>
              <p className="text-primary/70 text-xs">4,500 AC · View earnings &amp; redeem</p>
            </div>
          </Link>

          {/* Plans Link */}
          <Link to="/plans" className="flex items-center gap-3 bg-card border border-secondary/30 rounded-xl p-4 hover:border-secondary/60 transition-colors mb-4">
            <Trophy className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-bold text-foreground text-sm">Upgrade Your Plan</p>
              <p className="text-muted-foreground text-xs">Earn more coins with Plus & Pro plans</p>
            </div>
          </Link>

          {/* KYC Link */}
          <Link to="/kyc" className="flex items-center gap-3 bg-card border border-secondary/30 rounded-xl p-4 hover:border-secondary/60 transition-colors mb-4">
            <ShieldCheck className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-bold text-foreground text-sm">KYC Verification</p>
              <p className="text-muted-foreground text-xs">Verify identity & earn 500 AC · அடையாளத்தை சரிபார்க்கவும்</p>
            </div>
          </Link>

          {/* Refer Link */}
          <Link to="/refer" className="flex items-center gap-3 bg-card border border-secondary/30 rounded-xl p-4 hover:border-secondary/60 transition-colors mb-8">
            <Share2 className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-bold text-foreground text-sm">Refer & Earn</p>
              <p className="text-muted-foreground text-xs">Invite friends and earn 500 AC per referral</p>
            </div>
          </Link>

          {role === "admin" && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-8 shadow-card">
                <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" /> Admin Panel
                </h2>
                <p className="text-muted-foreground mb-4">
                  Monitor student performance, manage KYC, and oversee the platform.
                </p>
                <Link to="/admin/kyc">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ShieldCheck className="w-4 h-4" /> Review KYC Submissions
                  </Button>
                </Link>
              </div>
              <AdminStudentsList />
            </div>
          )}

          {role === "staff" && (
            <div className="bg-card rounded-xl p-8 shadow-card">
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-navy-light" /> Staff Dashboard
              </h2>
              <p className="text-muted-foreground">
                Manage your courses, track student progress, and create content.
              </p>
            </div>
          )}

          {role === "student" && (
            <div className="bg-card rounded-xl p-8 shadow-card">
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" /> My Learning
              </h2>
              <p className="text-muted-foreground">
                Continue where you left off — explore courses, take quizzes, and track your progress.
              </p>
              <Link to="/courses">
                <Button className="mt-4 bg-gradient-cta text-primary font-semibold hover:opacity-90">
                  Browse Courses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
