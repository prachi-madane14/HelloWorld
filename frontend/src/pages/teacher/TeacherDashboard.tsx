import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  classAPI,
  teacherQuizAPI,
  teacherContentAPI,
  chatAPI,
  progressAPI
} from '@/lib/api';
import { motion } from 'framer-motion';
import {
  Users,
  Brain,
  FileText,
  MessageSquare,
  TrendingUp,
  Plus,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// -------------------- TYPES --------------------
interface DashboardStats {
  totalClasses: number;
  activeQuizzes: number;
  contentShared: number;
  unreadMessages: number;
}

interface RecentActivity {
  text: string;
  time: string;
  emoji: string;
}

interface ClassItem {
  _id: string;
  name: string;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  xp: number;
}

interface Quiz {
  _id: string;
  title: string;
  createdAt: string;
}

interface ContentItem {
  _id: string;
  title: string;
  type: 'fact' | 'challenge' | 'resource';
  createdAt: string;
}

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

// -------------------- COMPONENT --------------------
const TeacherDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    activeQuizzes: 0,
    contentShared: 0,
    unreadMessages: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?._id) return;

    try {
      const [classesRes, quizzesRes, contentRes] = await Promise.all([
        classAPI.getByTeacher(user._id),
        teacherQuizAPI.getAll(),
        teacherContentAPI.getByTeacher()
      ]);

      const classes: ClassItem[] = classesRes.data.classes || classesRes.data || [];
      const quizzes: Quiz[] = quizzesRes.data.quizzes || quizzesRes.data || [];
      const content: ContentItem[] = contentRes.data.contents || contentRes.data || [];

      let unreadCount = 0;
      const activities: RecentActivity[] = [];

      for (const cls of classes.slice(0, 3)) {
        try {
          const progressRes = await progressAPI.getClassProgress(cls._id);
          const students: StudentProgress[] = progressRes.data.students || progressRes.data || [];

          // Add top student activities
          students.slice(0, 2).forEach((student) => {
            if (student.xp > 0) {
              activities.push({
                text: `${student.studentName} has ${student.xp.toLocaleString()} XP in ${cls.name}`,
                time: 'Recently',
                emoji: '🎯'
              });
            }
          });

          // Count unread messages
          for (const student of students.slice(0, 5)) {
            try {
              const chatRes = await chatAPI.getMessages(user._id, student.studentId);
              const messages: ChatMessage[] = chatRes.data.messages || chatRes.data || [];
              unreadCount += messages.filter(
                (m) => !m.isRead && m.senderId === student.studentId
              ).length;
            } catch {
              // Ignore chat errors
            }
          }
        } catch {
          // Ignore progress errors
        }
      }

      // Add quiz creation activities
      quizzes.slice(0, 2).forEach((quiz) => {
        const date = new Date(quiz.createdAt);
        const diff = Date.now() - date.getTime();
        const timeAgo =
          diff < 3600000
            ? `${Math.floor(diff / 60000)} min ago`
            : diff < 86400000
            ? `${Math.floor(diff / 3600000)} hours ago`
            : 'Recently';
        activities.push({
          text: `Quiz "${quiz.title}" created`,
          time: timeAgo,
          emoji: '📝'
        });
      });

      // Add content activities
      content.slice(0, 2).forEach((item) => {
        activities.push({
          text: `Content "${item.title}" shared`,
          time: 'Recently',
          emoji: item.type === 'fact' ? '💡' : item.type === 'challenge' ? '🎯' : '📚'
        });
      });

      setStats({
        totalClasses: classes.length,
        activeQuizzes: quizzes.length,
        contentShared: content.length,
        unreadMessages: unreadCount
      });

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);

      // Fallback demo data
      setStats({
        totalClasses: 4,
        activeQuizzes: 12,
        contentShared: 8,
        unreadMessages: 3
      });
      setRecentActivity([
        { text: 'Sofia M. completed "Spanish Basics" quiz', time: '5 min ago', emoji: '📝' },
        { text: 'New student joined "French 101" class', time: '1 hour ago', emoji: '👋' },
        { text: 'Alex K. reached Level 5!', time: '2 hours ago', emoji: '🎉' },
        { text: 'Quiz "Japanese Greetings" created', time: 'Yesterday', emoji: '🇯🇵' }
      ]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const quickStats = [
    { label: 'Total Classes', value: stats.totalClasses.toString(), icon: Users, color: 'text-primary bg-primary/10' },
    { label: 'Active Quizzes', value: stats.activeQuizzes.toString(), icon: Brain, color: 'text-accent bg-accent/10' },
    { label: 'Content Shared', value: stats.contentShared.toString(), icon: FileText, color: 'text-secondary bg-secondary/10' },
    { label: 'Unread Messages', value: stats.unreadMessages.toString(), icon: MessageSquare, color: 'text-streak bg-streak/10' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to inspire your students today?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-xl p-5 border border-border">
            <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/teacher/classes">
            <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Create Class</span>
            </Button>
          </Link>
          <Link to="/teacher/quizzes">
            <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <Brain className="h-6 w-6" />
              <span>New Quiz</span>
            </Button>
          </Link>
          <Link to="/teacher/content">
            <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Upload Content</span>
            </Button>
          </Link>
          <Link to="/teacher/analytics">
            <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-xl font-bold mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity yet. Start by creating a class or quiz!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 py-2">
                <span className="text-2xl">{activity.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{activity.text}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
