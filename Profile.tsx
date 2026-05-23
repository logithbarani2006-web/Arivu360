import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, ArrowLeft, Award, FileText, Download, Video } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";
import LogoutButton from "@/components/LogoutButton";
import ParachuteDownloadButton from "@/components/ParachuteDownloadButton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const certificates = [
  { id: 1, name: "Web Development Basics", date: "2025-01-15", grade: "A+" },
  { id: 2, name: "Python for Beginners", date: "2025-02-20", grade: "A" },
  { id: 3, name: "Digital Marketing 101", date: "2025-03-10", grade: "B+" },
];

interface DownloadRecord {
  id: string;
  course_title: string;
  downloaded_at: string;
}

const Profile = () => {
  const { user, profile, role, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [downloadsLoading, setDownloadsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("video_downloads")
        .select("id, course_title, downloaded_at")
        .order("downloaded_at", { ascending: false })
        .limit(50);
      if (!error && data) setDownloads(data as DownloadRecord[]);
      setDownloadsLoading(false);
    })();
  }, [user]);

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

  const handleDownload = async (certName: string) => {
    // Simulate certificate download
    toast({
      title: "Certificate Downloaded!",
      description: `${certName} certificate saved successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-primary border-b border-navy-light/20">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Arivu 360" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-xl font-bold text-primary-foreground">Arivu 360</span>
          </Link>
          <LogoutButton onLogout={signOut} />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>

          {/* Profile card */}
          <div className="bg-card rounded-2xl p-8 shadow-card mb-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-hero flex items-center justify-center ring-4 ring-secondary/30">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {profile?.display_name || profile?.username || "User"}
                </h1>
                <p className="text-muted-foreground">@{profile?.username}</p>
                <span className="inline-block mt-1 text-xs font-semibold bg-secondary/15 text-secondary px-3 py-0.5 rounded-full capitalize">
                  {role || "Student"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-semibold text-foreground truncate">{user.email}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-muted-foreground text-xs">Member since</p>
                <p className="font-semibold text-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Today"}
                </p>
              </div>
            </div>
          </div>

          {/* Certificates section */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-display font-bold text-foreground">
                My Certificates
              </h2>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No certificates yet. Complete courses to earn them!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between bg-muted/50 rounded-xl p-4 border border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {cert.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(cert.date).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                          Grade: {cert.grade}
                        </span>
                      </div>
                    </div>
                    <ParachuteDownloadButton
                      label="Download"
                      onDownload={() => handleDownload(cert.name)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Downloads history */}
          <div className="bg-card rounded-2xl p-8 shadow-card mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-display font-bold text-foreground">
                Download History
              </h2>
              {downloads.length > 0 && (
                <span className="ml-auto text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {downloads.length} {downloads.length === 1 ? "video" : "videos"}
                </span>
              )}
            </div>

            {downloadsLoading ? (
              <p className="text-muted-foreground text-sm text-center py-8">Loading…</p>
            ) : downloads.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No downloads yet. Visit the Courses page to download videos.
                </p>
                <Link
                  to="/courses"
                  className="inline-block mt-4 text-sm font-semibold text-secondary hover:underline"
                >
                  Browse Courses →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {downloads.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-4 bg-muted/50 rounded-xl p-4 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {d.course_title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(d.downloaded_at).toLocaleString()}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Profile;
