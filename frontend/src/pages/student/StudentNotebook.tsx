import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notebookAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import {
  Notebook,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  Globe,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Note {
  _id: string;
  phrase: string;
  translation?: string;
  country?: string;
  createdAt: string;
}

const StudentNotebook = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newNote, setNewNote] = useState({
    phrase: '',
    translation: '',
    country: '',
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await notebookAPI.getAll();
      setNotes(response.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to load notebook',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.phrase.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a phrase',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await notebookAPI.create(newNote);
      setNotes([response.data, ...notes]);
      setNewNote({ phrase: '', translation: '', country: '' });
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Note added to your notebook!',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notebookAPI.delete(id);
      setNotes(notes.filter((n) => n._id !== id));
      toast({
        title: 'Deleted',
        description: 'Note removed from notebook',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.translation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Notebook className="h-8 w-8 text-primary" />
            My Notebook
          </h1>
          <p className="text-muted-foreground mt-1">
            Save phrases and notes from your learning journey
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Phrase *
                </label>
                <Textarea
                  placeholder="Enter the phrase or word..."
                  value={newNote.phrase}
                  onChange={(e) =>
                    setNewNote({ ...newNote, phrase: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Translation
                </label>
                <Input
                  placeholder="Translation (optional)"
                  value={newNote.translation}
                  onChange={(e) =>
                    setNewNote({ ...newNote, translation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Country
                </label>
                <Input
                  placeholder="Country of origin (optional)"
                  value={newNote.country}
                  onChange={(e) =>
                    setNewNote({ ...newNote, country: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleCreateNote}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save Note'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredNotes.map((note, i) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {note.country && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {note.country}
                      </span>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteNote(note._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <p className="font-medium text-lg mb-2">{note.phrase}</p>
                {note.translation && (
                  <p className="text-muted-foreground text-sm">
                    → {note.translation}
                  </p>
                )}

                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-12 text-center"
        >
          <Notebook className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">
            {searchQuery ? 'No notes found' : 'Your notebook is empty'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? 'Try a different search term'
              : 'Start adding phrases and words you learn!'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Note
            </Button>
          )}
        </motion.div>
      )}

      {/* Stats */}
      {notes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/50 rounded-xl p-4 flex items-center justify-center gap-6 text-sm"
        >
          <span>
            <strong>{notes.length}</strong> total notes
          </span>
          <span>•</span>
          <span>
            <strong>
              {new Set(notes.map((n) => n.country).filter(Boolean)).size}
            </strong>{' '}
            countries
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default StudentNotebook;
