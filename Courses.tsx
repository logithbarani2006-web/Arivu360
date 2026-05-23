import { motion, type Variants } from "framer-motion";
import { BookOpen, FlaskConical, Calculator, Palette, Globe, Code, ArrowLeft, Download, Check, Loader2, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const categories = ["All", "Science", "Mathematics", "Languages", "Arts", "Technology"];

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  FlaskConical,
  Calculator,
  Palette,
  Globe,
  Code,
};

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  language: string;
  lessons: number;
  icon: string;
  video_path: string | null;
}

type DownloadState = "idle" | "downloading" | "complete";

const VideoDownloadButton = ({ course }: { course: Course }) => {
  const [state, setState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state !== "idle") return;

    if (!course.video_path) {
      toast.error("Video not available yet for this course");
      return;
    }

    setState("downloading");
    setProgress(0);

    try {
      const { data: pub } = supabase.storage
        .from("course-videos")
        .getPublicUrl(course.video_path);

      const response = await fetch(pub.publicUrl);
      if (!response.ok) throw new Error(`Download failed (${response.status})`);

      const total = Number(response.headers.get("Content-Length")) || 0;
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming not supported");

      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total > 0) setProgress(Math.round((received / total) * 100));
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: response.headers.get("Content-Type") || "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = course.video_path.split(".").pop() || "mp4";
      a.download = `${course.slug}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setProgress(100);
      setState("complete");
      toast.success(`"${course.title}" downloaded`);

      // Record in download history (best-effort)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("video_downloads").insert({
          user_id: user.id,
          course_id: course.id,
          course_title: course.title,
        });
      }

      setTimeout(() => {
        setState("idle");
        setProgress(0);
      }, 2500);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Download failed");
      setState("idle");
      setProgress(0);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={state !== "idle"}
      className="relative w-full flex items-center justify-center gap-2 border-2 border-secondary text-secondary font-semibold py-2.5 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors text-sm overflow-hidden disabled:opacity-100"
    >
      {state === "downloading" && (
        <span
          className="absolute inset-y-0 left-0 bg-secondary/20"
          style={{ width: `${progress}%`, transition: "width 150ms linear" }}
        />
      )}
      <span className="relative flex items-center gap-2">
        {state === "idle" && (
          <>
            <Download className="w-4 h-4" />
            Download Video
          </>
        )}
        {state === "downloading" && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Downloading {progress}%
          </>
        )}
        {state === "complete" && (
          <>
            <Check className="w-4 h-4" />
            Downloaded
          </>
        )}
      </span>
    </button>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, description, category, language, lessons, icon, video_path")
        .order("sort_order", { ascending: true });
      if (error) {
        toast.error("Failed to load courses");
        console.error(error);
      } else {
        setCourses((data || []) as Course[]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-hero pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
              Explore & Enroll
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Our Courses
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Browse our comprehensive curriculum spanning science, math, languages, arts, and technology — all available in regional languages.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-5 py-2 rounded-full text-sm font-medium bg-card shadow-card text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => {
                const Icon = iconMap[course.icon] || BookOpen;
                return (
                  <motion.div
                    key={course.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow group flex flex-col"
                  >
                    <div className="p-8 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:bg-gradient-cta transition-colors">
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{course.lessons} lessons</span>
                        <span>·</span>
                        <span>{course.language}</span>
                      </div>
                    </div>
                    <div className="px-8 pb-8 space-y-2">
                      <button className="w-full bg-gradient-cta text-primary font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm">
                        Enroll Now
                      </button>
                      <VideoDownloadButton course={course} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;
