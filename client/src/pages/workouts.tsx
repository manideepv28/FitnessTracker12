import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useWorkouts, useExercises, useTemplates } from "@/hooks/use-storage";
import { insertWorkoutSchema, WorkoutExercise, ExerciseSet } from "@shared/schema";
import { Plus, Trash2, Save, RotateCcw, Check } from "lucide-react";
import Timer from "@/components/timer";

const workoutFormSchema = insertWorkoutSchema.extend({
  duration: z.number().optional(),
});

interface ExerciseFormData extends Omit<WorkoutExercise, 'sets'> {
  sets: ExerciseSet[];
}

export default function Workouts() {
  const { saveWorkout } = useWorkouts();
  const { exercises } = useExercises();
  const { templates } = useTemplates();
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseFormData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split('T')[0],
      exercises: [],
      notes: "",
    },
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addExercise = () => {
    const newExercise: ExerciseFormData = {
      exerciseId: "",
      exerciseName: "",
      sets: [{
        weight: 0,
        reps: 0,
        rpe: undefined,
        completed: false,
      }],
      notes: "",
    };
    setWorkoutExercises([...workoutExercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, updates: Partial<ExerciseFormData>) => {
    const updated = [...workoutExercises];
    updated[index] = { ...updated[index], ...updates };
    setWorkoutExercises(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets.push({
      weight: 0,
      reps: 0,
      rpe: undefined,
      completed: false,
    });
    setWorkoutExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<ExerciseSet>) => {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets[setIndex] = { 
      ...updated[exerciseIndex].sets[setIndex], 
      ...updates 
    };
    setWorkoutExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setWorkoutExercises(updated);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    form.setValue('name', template.name);
    const templateExercises: ExerciseFormData[] = template.exercises.map(te => ({
      exerciseId: te.exerciseId,
      exerciseName: te.exerciseName,
      sets: Array.from({ length: te.targetSets }, () => ({
        weight: 0,
        reps: 0,
        rpe: undefined,
        completed: false,
      })),
      notes: "",
    }));
    setWorkoutExercises(templateExercises);
    showToast(`Template "${template.name}" loaded!`);
  };

  const onSubmit = (data: z.infer<typeof workoutFormSchema>) => {
    if (workoutExercises.length === 0) {
      showToast("Please add at least one exercise");
      return;
    }

    const workout = {
      id: Date.now().toString(),
      name: data.name,
      date: data.date,
      exercises: workoutExercises.map(e => ({
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        sets: e.sets,
        notes: e.notes,
      })),
      duration: data.duration,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    saveWorkout(workout);
    showToast("Workout saved successfully!");
    
    // Reset form
    form.reset();
    setWorkoutExercises([]);
  };

  const clearForm = () => {
    form.reset();
    setWorkoutExercises([]);
    showToast("Form cleared");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workout Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Your Workout</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Upper Body Strength" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="60"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Exercises Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Exercises</h3>
                    <Button type="button" onClick={addExercise} className="bg-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {workoutExercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Select
                            value={exercise.exerciseId}
                            onValueChange={(value) => {
                              const selectedExercise = exercises.find(e => e.id === value);
                              updateExercise(exerciseIndex, {
                                exerciseId: value,
                                exerciseName: selectedExercise?.name || "",
                              });
                            }}
                          >
                            <SelectTrigger className="flex-1 mr-3">
                              <SelectValue placeholder="Select Exercise" />
                            </SelectTrigger>
                            <SelectContent>
                              {exercises.map((ex) => (
                                <SelectItem key={ex.id} value={ex.id}>
                                  {ex.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeExercise(exerciseIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Sets Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Set</th>
                                <th className="text-left py-2">Weight (lbs)</th>
                                <th className="text-left py-2">Reps</th>
                                <th className="text-left py-2">RPE</th>
                                <th></th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((set, setIndex) => (
                                <tr key={setIndex}>
                                  <td className="py-2">{setIndex + 1}</td>
                                  <td className="py-2">
                                    <Input
                                      type="number"
                                      className="w-20"
                                      placeholder="0"
                                      value={set.weight || ""}
                                      onChange={(e) => updateSet(exerciseIndex, setIndex, {
                                        weight: Number(e.target.value) || 0
                                      })}
                                    />
                                  </td>
                                  <td className="py-2">
                                    <Input
                                      type="number"
                                      className="w-16"
                                      placeholder="0"
                                      value={set.reps || ""}
                                      onChange={(e) => updateSet(exerciseIndex, setIndex, {
                                        reps: Number(e.target.value) || 0
                                      })}
                                    />
                                  </td>
                                  <td className="py-2">
                                    <Input
                                      type="number"
                                      className="w-16"
                                      placeholder="1-10"
                                      min="1"
                                      max="10"
                                      value={set.rpe || ""}
                                      onChange={(e) => updateSet(exerciseIndex, setIndex, {
                                        rpe: e.target.value ? Number(e.target.value) : undefined
                                      })}
                                    />
                                  </td>
                                  <td className="py-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateSet(exerciseIndex, setIndex, {
                                        completed: !set.completed
                                      })}
                                      className={set.completed ? "text-secondary" : "text-gray-400"}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </td>
                                  <td className="py-2">
                                    {exercise.sets.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSet(exerciseIndex, setIndex)}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addSet(exerciseIndex)}
                          className="mt-2 text-primary"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Set
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workout Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How did the workout feel? Any observations?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button type="submit" className="bg-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Workout
                  </Button>
                  <Button type="button" variant="outline" onClick={clearForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Templates */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="w-full text-left justify-start"
                  onClick={() => loadTemplate(template.id)}
                >
                  <div>
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timer Widget */}
        <Timer onComplete={() => showToast("Rest time complete!")} />
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-secondary text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
