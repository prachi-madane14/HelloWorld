import { motion } from 'framer-motion';
import { Map, BookOpen, Brain, Trophy } from 'lucide-react';

const steps = [
  {
    icon: Map,
    title: 'Explore the Map',
    description: 'Choose a country on the interactive world map and discover its culture, traditions, and language.',
    color: 'bg-map/10 text-map',
  },
  {
    icon: BookOpen,
    title: 'Learn & Discover',
    description: 'Dive into curated lessons with phrases, facts, and cultural insights from native speakers.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Brain,
    title: 'Take Quizzes',
    description: 'Test your knowledge with interactive quizzes designed to reinforce what you\'ve learned.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Trophy,
    title: 'Earn XP & Badges',
    description: 'Gain experience points, unlock achievements, and climb the leaderboard!',
    color: 'bg-xp/10 text-xp',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to language mastery in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative bg-card rounded-2xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
