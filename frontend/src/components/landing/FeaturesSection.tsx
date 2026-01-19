import { motion } from 'framer-motion';
import { 
  GraduationCap, Users, BarChart3, MessageSquare, 
  Map, Flame, Medal, Notebook, Gamepad2, Globe
} from 'lucide-react';

const studentFeatures = [
  { icon: Map, title: 'World Map Journey', description: 'Explore countries and unlock new destinations' },
  { icon: Flame, title: 'Daily Streaks', description: 'Build habits with streak rewards' },
  { icon: Medal, title: 'Badges & Achievements', description: 'Earn badges for your accomplishments' },
  { icon: Notebook, title: 'Personal Notebook', description: 'Save phrases and notes for later' },
  { icon: Gamepad2, title: 'Quiz Games', description: 'Test knowledge with fun quizzes' },
  { icon: MessageSquare, title: 'Teacher Chat', description: 'Get help from your teacher anytime' },
];

const teacherFeatures = [
  { icon: Users, title: 'Class Management', description: 'Create and manage multiple classes' },
  { icon: GraduationCap, title: 'Custom Quizzes', description: 'Build quizzes tailored to your lessons' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track student progress and engagement' },
  { icon: MessageSquare, title: 'Student Communication', description: 'Chat directly with students' },
  { icon: Globe, title: 'Content Uploads', description: 'Share facts and resources with classes' },
  { icon: Medal, title: 'Leaderboards', description: 'View and manage class rankings' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Features for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a student exploring languages or a teacher guiding the journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Student Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold">For Students</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {studentFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Teacher Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold">For Teachers</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {teacherFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-card rounded-xl p-4 border border-border hover:border-accent/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
