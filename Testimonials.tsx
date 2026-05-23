import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Class 10 Student",
    location: "Bengaluru, Karnataka",
    quote:
      "Arivu 360 changed my life! The Kannada language support made complex science topics so easy to understand. I scored 95% in my board exams!",
    stars: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Parent",
    location: "Madurai, Tamil Nadu",
    quote:
      "My daughter can now learn even when our internet is down. The offline feature is a game-changer for families in rural areas like ours.",
    stars: 5,
  },
  {
    name: "Ananya Reddy",
    role: "Class 12 Student",
    location: "Mysuru, Karnataka",
    quote:
      "The gamified quizzes keep me motivated. I love earning badges and competing with friends. Learning has never been this fun!",
    stars: 5,
  },
  {
    name: "Mr. Venkatesh",
    role: "School Principal",
    location: "Coimbatore, Tamil Nadu",
    quote:
      "We adopted Arivu 360 for our entire school. The progress dashboards help teachers identify struggling students early and provide targeted support.",
    stars: 5,
  },
];

const Testimonials = () => (
  <section className="py-20 md:py-28 bg-muted/50">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
          Success Stories
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
          What Our Learners Say
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.stars }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 italic">
              "{t.quote}"
            </p>
            <div>
              <p className="font-display font-bold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">
                {t.role} · {t.location}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
