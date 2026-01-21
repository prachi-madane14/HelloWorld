import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Flame, Trophy, Globe, Target, Zap, Medal, Map, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { getStudentProgress } from '@/api/studentApi';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [progress, setProgress] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await getStudentProgress();
        setProgress(res.data);
        setBadges(res.data.badges || []);
      } catch (error) {
        console.error('Failed to load student progress', error);
      }
    };

    fetchProgress();
  }, []);

  if (!progress) {
    return (
      <div className="text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 rounded-2xl p-6 md:p-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Welcome, {user?.name?.split(' ')[0]}! 🌍
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to explore the world today?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: progress.xp.toLocaleString(), icon: Zap, color: 'text-xp bg-xp/10' },
          { label: 'Level', value: progress.level, icon: Target, color: 'text-primary bg-primary/10' },
          { label: 'Day Streak', value: `${progress.streak} 🔥`, icon: Flame, color: 'text-streak bg-streak/10' },
          {
            label: 'Countries',
            value: progress.countriesVisited?.length || 0,
            icon: Globe,
            color: 'text-map bg-map/10',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Level Progress</h2>
          <span className="text-sm text-muted-foreground">
            {progress.xp} / {progress.nextLevelXP} XP
          </span>
        </div>
        <Progress value={(progress.xp / progress.nextLevelXP) * 100} className="h-4" />
        <p className="text-sm text-muted-foreground mt-2">
          {progress.nextLevelXP - progress.xp} XP to Level {progress.level + 1}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/student/map">
          <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
            <Map className="h-6 w-6" />
            <span>Explore Map</span>
          </Button>
        </Link>
        <Link to="/student/quizzes">
          <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
            <Gamepad2 className="h-6 w-6" />
            <span>Take Quiz</span>
          </Button>
        </Link>
        <Link to="/student/badges">
          <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
            <Medal className="h-6 w-6" />
            <span>View Badges</span>
          </Button>
        </Link>
        <Link to="/student/chat">
          <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
            <Trophy className="h-6 w-6" />
            <span>Chat Teacher</span>
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h2 className="font-display text-xl font-bold mb-4">Your Badges</h2>
        <div className="flex gap-4">
          {badges.map((b, i) => (
            <div
              key={i}
              className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-3xl"
            >
              {b}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
