import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { progressAPI, badgeAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Flame, Trophy, Globe, Target, Zap, Medal, Map, Gamepad2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface StudentProgress {
  _id: string;
  xp: number;
  level: number;
  streak: number;
  countriesVisited: string[];
  badges: string[];
  nextLevelXP?: number;
}

interface Badge {
  _id: string;
  name: string;
  icon: string;
}

const badgeEmojis: Record<string, string> = {
  seedling: '🌱',
  globe: '🌍',
  brain: '🧠',
  fire: '🔥',
  star: '⭐',
  rocket: '🚀',
  crown: '👑',
  trophy: '🏆',
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [progressRes, badgesRes] = await Promise.all([
        progressAPI.getStudentProgress(),
        badgeAPI.getAll(),
      ]);
      setProgress(progressRes.data);
      setBadges(badgesRes.data);
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate next level XP (simple formula: level * 500)
  const nextLevelXP = progress?.nextLevelXP || (progress?.level || 1) * 500 + 500;
  const xpProgress = progress ? (progress.xp / nextLevelXP) * 100 : 0;

  // Get earned badges
  const earnedBadgeIds = progress?.badges || [];
  const earnedBadges = badges.filter((b) => earnedBadgeIds.includes(b._id));

  // Calculate countries percentage (out of ~20 available countries)
  const totalCountries = 20;
  const countriesExplored = progress?.countriesVisited?.length || 0;
  const countriesPercentage = Math.round((countriesExplored / totalCountries) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 rounded-2xl p-6 md:p-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 🌍
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to explore the world today?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total XP',
            value: (progress?.xp || 0).toLocaleString(),
            icon: Zap,
            color: 'text-xp bg-xp/10',
          },
          {
            label: 'Level',
            value: progress?.level || 1,
            icon: Target,
            color: 'text-primary bg-primary/10',
          },
          {
            label: 'Day Streak',
            value: `${progress?.streak || 0} 🔥`,
            icon: Flame,
            color: 'text-streak bg-streak/10',
          },
          {
            label: 'Countries',
            value: `${countriesExplored} (${countriesPercentage}%)`,
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
            <div
              className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Level Progress</h2>
          <span className="text-sm text-muted-foreground">
            {progress?.xp || 0} / {nextLevelXP} XP
          </span>
        </div>
        <Progress value={xpProgress} className="h-4" />
        <p className="text-sm text-muted-foreground mt-2">
          {nextLevelXP - (progress?.xp || 0)} XP to Level{' '}
          {(progress?.level || 1) + 1}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/student/map">
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex-col gap-2 hover:bg-map/10 hover:border-map/50 transition-colors"
          >
            <Map className="h-6 w-6 text-map" />
            <span>Explore Map</span>
          </Button>
        </Link>
        <Link to="/student/quizzes">
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-colors"
          >
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span>Take Quiz</span>
          </Button>
        </Link>
        <Link to="/student/badges">
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex-col gap-2 hover:bg-xp/10 hover:border-xp/50 transition-colors"
          >
            <Medal className="h-6 w-6 text-xp" />
            <span>View Badges</span>
          </Button>
        </Link>
        <Link to="/student/chat">
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex-col gap-2 hover:bg-accent/10 hover:border-accent/50 transition-colors"
          >
            <Trophy className="h-6 w-6 text-accent" />
            <span>Chat Teacher</span>
          </Button>
        </Link>
      </div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Your Badges</h2>
          <Link
            to="/student/badges"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        {earnedBadges.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {earnedBadges.slice(0, 6).map((badge, i) => (
              <motion.div
                key={badge._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="h-16 w-16 rounded-full bg-xp/10 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
                title={badge.name}
              >
                {badgeEmojis[badge.icon] || '🏅'}
              </motion.div>
            ))}
            {earnedBadges.length > 6 && (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                +{earnedBadges.length - 6}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Complete activities to earn badges!
            </p>
          </div>
        )}
      </motion.div>

      {/* Countries Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-map" />
            Countries Explored
          </h2>
          <Link
            to="/student/map"
            className="text-sm text-primary hover:underline"
          >
            View Map
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={countriesPercentage} className="flex-1 h-3" />
          <span className="text-sm font-medium">
            {countriesExplored}/{totalCountries}
          </span>
        </div>
        {progress?.countriesVisited && progress.countriesVisited.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {progress.countriesVisited.slice(0, 5).map((country) => (
              <span
                key={country}
                className="px-2 py-1 bg-map/10 text-map rounded-full text-xs font-medium"
              >
                {country}
              </span>
            ))}
            {progress.countriesVisited.length > 5 && (
              <span className="px-2 py-1 bg-muted rounded-full text-xs">
                +{progress.countriesVisited.length - 5} more
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDashboard;