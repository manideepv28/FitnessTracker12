import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useExercises, useWorkouts } from "@/hooks/use-storage";
import { Exercise } from "@shared/schema";
import { 
  Search, 
  Plus, 
  Info, 
  List,
  ExpandIcon as Expand,
  ArrowUp,
  ArrowLeftRight,
  Footprints,
  HandIcon as Hand,
  Circle,
  Heart
} from "lucide-react";

const categories = [
  { id: 'all', name: 'All Exercises', icon: List },
  { id: 'chest', name: 'Chest', icon: Expand },
  { id: 'back', name: 'Back', icon: ArrowUp },
  { id: 'shoulders', name: 'Shoulders', icon: ArrowLeftRight },
  { id: 'legs', name: 'Legs', icon: Footprints },
  { id: 'arms', name: 'Arms', icon: Hand },
  { id: 'core', name: 'Core', icon: Circle },
  { id: 'cardio', name: 'Cardio', icon: Heart },
];

export default function Exercises() {
  const { exercises } = useExercises();
  const { workouts } = useWorkouts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter exercises based on category and search
  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get exercise stats from workouts
  const getExerciseStats = (exerciseId: string) => {
    let bestWeight = 0;
    let sessionCount = 0;
    const exerciseWorkouts = new Set();

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.exerciseId === exerciseId) {
          exerciseWorkouts.add(workout.id);
          exercise.sets.forEach(set => {
            if (set.weight > bestWeight) {
              bestWeight = set.weight;
            }
          });
        }
      });
    });

    return {
      bestWeight,
      sessionCount: exerciseWorkouts.size,
    };
  };

  const handleAddToWorkout = (exercise: Exercise) => {
    // In a real app, this would navigate to workout page and pre-select the exercise
    console.log('Add to workout:', exercise.name);
  };

  const handleViewDetails = (exercise: Exercise) => {
    // In a real app, this would open a detailed view modal
    console.log('View details:', exercise.name);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Exercise Categories */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isSelected 
                        ? "bg-primary text-white" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Library */}
      <div className="lg:col-span-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Exercise Library</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button className="bg-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom
                </Button>
              </div>
            </div>

            {/* Exercise Grid */}
            {filteredExercises.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExercises.map((exercise) => {
                  const stats = getExerciseStats(exercise.id);
                  
                  return (
                    <div
                      key={exercise.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{exercise.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {exercise.muscleGroups.join(', ')}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={exercise.isCompound ? "default" : "secondary"}
                              className={exercise.isCompound ? "bg-primary/10 text-primary" : ""}
                            >
                              {exercise.isCompound ? 'Compound' : 'Isolation'}
                            </Badge>
                            {exercise.equipment && (
                              <Badge variant="outline" className="text-gray-600">
                                {exercise.equipment}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {stats.bestWeight > 0 ? (
                            <>
                              <p className="text-sm font-medium text-gray-900">
                                Best: {stats.bestWeight} lbs
                              </p>
                              <p className="text-xs text-gray-600">
                                {stats.sessionCount} session{stats.sessionCount !== 1 ? 's' : ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-500">Not used yet</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(exercise)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddToWorkout(exercise)}
                          className="text-secondary hover:text-secondary/80"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Workout
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">No exercises found</p>
                <p className="text-sm">
                  {searchTerm 
                    ? `No exercises match "${searchTerm}"` 
                    : 'No exercises in this category'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
