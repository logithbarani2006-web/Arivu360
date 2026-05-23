import { motion, type Variants } from "framer-motion";
import { BookOpen, Video, Trophy, Globe, Wifi, Languages, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Video,
    title: "Video Lessons",
    description: "High-quality video content from expert educators, available anytime.",
  },
  {
    icon: BookOpen,
    title: "Interactive Quizzes",
    description: "Test your knowledge with gamified quizzes and instant feedback.",
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Visual dashboards to monitor your learning milestones and achievements.",
  },
  {
    icon: Wifi,
    title: "Offline Access",
    description: "Download lessons and learn without an internet connection.",
  },
  {
    icon: Languages,
    title: "Vernacular Support",
    description: "Learn in Kannada, Tamil, and more regional languages.",
  },
  {
    icon: Globe,
    title: "360° Learning",
    description: "A holistic curriculum covering academics, life skills, and creativity.",
  },
];

const Features = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-hero pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">All-Around Learning</h1>
        </motion.div>
      </div>
    </div>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-shadow group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-5 group-hover:bg-gradient-cta transition-colors">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Features;
