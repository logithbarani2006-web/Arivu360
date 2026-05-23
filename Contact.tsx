import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-hero pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground">Contact Us</h1>
        </motion.div>
      </div>
    </div>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-gradient-cta rounded-2xl p-12 md:p-16 text-center shadow-gold max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
            className="inline-block bg-primary text-primary-foreground font-bold px-10 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity"
          >
            Email Us
          </a>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            { icon: Mail, label: "Email", value: "arivu360@example.com" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Location", value: "Bengaluru, Karnataka" },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-xl p-6 shadow-card text-center">
              <item.icon className="w-6 h-6 text-secondary mx-auto mb-3" />
              <p className="font-display font-bold text-foreground">{item.label}</p>
              <p className="text-muted-foreground text-sm mt-1">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  </div>
);

export default Contact;
