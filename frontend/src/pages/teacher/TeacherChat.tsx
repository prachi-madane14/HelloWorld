import { useState, useEffect, useRef, useCallback } from 'react';
import { chatAPI, classAPI, progressAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send, Loader2, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/* ================= TYPES ================= */

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Student {
  _id: string;
  studentId: string;
  studentName: string;
  email?: string;
}

interface Class {
  _id: string;
}

interface ProgressStudent {
  _id?: string;
  studentId?: string;
  studentName?: string;
  name?: string;
}

/* ================= COMPONENT ================= */

const TeacherChat = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = useCallback(async () => {
    if (!user?._id) return;

    try {
      const classesRes = await classAPI.getByTeacher(user._id);
      const classes: Class[] = classesRes.data.classes ?? classesRes.data ?? [];

      const collectedStudents: Student[] = [];

      for (const cls of classes) {
        const progressRes = await progressAPI.getClassProgress(cls._id);
        const studentsData: ProgressStudent[] =
          progressRes.data.students ?? progressRes.data ?? [];

        studentsData.forEach((s) => {
          const id = s.studentId ?? s._id;
          if (!id) return;

          collectedStudents.push({
            _id: id,
            studentId: id,
            studentName: s.studentName ?? s.name ?? 'Unknown Student',
          });
        });
      }

      const uniqueStudents = Array.from(
        new Map(collectedStudents.map((s) => [s.studentId, s])).values()
      );

      setStudents(uniqueStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);

      // Demo fallback
      setStudents([
        { _id: '1', studentId: '1', studentName: 'Sofia Martinez' },
        { _id: '2', studentId: '2', studentName: 'Alex Kim' },
        { _id: '3', studentId: '3', studentName: 'Emma Liu' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ================= FETCH MESSAGES ================= */

  const fetchMessages = async (studentId: string) => {
    if (!user?._id) return;

    setMessagesLoading(true);
    try {
      const res = await chatAPI.getMessages(user._id, studentId);
      const msgs: Message[] = res.data.messages ?? res.data ?? [];
      setMessages(msgs);

      const unreadIds = msgs
        .filter((m) => !m.read && m.senderId === studentId)
        .map((m) => m._id);

      if (unreadIds.length > 0) {
        await chatAPI.markRead(unreadIds);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);

      setMessages([
        {
          _id: '1',
          senderId: studentId,
          receiverId: user._id,
          message: 'Hi teacher, I have a question!',
          read: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setMessagesLoading(false);
    }
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent || !user) return;

    setSending(true);
    try {
      const res = await chatAPI.send({
        receiverId: selectedStudent.studentId,
        message: newMessage.trim(),
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch {
      toast({ title: 'Failed to send message', variant: 'destructive' });

      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          senderId: user._id,
          receiverId: selectedStudent.studentId,
          message: newMessage.trim(),
          read: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Messages</h1>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Students */}
        <div className="border rounded-xl overflow-y-auto">
          {students.map((student) => (
            <button
              key={student.studentId}
              onClick={() => {
                setSelectedStudent(student);
                fetchMessages(student.studentId);
              }}
              className={`w-full p-4 flex items-center gap-3 border-b ${
                selectedStudent?.studentId === student.studentId
                  ? 'bg-muted'
                  : ''
              }`}
            >
              <User className="h-5 w-5" />
              {student.studentName}
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 border rounded-xl flex flex-col">
          {!selectedStudent ? (
            <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-2" />
              Select a student to chat
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.senderId === user?._id
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div className="bg-muted px-4 py-2 rounded-xl max-w-[70%]">
                        {msg.message}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-4 flex gap-2 border-t"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button disabled={sending}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherChat;
