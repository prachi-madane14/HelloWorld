import { useState, useEffect } from 'react';
import { teacherContentAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, Loader2, Lightbulb, BookOpen, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Content {
  _id: string;
  title: string;
  type: 'fact' | 'challenge' | 'resource';
  content: string;
  country?: string;
  link?: string;
  createdAt: string;
}

const CONTENT_TYPES = [
  { value: 'fact', label: 'Fun Fact', icon: Lightbulb, color: 'text-xp bg-xp/10' },
  { value: 'challenge', label: 'Challenge', icon: BookOpen, color: 'text-accent bg-accent/10' },
  { value: 'resource', label: 'Resource', icon: Link2, color: 'text-primary bg-primary/10' },
];

const COUNTRIES = ['Spain', 'France', 'Japan', 'Germany', 'Italy', 'Brazil', 'China', 'India', 'Mexico', 'Korea'];

const TeacherContent = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'fact' | 'challenge' | 'resource'>('fact');
  const [content, setContent] = useState('');
  const [country, setCountry] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await teacherContentAPI.getByTeacher();
      setContents(response.data.contents || response.data || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      // Demo data
      setContents([
        { _id: '1', title: 'Spanish Tapas Culture', type: 'fact', content: 'In Spain, tapas are more than just food—they\'re a way of life!', country: 'Spain', createdAt: new Date().toISOString() },
        { _id: '2', title: 'French Pronunciation Challenge', type: 'challenge', content: 'Try saying "Je suis" 10 times fast!', country: 'France', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Please fill in title and content', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      const response = await teacherContentAPI.create({
        title,
        type,
        content,
        country: country || undefined,
        link: link || undefined
      });
      setContents([...contents, response.data]);
      resetForm();
      setCreateDialogOpen(false);
      toast({ title: 'Content shared!', description: 'Students will see this as "Teacher\'s Note of the Week"' });
    } catch (error) {
      toast({ title: 'Failed to create content', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await teacherContentAPI.delete(id);
      setContents(contents.filter(c => c._id !== id));
      toast({ title: 'Content deleted' });
    } catch (error) {
      toast({ title: 'Failed to delete content', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('fact');
    setContent('');
    setCountry('');
    setLink('');
  };

  const getTypeConfig = (t: string) => {
    return CONTENT_TYPES.find(ct => ct.value === t) || CONTENT_TYPES[0];
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
          <h1 className="font-display text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">Share facts, challenges, and resources with your students</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share New Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map(ct => (
                      <SelectItem key={ct.value} value={ct.value}>
                        <div className="flex items-center gap-2">
                          <ct.icon className="h-4 w-4" />
                          {ct.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Fun fact about Japan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Share something interesting..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country (optional)</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {COUNTRIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Link (optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleCreateContent} className="w-full" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Share Content
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Grid */}
      {contents.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">No Content Yet</h3>
          <p className="text-muted-foreground">Share your first piece of content with your students!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((item, index) => {
            const typeConfig = getTypeConfig(item.type);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${typeConfig.color}`}>
                    <typeConfig.icon className="h-3 w-3" />
                    {typeConfig.label}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => handleDeleteContent(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{item.content}</p>
                {item.country && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">{item.country}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherContent;
