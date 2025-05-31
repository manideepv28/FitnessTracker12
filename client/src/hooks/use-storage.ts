import { useState, useEffect } from "react";
import { Workout, Exercise, PersonalRecord, UserStats, WorkoutTemplate } from "@shared/schema";
import { LocalStorage } from "@/lib/storage";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const loadWorkouts = () => {
    setWorkouts(LocalStorage.getWorkouts());
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const saveWorkout = (workout: Workout) => {
    LocalStorage.saveWorkout(workout);
    loadWorkouts();
  };

  const deleteWorkout = (id: string) => {
    LocalStorage.deleteWorkout(id);
    loadWorkouts();
  };

  return { workouts, saveWorkout, deleteWorkout, refreshWorkouts: loadWorkouts };
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const loadExercises = () => {
    setExercises(LocalStorage.getExercises());
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const saveExercise = (exercise: Exercise) => {
    LocalStorage.saveExercise(exercise);
    loadExercises();
  };

  return { exercises, saveExercise, refreshExercises: loadExercises };
}

export function usePersonalRecords() {
  const [records, setRecords] = useState<PersonalRecord[]>([]);

  const loadRecords = () => {
    setRecords(LocalStorage.getPersonalRecords());
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const saveRecord = (record: PersonalRecord) => {
    LocalStorage.savePersonalRecord(record);
    loadRecords();
  };

  return { records, saveRecord, refreshRecords: loadRecords };
}

export function useStats() {
  const [stats, setStats] = useState<UserStats>({
    totalWorkouts: 0,
    currentStreak: 0,
    weeklyGoal: { current: 0, target: 3 },
    thisWeek: 0,
    totalWeight: 0,
    bestSet: 0,
    avgDuration: 0,
  });

  const loadStats = () => {
    setStats(LocalStorage.getStats());
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, refreshStats: loadStats };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  const loadTemplates = () => {
    setTemplates(LocalStorage.getTemplates());
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const saveTemplate = (template: WorkoutTemplate) => {
    LocalStorage.saveTemplate(template);
    loadTemplates();
  };

  return { templates, saveTemplate, refreshTemplates: loadTemplates };
}

export function useDataManagement() {
  const exportData = () => {
    const data = LocalStorage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          LocalStorage.importData(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const clearAllData = () => {
    LocalStorage.clearAllData();
  };

  return { exportData, importData, clearAllData };
}
