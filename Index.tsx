import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { BookOpen, Video, Trophy, Globe, Wifi, Languages, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.jpg";
import Testimonials from "@/components/Testimonials";
import { useAuth } from "@/contexts/AuthContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
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

const Index = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-navy-light/20">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Arivu 360 Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-xl font-bold text-primary-foreground">
              Arivu 360
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-primary-foreground/80">
            <Link to="/features" className="hover:text-secondary transition-colors">Features</Link>
            <Link to="/courses" className="hover:text-secondary transition-colors">Courses</Link>
            <Link to="/plans" className="hover:text-secondary transition-colors">Plans</Link>
            <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="hidden md:inline-block bg-gradient-cta text-primary font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-block bg-gradient-cta text-primary font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-primary-foreground" aria-label="Open menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary border-l border-secondary/20 w-72 p-0">
                <nav className="flex flex-col gap-1 pt-12 px-6">
                  <Link to="/features" onClick={() => setMobileOpen(false)} className="text-primary-foreground/80 hover:text-secondary py-3 text-lg font-medium transition-colors">Features</Link>
                  <Link to="/courses" onClick={() => setMobileOpen(false)} className="text-primary-foreground/80 hover:text-secondary py-3 text-lg font-medium transition-colors">Courses</Link>
                  <Link to="/plans" onClick={() => setMobileOpen(false)} className="text-primary-foreground/80 hover:text-secondary py-3 text-lg font-medium transition-colors">Plans</Link>
                  <Link to="/about" onClick={() => setMobileOpen(false)} className="text-primary-foreground/80 hover:text-secondary py-3 text-lg font-medium transition-colors">About</Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-primary-foreground/80 hover:text-secondary py-3 text-lg font-medium transition-colors">Contact</Link>
                  <div className="border-t border-secondary/20 mt-4 pt-4">
                    {user ? (
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block bg-gradient-cta text-primary font-semibold text-center px-5 py-3 rounded-lg">Dashboard</Link>
                    ) : (
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="block bg-gradient-cta text-primary font-semibold text-center px-5 py-3 rounded-lg">Sign In</Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-hero relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center md:text-left"
              initial="hidden"
              animate="visible"
            >
              <motion.p
                custom={0}
                variants={fadeUp}
                className="text-secondary font-semibold text-sm uppercase tracking-widest mb-4"
              >
                Creative Educational Institute
              </motion.p>
              <motion.h1
                custom={1}
                variants={fadeUp}
                className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6"
              >
                A 360° View of{" "}
                <span className="text-gradient-gold">Knowledge</span>
              </motion.h1>
              <motion.p
                custom={2}
                variants={fadeUp}
                className="text-primary-foreground/70 text-lg md:text-xl max-w-lg mb-8"
              >
                Bridging the digital divide with holistic education — video lessons, interactive quizzes, and gamified milestones for every learner.
              </motion.p>
              <motion.div custom={3} variants={fadeUp} className="flex gap-4 justify-center md:justify-start">
                <Link
                  to="/features"
                  className="bg-gradient-cta text-primary font-bold px-8 py-3 rounded-lg text-lg shadow-gold hover:opacity-90 transition-opacity"
                >
                  Explore Features
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-secondary/40 text-primary-foreground font-semibold px-8 py-3 rounded-lg text-lg hover:border-secondary transition-colors"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-2xl animate-float" />
                <img
                  src={logo}
                  alt="Arivu 360 Logo"
                  className="relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover shadow-elevated"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              All-Around Learning
            </h2>
          </motion.div>
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
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section id="about" className="bg-primary py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.p>
            <motion.h2
              className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Empowering Every Learner
            </motion.h2>
            <motion.p
              className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Arivu 360 bridges the digital divide by providing a holistic, 360-degree educational experience for students in rural and urban areas alike. With offline access, vernacular language support in Kannada and Tamil, and gamified learning milestones, we make quality education accessible to everyone — regardless of geography or connectivity.
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-12 text-primary-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div>
                <p className="text-3xl font-display font-bold text-gradient-gold">500+</p>
                <p className="text-primary-foreground/60 text-sm mt-1">Video Lessons</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gradient-gold">10K+</p>
                <p className="text-primary-foreground/60 text-sm mt-1">Students</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gradient-gold">3</p>
                <p className="text-primary-foreground/60 text-sm mt-1">Languages</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-cta rounded-2xl p-12 md:p-16 text-center shadow-gold"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-primary/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of students experiencing 360-degree education. Sign up today and unlock your potential.
            </p>
            <a
              href="mailto:arivu360@example.com"
              className="inline-block bg-primary text-primary-foreground font-bold px-10 py-4 rounded-lg text-lg hover:bg-navy-light transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-10 border-t border-navy-light/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Arivu 360" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-lg font-bold text-primary-foreground">Arivu 360</span>
          </div>
          <p className="text-primary-foreground/50 text-sm">
            © 2026 Arivu 360 Creative Educational Institute. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
