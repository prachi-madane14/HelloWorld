import { useState, useEffect, useRef } from 'react';
import { chatAPI, classAPI, progressAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send, Loader2, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const TeacherChat = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchStudents = async () => {
    if (!user?._id) return;
    try {
      // Get all students from teacher's classes
      const classesRes = await classAPI.getByTeacher(user._id);
      const classes = classesRes.data.classes || classesRes.data || [];
      
      const allStudents: Student[] = [];
      for (const cls of classes) {
        const progressRes = await progressAPI.getClassProgress(cls._id);
        const students = progressRes.data.students || progressRes.data || [];
        allStudents.push(...students.map((s: any) => ({
          _id: s.studentId || s._id,
          studentId: s.studentId || s._id,
          studentName: s.studentName || s.name
        })));
      }
      
      // Remove duplicates
      const uniqueStudents = Array.from(new Map(allStudents.map(s => [s.studentId, s])).values());
      setStudents(uniqueStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Demo data
      setStudents([
        { _id: '1', studentId: '1', studentName: 'Sofia Martinez' },
        { _id: '2', studentId: '2', studentName: 'Alex Kim' },
        { _id: '3', studentId: '3', studentName: 'Emma Liu' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (studentId: string) => {
    if (!user?._id) return;
    setMessagesLoading(true);
    try {
      const response = await chatAPI.getMessages(user._id, studentId);
      setMessages(response.data.messages || response.data || []);
      
      // Mark messages as read
      const unreadIds = (response.data.messages || response.data || [])
        .filter((m: Message) => !m.read && m.senderId === studentId)
        .map((m: Message) => m._id);
      
      if (unreadIds.length > 0) {
        await chatAPI.markRead(unreadIds);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Demo data
      setMessages([
        { _id: '1', senderId: studentId, receiverId: user._id, message: 'Hi teacher, I have a question about the Spanish quiz!', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: '2', senderId: user._id, receiverId: studentId, message: 'Of course! What would you like to know?', read: true, createdAt: new Date(Date.now() - 3500000).toISOString() },
        { _id: '3', senderId: studentId, receiverId: user._id, message: 'What\'s the difference between "ser" and "estar"?', read: true, createdAt: new Date(Date.now() - 3400000).toISOString() },
      ]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    fetchMessages(student.studentId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent || !user) return;

    setSending(true);
    try {
      const response = await chatAPI.send({
        receiverId: selectedStudent.studentId,
        message: newMessage.trim()
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      toast({ title: 'Failed to send message', variant: 'destructive' });
      // Add optimistic update for demo
      setMessages([...messages, {
        _id: Date.now().toString(),
        senderId: user._id,
        receiverId: selectedStudent.studentId,
        message: newMessage.trim(),
        read: false,
        createdAt: new Date().toISOString()
      }]);
      setNewMessage('');
    } finally {
      setSending(false);
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
        <h1 className="font-display text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Chat with your students</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Students List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Students</h3>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {students.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No students yet
              </div>
            ) : (
              students.map((student) => (
                <button
                  key={student.studentId}
                  onClick={() => handleSelectStudent(student)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border ${
                    selectedStudent?.studentId === student.studentId ? 'bg-muted' : ''
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-left">{student.studentName}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
          {selectedStudent ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedStudent.studentName}</h3>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-2" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.senderId === user?._id
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === user?._id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <Button type="submit" disabled={sending || !newMessage.trim()}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Select a Student</h3>
              <p>Choose a student from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherChat;
