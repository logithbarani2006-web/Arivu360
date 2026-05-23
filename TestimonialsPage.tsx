import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Testimonials from "@/components/Testimonials";

const TestimonialsPage = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-hero pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Success Stories</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">What Our Learners Say</h1>
        </motion.div>
      </div>
    </div>
    <Testimonials />
  </div>
);

export default TestimonialsPage;
