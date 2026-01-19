import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Brain, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const TeacherAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [avgXPData, setAvgXPData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any>({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [xpRes, countriesRes, quizRes] = await Promise.all([
        analyticsAPI.getAvgXP(),
        analyticsAPI.getCountries(),
        analyticsAPI.getQuizStats()
      ]);
      setAvgXPData(xpRes.data.data || xpRes.data || []);
      setCountryData(countriesRes.data.data || countriesRes.data || []);
      setQuizData(quizRes.data || {});
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Demo data
      setAvgXPData([
        { name: 'Sofia M.', xp: 3240 },
        { name: 'Alex K.', xp: 2980 },
        { name: 'Emma L.', xp: 2750 },
        { name: 'Lucas T.', xp: 2500 },
        { name: 'Mia R.', xp: 2200 },
      ]);
      setCountryData([
        { name: 'Spain', value: 45, fill: COLORS[0] },
        { name: 'France', value: 35, fill: COLORS[1] },
        { name: 'Japan', value: 28, fill: COLORS[2] },
        { name: 'Germany', value: 20, fill: COLORS[3] },
        { name: 'Italy', value: 15, fill: COLORS[4] },
      ]);
      setQuizData({
        totalAttempts: 156,
        avgScore: 78,
        completionRate: 92,
        topQuiz: 'Spanish Greetings'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your students' progress and engagement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Quiz Attempts', value: quizData.totalAttempts || 0, icon: Brain, color: 'text-primary bg-primary/10' },
          { label: 'Avg. Quiz Score', value: `${quizData.avgScore || 0}%`, icon: TrendingUp, color: 'text-accent bg-accent/10' },
          { label: 'Completion Rate', value: `${quizData.completionRate || 0}%`, icon: BarChart3, color: 'text-xp bg-xp/10' },
          { label: 'Countries Explored', value: countryData.length, icon: Globe, color: 'text-map bg-map/10' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* XP by Student */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-display text-xl font-bold mb-6">Average XP by Student</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgXPData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Countries Explored */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-display text-xl font-bold mb-6">Most Explored Countries</h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quiz Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="font-display text-xl font-bold mb-4">Quiz Performance Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-4xl font-bold text-primary mb-1">📊</p>
            <p className="font-semibold">{quizData.totalAttempts || 156} Attempts</p>
            <p className="text-sm text-muted-foreground">Total quiz submissions</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-4xl font-bold mb-1">🎯</p>
            <p className="font-semibold">{quizData.avgScore || 78}% Average</p>
            <p className="text-sm text-muted-foreground">Mean quiz score</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-4xl font-bold mb-1">🏆</p>
            <p className="font-semibold">{quizData.topQuiz || 'Spanish Greetings'}</p>
            <p className="text-sm text-muted-foreground">Most popular quiz</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherAnalytics;
