import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { progressAPI, badgeAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Medal, Flame, Lock, Loader2, Trophy, Star, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
}

interface StudentProgress {
  streak: number;
  badges: string[];
  xp: number;
  level: number;
}

const badgeIcons: Record<string, string> = {
  seedling: '🌱',
  globe: '🌍',
  brain: '🧠',
  fire: '🔥',
  star: '⭐',
  rocket: '🚀',
  crown: '👑',
  trophy: '🏆',
  lightning: '⚡',
  heart: '❤️',
  book: '📚',
  medal: '🥇',
};

const StudentBadges = () => {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
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
      setAllBadges(badgesRes.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to load badges data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const earnedBadgeIds = progress?.badges || [];
  const earnedBadges = allBadges.filter((b) => earnedBadgeIds.includes(b._id));
  const lockedBadges = allBadges.filter((b) => !earnedBadgeIds.includes(b._id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-xp/10 via-primary/10 to-streak/10 rounded-2xl p-6 md:p-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Medal className="h-8 w-8 text-xp" />
          Streaks & Badges
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and collect achievements!
        </p>
      </motion.div>

      {/* Streak Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-streak" />
            Daily Login Streak
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-streak/10 flex items-center justify-center">
              <span className="text-4xl font-display font-bold text-streak">
                {progress?.streak || 0}
              </span>
            </div>
            <Flame className="absolute -top-1 -right-1 h-8 w-8 text-streak animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {progress?.streak || 0} Day{(progress?.streak || 0) !== 1 ? 's' : ''}
            </p>
            <p className="text-muted-foreground">
              Keep logging in daily to maintain your streak!
            </p>
            <div className="mt-3 flex items-center gap-2">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i < (progress?.streak || 0) % 7
                      ? 'bg-streak text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            label: 'Total XP',
            value: progress?.xp?.toLocaleString() || '0',
            icon: Zap,
            color: 'text-xp bg-xp/10',
          },
          {
            label: 'Current Level',
            value: progress?.level || 1,
            icon: Star,
            color: 'text-primary bg-primary/10',
          },
          {
            label: 'Badges Earned',
            value: earnedBadges.length,
            icon: Trophy,
            color: 'text-xp bg-xp/10',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
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

      {/* Earned Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-xp" />
          Your Badges ({earnedBadges.length})
        </h2>

        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {earnedBadges.map((badge, i) => (
              <motion.div
                key={badge._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="bg-gradient-to-br from-xp/10 to-primary/10 border border-xp/30 rounded-xl p-4 text-center hover:scale-105 transition-transform"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-xp/20 flex items-center justify-center text-3xl mb-3">
                  {badgeIcons[badge.icon] || '🏅'}
                </div>
                <p className="font-medium text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{badge.xpReward} XP
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Complete activities to earn your first badge!
            </p>
          </div>
        )}
      </motion.div>

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Badges to Unlock ({lockedBadges.length})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lockedBadges.map((badge, i) => (
              <motion.div
                key={badge._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="bg-muted/50 border border-border rounded-xl p-4 text-center opacity-60"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center text-3xl mb-3 grayscale">
                  {badgeIcons[badge.icon] || '🏅'}
                </div>
                <p className="font-medium text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.requirement}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentBadges;
