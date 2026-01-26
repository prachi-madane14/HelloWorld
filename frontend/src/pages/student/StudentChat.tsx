import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { chatAPI, classAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Teacher {
  _id: string;
  name: string;
}

const StudentChat = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedTeacher]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      // Get teachers from the student's classes
      const response = await classAPI.getByTeacher(user?._id || '');
      // Extract unique teachers
      const uniqueTeachers: Teacher[] = [];
      response.data.forEach((cls: any) => {
        if (cls.teacherId && !uniqueTeachers.find((t) => t._id === cls.teacherId._id)) {
          uniqueTeachers.push(cls.teacherId);
        }
      });
      setTeachers(uniqueTeachers);
      if (uniqueTeachers.length > 0) {
        setSelectedTeacher(uniqueTeachers[0]);
      }
    } catch (err: any) {
      // If no classes, just show empty state
      setTeachers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedTeacher || !user) return;
    try {
      const response = await chatAPI.getMessages(
        selectedTeacher._id,
        user._id
      );
      setMessages(response.data);

      // Mark messages as read
      const unreadIds = response.data
        .filter((m: Message) => !m.read && m.senderId !== user._id)
        .map((m: Message) => m._id);

      if (unreadIds.length > 0) {
        await chatAPI.markRead(unreadIds);
      }
    } catch (err: any) {
      // Silent fail for polling
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTeacher) return;

    try {
      setIsSending(true);
      await chatAPI.send({
        receiverId: selectedTeacher._id,
        message: newMessage.trim(),
      });
      setNewMessage('');
      fetchMessages();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-4 border-b border-border"
      >
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Teacher Chat
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ask questions and get feedback from your teachers
          </p>
        </div>
      </motion.div>

      {teachers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">No Teachers Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Join a class to start chatting with your teacher!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 mt-4 overflow-hidden">
          {/* Teachers List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-card border border-border rounded-xl overflow-hidden hidden md:block"
          >
            <div className="p-3 border-b border-border">
              <h3 className="font-medium text-sm">Your Teachers</h3>
            </div>
            <ScrollArea className="h-[calc(100%-3rem)]">
              {teachers.map((teacher) => (
                <button
                  key={teacher._id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${
                    selectedTeacher?._id === teacher._id
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : ''
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">Teacher</p>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            {selectedTeacher && (
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedTeacher.name}</p>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user?._id;
                    return (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <div
                            className={`flex items-center gap-1 mt-1 ${
                              isOwn ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span
                              className={`text-xs ${
                                isOwn
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isOwn &&
                              (msg.read ? (
                                <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                              ) : (
                                <Clock className="h-3 w-3 text-primary-foreground/70" />
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet. Say hello!</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-border flex gap-2"
            >
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                className="flex-1"
              />
              <Button type="submit" disabled={isSending || !newMessage.trim()}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentChat;
