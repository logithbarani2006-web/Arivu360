import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-hero pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">Empowering Every Learner</h1>
        </motion.div>
      </div>
    </div>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Arivu 360 bridges the digital divide by providing a holistic, 360-degree educational experience for students in rural and urban areas alike. With offline access, vernacular language support in Kannada and Tamil, and gamified learning milestones, we make quality education accessible to everyone — regardless of geography or connectivity.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-gradient-gold">500+</p>
              <p className="text-muted-foreground text-sm mt-1">Video Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-gradient-gold">10K+</p>
              <p className="text-muted-foreground text-sm mt-1">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-gradient-gold">3</p>
              <p className="text-muted-foreground text-sm mt-1">Languages</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
