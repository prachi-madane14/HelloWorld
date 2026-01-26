import { useState, useEffect } from 'react';
import { progressAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

export interface StudentProgress {
  _id: string;
  userId: string;
  xp: number;
  level: number;
  streak: number;
  countriesVisited: string[];
  badges: string[];
  lastLogin: string;
  nextLevelXP: number;
}

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await progressAPI.getStudentProgress();
      setProgress(response.data);
    } catch (err: unknown) {
  let message = 'Failed to fetch progress';

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || message;
  }

  setError(message);
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
}
 finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (data: Partial<StudentProgress>) => {
    try {
      const response = await progressAPI.updateStudentProgress(data);
      setProgress(response.data);
      return response.data;
    } catch (err: unknown) {
  let message = 'Failed to update progress';

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || message;
  }

  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });

  throw err;
}

  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    isLoading,
    error,
    refetch: fetchProgress,
    updateProgress,
  };
}