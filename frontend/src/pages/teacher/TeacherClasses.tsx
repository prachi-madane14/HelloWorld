import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classAPI, progressAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, Users, Copy, Trash2, Loader2, Trophy, Target, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassData {
  _id: string;
  name: string;
  description?: string;
  classCode: string;
  studentCount?: number;
  createdAt: string;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  xp: number;
  level: number;
  countriesExplored: string[];
  badges: string[];
}

const TeacherClasses = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [classProgress, setClassProgress] = useState<StudentProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    if (!user?._id) return;
    try {
      const response = await classAPI.getByTeacher(user._id);
      setClasses(response.data.classes || response.data || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      // Demo data for preview
      setClasses([
        { _id: '1', name: 'Spanish 101', classCode: 'ESP101', createdAt: new Date().toISOString() },
        { _id: '2', name: 'French Beginners', classCode: 'FRN001', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassProgress = async (classId: string) => {
    setProgressLoading(true);
    try {
      const response = await progressAPI.getClassProgress(classId);
      setClassProgress(response.data.students || response.data || []);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Demo data
      setClassProgress([
        { studentId: '1', studentName: 'Sofia Martinez', xp: 3240, level: 7, countriesExplored: ['Spain', 'Mexico'], badges: ['streak-7', 'quiz-master'] },
        { studentId: '2', studentName: 'Alex Kim', xp: 2980, level: 6, countriesExplored: ['France', 'Canada'], badges: ['explorer'] },
        { studentId: '3', studentName: 'Emma Liu', xp: 2750, level: 6, countriesExplored: ['Japan'], badges: ['polyglot'] },
      ]);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast({ title: 'Please enter a class name', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      const response = await classAPI.create({ 
        name: newClassName, 
        description: newClassDescription 
      });
      setClasses([...classes, response.data]);
      setNewClassName('');
      setNewClassDescription('');
      setCreateDialogOpen(false);
      toast({ title: 'Class created!', description: 'Share the class code with your students.' });
    } catch (error) {
      toast({ title: 'Failed to create class', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await classAPI.delete(classId);
      setClasses(classes.filter(c => c._id !== classId));
      if (selectedClass?._id === classId) {
        setSelectedClass(null);
        setClassProgress([]);
      }
      toast({ title: 'Class deleted' });
    } catch (error) {
      toast({ title: 'Failed to delete class', variant: 'destructive' });
    }
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Class code copied!' });
  };

  const handleSelectClass = (classData: ClassData) => {
    setSelectedClass(classData);
    fetchClassProgress(classData._id);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and track student progress</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  placeholder="e.g., Spanish 101"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classDesc">Description (optional)</Label>
                <Input
                  id="classDesc"
                  placeholder="Brief description"
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateClass} className="w-full" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Classes List */}
        <div className="lg:col-span-1 space-y-4">
          {classes.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No classes yet. Create your first class!</p>
            </div>
          ) : (
            classes.map((classData, index) => (
              <motion.div
                key={classData._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectClass(classData)}
                className={`bg-card rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  selectedClass?._id === classData._id 
                    ? 'border-primary shadow-md' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{classData.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(classData._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-muted px-2 py-1 rounded font-mono">{classData.classCode}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyClassCode(classData.classCode);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Student Progress / Leaderboard */}
        <div className="lg:col-span-2">
          {selectedClass ? (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold">{selectedClass.name}</h2>
                  <p className="text-muted-foreground">Student Leaderboard</p>
                </div>
                <Trophy className="h-8 w-8 text-xp" />
              </div>

              {progressLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : classProgress.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students have joined this class yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {classProgress
                    .sort((a, b) => b.xp - a.xp)
                    .map((student, index) => (
                      <motion.div
                        key={student.studentId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background font-bold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{student.studentName}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" /> Level {student.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" /> {student.countriesExplored.length} countries
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xp">{student.xp.toLocaleString()} XP</p>
                          <div className="flex gap-1">
                            {student.badges.slice(0, 3).map((badge, i) => (
                              <span key={i} className="text-sm">🏅</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center h-full flex flex-col items-center justify-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Select a Class</h3>
              <p className="text-muted-foreground">Click on a class to view student progress and leaderboard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClasses;
