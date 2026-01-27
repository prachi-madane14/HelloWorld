import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AxiosError } from "axios";
import { notebookAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Notebook,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  Globe,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";

interface Note {
  _id: string;
  phrase?: string;
  translation?: string;
  country?: string;
  createdAt: string;
}

const StudentNotebook = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newNote, setNewNote] = useState({
    phrase: "",
    translation: "",
    country: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await notebookAPI.getAll();
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load notebook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.phrase.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phrase",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await notebookAPI.create(newNote);
      setNotes([response.data, ...notes]);
      setNewNote({ phrase: "", translation: "", country: "" });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Note added to your notebook!",
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create note",
        variant: "destructive",
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
        title: "Deleted",
        description: "Note removed from notebook",
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  // ✅ SAFE FILTERING (NO CRASH)
  const filteredNotes = notes.filter((note) => {
    const phrase = note.phrase?.toLowerCase() ?? "";
    const translation = note.translation?.toLowerCase() ?? "";
    const country = note.country?.toLowerCase() ?? "";
    const query = searchQuery.toLowerCase();

    return (
      phrase.includes(query) ||
      translation.includes(query) ||
      country.includes(query)
    );
  });

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
              <Textarea
                placeholder="Enter the phrase..."
                value={newNote.phrase}
                onChange={(e) =>
                  setNewNote({ ...newNote, phrase: e.target.value })
                }
              />
              <Input
                placeholder="Translation (optional)"
                value={newNote.translation}
                onChange={(e) =>
                  setNewNote({ ...newNote, translation: e.target.value })
                }
              />
              <Input
                placeholder="Country (optional)"
                value={newNote.country}
                onChange={(e) =>
                  setNewNote({ ...newNote, country: e.target.value })
                }
              />
              <Button
                onClick={handleCreateNote}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Note"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes */}
      {filteredNotes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border rounded-xl p-5"
              >
                <div className="flex justify-between mb-2">
                  {note.country && (
                    <span className="text-xs flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {note.country}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <p className="font-medium">{note.phrase}</p>
                {note.translation && (
                  <p className="text-sm text-muted-foreground">
                    → {note.translation}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <Notebook className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            {searchQuery ? "No notes found" : "Your notebook is empty"}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentNotebook;
