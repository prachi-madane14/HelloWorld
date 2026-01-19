import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Users, Brain, FileText, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const quickStats = [
  { label: 'Total Classes', value: '4', icon: Users, color: 'text-primary bg-primary/10' },
  { label: 'Active Quizzes', value: '12', icon: Brain, color: 'text-accent bg-accent/10' },
  { label: 'Content Shared', value: '8', icon: FileText, color: 'text-secondary bg-secondary/10' },
  { label: 'Unread Messages', value: '3', icon: MessageSquare, color: 'text-streak bg-streak/10' },
];

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-6 md:p-8"
      >
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
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-5 border border-border"
          >
            <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h2 className="font-display text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { text: 'Sofia M. completed "Spanish Basics" quiz', time: '5 min ago', emoji: '📝' },
            { text: 'New student joined "French 101" class', time: '1 hour ago', emoji: '👋' },
            { text: 'Alex K. reached Level 5!', time: '2 hours ago', emoji: '🎉' },
            { text: 'Quiz "Japanese Greetings" created', time: 'Yesterday', emoji: '🇯🇵' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 py-2">
              <span className="text-2xl">{activity.emoji}</span>
              <div className="flex-1">
                <p className="font-medium">{activity.text}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
