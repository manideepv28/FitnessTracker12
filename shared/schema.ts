import { z } from "zod";

// Exercise Set Schema
export const exerciseSetSchema = z.object({
  weight: z.number().min(0),
  reps: z.number().min(0),
  rpe: z.number().min(1).max(10).optional(),
  completed: z.boolean().default(false),
});

export type ExerciseSet = z.infer<typeof exerciseSetSchema>;

// Exercise Schema
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'cardio']),
  equipment: z.string().optional(),
  muscleGroups: z.array(z.string()),
  isCompound: z.boolean().default(false),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// Workout Exercise Schema
export const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  sets: z.array(exerciseSetSchema),
  notes: z.string().optional(),
});

export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;

// Workout Schema
export const workoutSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  date: z.string(),
  exercises: z.array(workoutExerciseSchema),
  duration: z.number().optional(), // in minutes
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type Workout = z.infer<typeof workoutSchema>;

// Personal Record Schema
export const personalRecordSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  weight: z.number(),
  reps: z.number(),
  date: z.string(),
  workoutId: z.string(),
});

export type PersonalRecord = z.infer<typeof personalRecordSchema>;

// User Stats Schema
export const userStatsSchema = z.object({
  totalWorkouts: z.number().default(0),
  currentStreak: z.number().default(0),
  weeklyGoal: z.object({
    current: z.number().default(0),
    target: z.number().default(3),
  }),
  thisWeek: z.number().default(0),
  totalWeight: z.number().default(0),
  bestSet: z.number().default(0),
  avgDuration: z.number().default(0),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Workout Template Schema
export const workoutTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    exerciseName: z.string(),
    targetSets: z.number(),
    targetReps: z.string(), // e.g., "8-12" or "10"
  })),
});

export type WorkoutTemplate = z.infer<typeof workoutTemplateSchema>;

// Form Schemas
export const insertWorkoutSchema = workoutSchema.omit({ id: true, createdAt: true });
export const insertExerciseSchema = exerciseSchema.omit({ id: true });
export const insertPersonalRecordSchema = personalRecordSchema.omit({ id: true });

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertPersonalRecord = z.infer<typeof insertPersonalRecordSchema>;
