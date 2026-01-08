"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSavedJobs, saveJob, unsaveJob } from '@/utils/api/saved-jobs-api';

interface SavedJobsContextType {
  savedJobIds: Set<string>;
  isSaved: (jobId: string) => boolean;
  saveJobToFavorites: (jobId: string) => Promise<void>;
  unsaveJobFromFavorites: (jobId: string) => Promise<void>;
  refreshSavedJobs: () => Promise<void>;
  isLoading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export function SavedJobsProvider({ children }: { children: ReactNode }) {
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load saved job IDs on mount
  const loadSavedJobIds = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is logged in first
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setSavedJobIds(new Set());
        setIsLoading(false);
        return;
      }
      
      const response = await getSavedJobs(1, 1000); // Get all saved jobs
      console.log('SavedJobsContext - loaded jobs:', response);
      
      // Handle both response formats
      let jobs: any[] = [];
      if (Array.isArray(response)) {
        jobs = response;
      } else if (response?.data && Array.isArray(response.data)) {
        jobs = response.data;
      }
      
      const jobIds = new Set(jobs.map((job: any) => job.id));
      console.log('SavedJobsContext - saved job IDs:', Array.from(jobIds));
      setSavedJobIds(jobIds);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      // If user not logged in or error, just keep empty set
      setSavedJobIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobIds();
  }, []);

  const isSaved = (jobId: string): boolean => {
    return savedJobIds.has(jobId);
  };

  const saveJobToFavorites = async (jobId: string) => {
    try {
      await saveJob(jobId);
      setSavedJobIds(prev => new Set(prev).add(jobId));
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  };

  const unsaveJobFromFavorites = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
      setSavedJobIds(prev => {
        const updated = new Set(prev);
        updated.delete(jobId);
        return updated;
      });
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  };

  const refreshSavedJobs = async () => {
    await loadSavedJobIds();
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobIds,
        isSaved,
        saveJobToFavorites,
        unsaveJobFromFavorites,
        refreshSavedJobs,
        isLoading,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (context === undefined) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
}
