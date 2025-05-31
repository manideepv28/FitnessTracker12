import { Workout, Exercise, PersonalRecord, UserStats, WorkoutTemplate } from "@shared/schema";

const STORAGE_KEYS = {
  workouts: 'fittracker_workouts',
  exercises: 'fittracker_exercises',
  personalRecords: 'fittracker_records',
  stats: 'fittracker_stats',
  templates: 'fittracker_templates',
} as const;

export class LocalStorage {
  // Workouts
  static getWorkouts(): Workout[] {
    const data = localStorage.getItem(STORAGE_KEYS.workouts);
    return data ? JSON.parse(data) : [];
  }

  static saveWorkout(workout: Workout): void {
    const workouts = this.getWorkouts();
    const existingIndex = workouts.findIndex(w => w.id === workout.id);
    
    if (existingIndex >= 0) {
      workouts[existingIndex] = workout;
    } else {
      workouts.push(workout);
    }
    
    localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(workouts));
    this.updateStats();
  }

  static deleteWorkout(id: string): void {
    const workouts = this.getWorkouts().filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(workouts));
    this.updateStats();
  }

  // Exercises
  static getExercises(): Exercise[] {
    const data = localStorage.getItem(STORAGE_KEYS.exercises);
    return data ? JSON.parse(data) : [];
  }

  static saveExercise(exercise: Exercise): void {
    const exercises = this.getExercises();
    const existingIndex = exercises.findIndex(e => e.id === exercise.id);
    
    if (existingIndex >= 0) {
      exercises[existingIndex] = exercise;
    } else {
      exercises.push(exercise);
    }
    
    localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(exercises));
  }

  // Personal Records
  static getPersonalRecords(): PersonalRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.personalRecords);
    return data ? JSON.parse(data) : [];
  }

  static savePersonalRecord(record: PersonalRecord): void {
    const records = this.getPersonalRecords();
    const existingIndex = records.findIndex(r => r.id === record.id);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    localStorage.setItem(STORAGE_KEYS.personalRecords, JSON.stringify(records));
  }

  // Stats
  static getStats(): UserStats {
    const data = localStorage.getItem(STORAGE_KEYS.stats);
    return data ? JSON.parse(data) : {
      totalWorkouts: 0,
      currentStreak: 0,
      weeklyGoal: { current: 0, target: 3 },
      thisWeek: 0,
      totalWeight: 0,
      bestSet: 0,
      avgDuration: 0,
    };
  }

  static updateStats(): void {
    const workouts = this.getWorkouts();
    const stats: UserStats = {
      totalWorkouts: workouts.length,
      currentStreak: this.calculateStreak(workouts),
      weeklyGoal: {
        current: this.getThisWeekWorkouts(workouts),
        target: this.getStats().weeklyGoal?.target || 3,
      },
      thisWeek: this.getThisWeekWorkouts(workouts),
      totalWeight: this.calculateTotalWeight(workouts),
      bestSet: this.calculateBestSet(workouts),
      avgDuration: this.calculateAvgDuration(workouts),
    };
    
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
  }

  // Templates
  static getTemplates(): WorkoutTemplate[] {
    const data = localStorage.getItem(STORAGE_KEYS.templates);
    return data ? JSON.parse(data) : [];
  }

  static saveTemplate(template: WorkoutTemplate): void {
    const templates = this.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(templates));
  }

  // Helper methods
  private static calculateStreak(workouts: Workout[]): number {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak || (daysDiff === streak + 1)) {
        streak = daysDiff + 1;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private static getThisWeekWorkouts(workouts: Workout[]): number {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    return workouts.filter(w => new Date(w.date) >= startOfWeek).length;
  }

  private static calculateTotalWeight(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
          return setTotal + (set.weight * set.reps);
        }, 0);
      }, 0);
    }, 0);
  }

  private static calculateBestSet(workouts: Workout[]): number {
    let bestWeight = 0;
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.weight > bestWeight) {
            bestWeight = set.weight;
          }
        });
      });
    });
    
    return bestWeight;
  }

  private static calculateAvgDuration(workouts: Workout[]): number {
    const workoutsWithDuration = workouts.filter(w => w.duration);
    if (workoutsWithDuration.length === 0) return 0;
    
    const totalDuration = workoutsWithDuration.reduce((sum, w) => sum + (w.duration || 0), 0);
    return Math.round(totalDuration / workoutsWithDuration.length);
  }

  // Export/Import
  static exportData(): string {
    const data = {
      workouts: this.getWorkouts(),
      exercises: this.getExercises(),
      personalRecords: this.getPersonalRecords(),
      stats: this.getStats(),
      templates: this.getTemplates(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.workouts) localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(data.workouts));
      if (data.exercises) localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(data.exercises));
      if (data.personalRecords) localStorage.setItem(STORAGE_KEYS.personalRecords, JSON.stringify(data.personalRecords));
      if (data.stats) localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(data.stats));
      if (data.templates) localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(data.templates));
      
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
