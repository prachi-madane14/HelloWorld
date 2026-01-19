import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Target, Zap, Award } from 'lucide-react';

const badges = [
  { name: 'First Steps', emoji: '🌱', color: 'bg-green-500' },
  { name: 'Globe Trotter', emoji: '🌍', color: 'bg-blue-500' },
  { name: 'Quiz Master', emoji: '🧠', color: 'bg-purple-500' },
  { name: 'Streak King', emoji: '🔥', color: 'bg-orange-500' },
  { name: 'Polyglot', emoji: '📚', color: 'bg-pink-500' },
  { name: 'Explorer', emoji: '🧭', color: 'bg-cyan-500' },
];

export function GamificationSection() {
  return (
    <section id="gamification" className="py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Learn with <span className="text-gradient">Gamification</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay motivated with XP, streaks, badges, and leaderboards
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* XP System */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-6 shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-xp/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-xp" />
              </div>
              <h3 className="font-display text-xl font-bold">XP & Levels</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Earn experience points for every lesson, quiz, and country you explore. Level up to unlock new content!
            </p>
            
            {/* XP Bar Demo */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Level 7</span>
                <span className="text-muted-foreground">2,450 / 3,000 XP</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '82%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-xp to-secondary rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">550 XP to Level 8</p>
            </div>
          </motion.div>

          {/* Streaks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-streak/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-streak" />
              </div>
              <h3 className="font-display text-xl font-bold">Daily Streaks</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Keep your streak alive! Practice daily to build habits and earn bonus XP rewards.
            </p>
            
            {/* Streak Demo */}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <motion.div
                  key={day}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: day * 0.05 }}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${
                    day <= 5 
                      ? 'bg-streak/20 border-2 border-streak' 
                      : 'bg-muted border-2 border-border'
                  }`}
                >
                  {day <= 5 ? '🔥' : day === 6 ? '📅' : '📅'}
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-4 font-medium">
              <span className="text-streak">5 day</span> streak! 🔥
            </p>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold">Leaderboards</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Compete with classmates and climb the rankings. Who will be #1 this week?
            </p>
            
            {/* Leaderboard Demo */}
            <div className="space-y-2">
              {[
                { rank: 1, name: 'Sofia M.', xp: 3240, emoji: '🥇' },
                { rank: 2, name: 'Alex K.', xp: 2980, emoji: '🥈' },
                { rank: 3, name: 'Emma L.', xp: 2750, emoji: '🥉' },
              ].map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <span className="text-lg">{player.emoji}</span>
                  <span className="font-medium flex-1">{player.name}</span>
                  <span className="text-sm text-xp font-semibold">{player.xp} XP</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Badges Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="font-display text-2xl font-bold mb-6">Collect Badges</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`h-16 w-16 rounded-full ${badge.color}/20 flex items-center justify-center text-3xl shadow-lg border-2 ${badge.color}/30`}>
                  {badge.emoji}
                </div>
                <span className="text-sm font-medium">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
