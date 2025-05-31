import { Exercise, WorkoutTemplate } from "@shared/schema";

export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'chest',
    equipment: 'Barbell',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    isCompound: true,
  },
  {
    id: 'back-squat',
    name: 'Back Squat',
    category: 'legs',
    equipment: 'Barbell',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    isCompound: true,
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    category: 'back',
    equipment: 'Barbell',
    muscleGroups: ['Hamstrings', 'Glutes', 'Back'],
    isCompound: true,
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'shoulders',
    equipment: 'Barbell',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    isCompound: true,
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'back',
    equipment: 'Bodyweight',
    muscleGroups: ['Lats', 'Biceps', 'Rear Delts'],
    isCompound: true,
  },
  {
    id: 'barbell-rows',
    name: 'Barbell Rows',
    category: 'back',
    equipment: 'Barbell',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps'],
    isCompound: true,
  },
  {
    id: 'dumbbell-press',
    name: 'Dumbbell Press',
    category: 'chest',
    equipment: 'Dumbbells',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    isCompound: true,
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'legs',
    equipment: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    isCompound: true,
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'arms',
    equipment: 'Bodyweight',
    muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
    isCompound: true,
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    equipment: 'Bodyweight',
    muscleGroups: ['Core', 'Shoulders'],
    isCompound: false,
  },
];

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'upper-body',
    name: 'Upper Body',
    description: 'Bench, Rows, Shoulders',
    exercises: [
      { exerciseId: 'bench-press', exerciseName: 'Bench Press', targetSets: 3, targetReps: '8-10' },
      { exerciseId: 'barbell-rows', exerciseName: 'Barbell Rows', targetSets: 3, targetReps: '8-10' },
      { exerciseId: 'overhead-press', exerciseName: 'Overhead Press', targetSets: 3, targetReps: '8-10' },
    ],
  },
  {
    id: 'lower-body',
    name: 'Lower Body',
    description: 'Squats, Deadlifts, Legs',
    exercises: [
      { exerciseId: 'back-squat', exerciseName: 'Back Squat', targetSets: 3, targetReps: '8-10' },
      { exerciseId: 'deadlift', exerciseName: 'Conventional Deadlift', targetSets: 3, targetReps: '5-8' },
      { exerciseId: 'lunges', exerciseName: 'Lunges', targetSets: 3, targetReps: '10-12' },
    ],
  },
  {
    id: 'push-day',
    name: 'Push Day',
    description: 'Chest, Shoulders, Triceps',
    exercises: [
      { exerciseId: 'bench-press', exerciseName: 'Bench Press', targetSets: 4, targetReps: '6-8' },
      { exerciseId: 'overhead-press', exerciseName: 'Overhead Press', targetSets: 3, targetReps: '8-10' },
      { exerciseId: 'dips', exerciseName: 'Dips', targetSets: 3, targetReps: '8-12' },
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    description: 'Back, Biceps, Rear Delts',
    exercises: [
      { exerciseId: 'pull-ups', exerciseName: 'Pull-ups', targetSets: 4, targetReps: '5-8' },
      { exerciseId: 'barbell-rows', exerciseName: 'Barbell Rows', targetSets: 3, targetReps: '8-10' },
      { exerciseId: 'deadlift', exerciseName: 'Conventional Deadlift', targetSets: 3, targetReps: '5-8' },
    ],
  },
];

export function initializeSampleData(): void {
  // Initialize exercises if not present
  const existingExercises = localStorage.getItem('fittracker_exercises');
  if (!existingExercises) {
    localStorage.setItem('fittracker_exercises', JSON.stringify(SAMPLE_EXERCISES));
  }

  // Initialize templates if not present
  const existingTemplates = localStorage.getItem('fittracker_templates');
  if (!existingTemplates) {
    localStorage.setItem('fittracker_templates', JSON.stringify(WORKOUT_TEMPLATES));
  }
}
