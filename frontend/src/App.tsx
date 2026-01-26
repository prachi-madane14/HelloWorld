import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Teacher
import { TeacherLayout } from "./components/layouts/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherQuizzes from "./pages/teacher/TeacherQuizzes";
import TeacherContent from "./pages/teacher/TeacherContent";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherChat from "./pages/teacher/TeacherChat";

// Student
import { StudentLayout } from "./components/layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMap from "./pages/student/StudentMap";
import StudentBadges from "./pages/student/StudentBadges";
import StudentNotebook from "./pages/student/StudentNotebook";
import StudentQuizzes from "./pages/student/StudentQuizzes";
import StudentChat from "./pages/student/StudentChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Teacher Routes */}
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherLayout /></ProtectedRoute>}>
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="quizzes" element={<TeacherQuizzes />} />
              <Route path="content" element={<TeacherContent />} />
              <Route path="analytics" element={<TeacherAnalytics />} />
              <Route path="chat" element={<TeacherChat />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
              <Route index element={<StudentDashboard />} />
              <Route path="map" element={<StudentMap />} />
              <Route path="badges" element={<StudentBadges />} />
              <Route path="notebook" element={<StudentNotebook />} />
              <Route path="quizzes" element={<StudentQuizzes />} />
              <Route path="chat" element={<StudentChat />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
