import { useState, useEffect } from 'react';
import { teacherQuizAPI, classAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, Brain, Trash2, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  _id: string;
  title: string;
  country: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: any[];
  classId?: string;
  createdAt: string;
}

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
}

const COUNTRIES = ['Spain', 'France', 'Japan', 'Germany', 'Italy', 'Brazil', 'China', 'India', 'Mexico', 'Korea'];

const TeacherQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [questions, setQuestions] = useState<QuestionData[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [quizzesRes, classesRes] = await Promise.all([
        teacherQuizAPI.getAll(),
        user?._id ? classAPI.getByTeacher(user._id) : Promise.resolve({ data: [] })
      ]);
      setQuizzes(quizzesRes.data.quizzes || quizzesRes.data || []);
      setClasses(classesRes.data.classes || classesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Demo data
      setQuizzes([
        { _id: '1', title: 'Spanish Greetings', country: 'Spain', difficulty: 'easy', questions: [], createdAt: new Date().toISOString() },
        { _id: '2', title: 'French Cuisine', country: 'France', difficulty: 'medium', questions: [], createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[index].question = value;
    } else if (field === 'correctAnswer') {
      updated[index].correctAnswer = value;
    }
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleCreateQuiz = async () => {
    if (!title.trim() || !country) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const validQuestions = questions.filter(q => 
      q.question.trim() && q.options.every(o => o.trim())
    );

    if (validQuestions.length === 0) {
      toast({ title: 'Please add at least one complete question', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      const response = await teacherQuizAPI.create({
        title,
        country,
        difficulty,
        classId: selectedClassId || undefined,
        questions: validQuestions
      });
      setQuizzes([...quizzes, response.data]);
      resetForm();
      setCreateDialogOpen(false);
      toast({ title: 'Quiz created!' });
    } catch (error) {
      toast({ title: 'Failed to create quiz', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await teacherQuizAPI.delete(quizId);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      toast({ title: 'Quiz deleted' });
    } catch (error) {
      toast({ title: 'Failed to delete quiz', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setTitle('');
    setCountry('');
    setDifficulty('medium');
    setSelectedClassId('');
    setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-xp/10 text-xp';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Quiz Builder</h1>
          <p className="text-muted-foreground">Create custom quizzes for your students</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quiz Title</Label>
                  <Input
                    placeholder="e.g., Spanish Greetings"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign to Class (optional)</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All classes</SelectItem>
                      {classes.map((c: any) => (
                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Questions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-1" /> Add Question
                  </Button>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Label>Question {qIndex + 1}</Label>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      placeholder="Enter your question..."
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                            className="accent-primary"
                          />
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Select the radio button for the correct answer</p>
                  </div>
                ))}
              </div>

              <Button onClick={handleCreateQuiz} className="w-full" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                Create Quiz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">No Quizzes Yet</h3>
          <p className="text-muted-foreground">Create your first quiz to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-map" />
                  <span className="text-sm text-muted-foreground">{quiz.country}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive h-8 w-8"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">
                  {quiz.questions?.length || 0} questions
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherQuizzes;
