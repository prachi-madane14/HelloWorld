import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI, teacherQuizAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import {
  Gamepad2,
  Trophy,
  History,
  Loader2,
  Play,
  CheckCircle,
  XCircle,
  Crown,
  Medal,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface QuizHistory {
  _id: string;
  quizId: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  attemptedAt: string;
  xpEarned: number;
}

interface LeaderboardEntry {
  _id: string;
  name: string;
  xp: number;
  level: number;
  rank: number;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  country?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: any[];
}

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
};

const StudentQuizzes = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quiz playing state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    xp: number;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [historyRes, leaderboardRes, quizzesRes] = await Promise.all([
        quizAPI.getHistory(),
        quizAPI.getLeaderboard(),
        teacherQuizAPI.getAll(),
      ]);
      setQuizHistory(historyRes.data);
      setLeaderboard(leaderboardRes.data);
      setAvailableQuizzes(quizzesRes.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to load quiz data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerIndex });
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;

    try {
      setIsSubmitting(true);
      const response = await quizAPI.submit({
        quizId: activeQuiz._id,
        answers: selectedAnswers,
      });

      setQuizResult({
        score: response.data.score,
        total: activeQuiz.questions.length,
        xp: response.data.xpEarned,
      });

      // Refresh history
      const historyRes = await quizAPI.getHistory();
      setQuizHistory(historyRes.data);

      toast({
        title: 'Quiz Completed!',
        description: `You earned ${response.data.xpEarned} XP!`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setSelectedAnswers({});
    setCurrentQuestion(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Quiz result screen
  if (quizResult) {
    const percentage = Math.round((quizResult.score / quizResult.total) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div
          className={`h-24 w-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            percentage >= 70
              ? 'bg-green-500/20 text-green-500'
              : percentage >= 40
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-red-500/20 text-red-500'
          }`}
        >
          {percentage >= 70 ? (
            <Trophy className="h-12 w-12" />
          ) : percentage >= 40 ? (
            <CheckCircle className="h-12 w-12" />
          ) : (
            <XCircle className="h-12 w-12" />
          )}
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">
          {percentage >= 70
            ? 'Excellent!'
            : percentage >= 40
            ? 'Good Job!'
            : 'Keep Practicing!'}
        </h1>

        <p className="text-muted-foreground mb-8">
          You scored {quizResult.score} out of {quizResult.total}
        </p>

        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-4xl font-display font-bold text-primary">
                {percentage}%
              </p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-xp">
                +{quizResult.xp}
              </p>
              <p className="text-sm text-muted-foreground">XP Earned</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={exitQuiz}>
            Back to Quizzes
          </Button>
          <Button onClick={() => startQuiz(activeQuiz!)}>Try Again</Button>
        </div>
      </motion.div>
    );
  }

  // Active quiz screen
  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl font-bold">{activeQuiz.title}</h1>
          <Button variant="ghost" onClick={exitQuiz}>
            Exit
          </Button>
        </div>

        <Progress value={progress} className="h-2 mb-8" />

        <p className="text-sm text-muted-foreground mb-2">
          Question {currentQuestion + 1} of {activeQuiz.questions.length}
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{question?.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question?.options?.map((option: string, i: number) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(currentQuestion, i)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAnswers[currentQuestion] === i
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion < activeQuiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={submitQuiz}
              disabled={
                isSubmitting ||
                Object.keys(selectedAnswers).length !== activeQuiz.questions.length
              }
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Submit Quiz'
              )}
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-accent/10 to-xp/10 rounded-2xl p-6 md:p-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Gamepad2 className="h-8 w-8 text-primary" />
          Quiz Zone
        </h1>
        <p className="text-muted-foreground text-lg">
          Test your knowledge and climb the leaderboard!
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" className="gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Available</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        {/* Available Quizzes */}
        <TabsContent value="available" className="mt-6">
          {availableQuizzes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableQuizzes.map((quiz, i) => (
                <motion.div
                  key={quiz._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <Badge
                          className={difficultyColors[quiz.difficulty]}
                          variant="secondary"
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>
                        {quiz.description || 'Test your knowledge!'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {quiz.questions?.length || 0} questions
                        </span>
                        {quiz.country && (
                          <span className="text-sm text-primary">
                            🌍 {quiz.country}
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full gap-2"
                        onClick={() => startQuiz(quiz)}
                      >
                        <Play className="h-4 w-4" />
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No quizzes available yet. Check back later!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quiz History */}
        <TabsContent value="history" className="mt-6">
          {quizHistory.length > 0 ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>XP Earned</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizHistory.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-medium">
                        {entry.quizName}
                      </TableCell>
                      <TableCell>
                        {entry.score}/{entry.totalQuestions} (
                        {Math.round(
                          (entry.score / entry.totalQuestions) * 100
                        )}
                        %)
                      </TableCell>
                      <TableCell className="text-xp">
                        +{entry.xpEarned} XP
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(entry.attemptedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  You haven't taken any quizzes yet. Start playing!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="mt-6">
          {leaderboard.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-xp" />
                  Top Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry, i) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        i === 0
                          ? 'bg-xp/10 border border-xp/30'
                          : i === 1
                          ? 'bg-gray-400/10 border border-gray-400/30'
                          : i === 2
                          ? 'bg-amber-700/10 border border-amber-700/30'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full font-bold">
                        {i === 0 ? (
                          <Crown className="h-6 w-6 text-xp" />
                        ) : i === 1 ? (
                          <Medal className="h-6 w-6 text-gray-400" />
                        ) : i === 2 ? (
                          <Award className="h-6 w-6 text-amber-700" />
                        ) : (
                          <span className="text-muted-foreground">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Level {entry.level}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-xp">
                          {entry.xp.toLocaleString()} XP
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No leaderboard data yet. Be the first to climb!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentQuizzes;
