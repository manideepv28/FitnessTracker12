import { Card, CardContent } from "@/components/ui/card";
import { useWorkouts, usePersonalRecords } from "@/hooks/use-storage";
import { ChartLine, Flame, Trophy, Badge } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Progress() {
  const { workouts } = useWorkouts();
  const { records } = usePersonalRecords();

  // Calculate progress metrics
  const calculateStrengthGains = () => {
    if (workouts.length < 2) return 0;
    
    const recentWorkouts = workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    const oldWorkouts = workouts.slice(-10);
    
    const recentAvgWeight = recentWorkouts.reduce((sum, w) => {
      const totalWeight = w.exercises.reduce((total, e) => 
        total + e.sets.reduce((setTotal, set) => setTotal + set.weight, 0), 0);
      return sum + totalWeight;
    }, 0) / recentWorkouts.length;
    
    const oldAvgWeight = oldWorkouts.reduce((sum, w) => {
      const totalWeight = w.exercises.reduce((total, e) => 
        total + e.sets.reduce((setTotal, set) => setTotal + set.weight, 0), 0);
      return sum + totalWeight;
    }, 0) / oldWorkouts.length;
    
    if (oldAvgWeight === 0) return 0;
    return Math.round(((recentAvgWeight - oldAvgWeight) / oldAvgWeight) * 100);
  };

  const calculateConsistency = () => {
    if (workouts.length === 0) return 0;
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentWorkouts = workouts.filter(w => new Date(w.date) >= last30Days);
    return Math.round((recentWorkouts.length / 30) * 100);
  };

  const getPersonalBestsThisMonth = () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    return records.filter(r => new Date(r.date) >= thisMonth).length;
  };

  // Generate exercise progress data
  const generateExerciseProgress = () => {
    const exerciseData: { [key: string]: number[] } = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exerciseData[exercise.exerciseName]) {
          exerciseData[exercise.exerciseName] = [];
        }
        
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight), 0);
        exerciseData[exercise.exerciseName].push(maxWeight);
      });
    });

    // Calculate progress percentage for top exercises
    const progressData = Object.entries(exerciseData)
      .filter(([_, weights]) => weights.length >= 2)
      .slice(0, 4)
      .map(([name, weights]) => {
        const firstWeight = weights[0] || 0;
        const lastWeight = weights[weights.length - 1] || 0;
        const progress = firstWeight > 0 ? Math.round(((lastWeight - firstWeight) / firstWeight) * 100) : 0;
        
        return { exercise: name, progress };
      });

    return progressData;
  };

  // Generate volume trends data
  const generateVolumeData = () => {
    const monthlyVolume: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      const month = new Date(workout.date).toLocaleString('default', { month: 'short' });
      const volume = workout.exercises.reduce((total, exercise) => 
        total + exercise.sets.reduce((setTotal, set) => 
          setTotal + (set.weight * set.reps), 0), 0);
      
      monthlyVolume[month] = (monthlyVolume[month] || 0) + volume;
    });

    return Object.entries(monthlyVolume).map(([month, volume]) => ({
      month,
      volume: Math.round(volume),
    }));
  };

  // Get recent personal records
  const getRecentPersonalRecords = () => {
    return records
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  };

  const strengthGains = calculateStrengthGains();
  const consistency = calculateConsistency();
  const personalBestsThisMonth = getPersonalBestsThisMonth();
  const exerciseProgressData = generateExerciseProgress();
  const volumeData = generateVolumeData();
  const recentRecords = getRecentPersonalRecords();

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ChartLine className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Strength Gains</h3>
            <p className="text-3xl font-bold text-primary mb-1">
              {strengthGains > 0 ? '+' : ''}{strengthGains}%
            </p>
            <p className="text-sm text-gray-600">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-20 w-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Flame className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Consistency</h3>
            <p className="text-3xl font-bold text-secondary mb-1">{consistency}%</p>
            <p className="text-sm text-gray-600">workout frequency</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-20 w-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Bests</h3>
            <p className="text-3xl font-bold text-accent mb-1">{personalBestsThisMonth}</p>
            <p className="text-sm text-gray-600">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Progress</h3>
            {exerciseProgressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exerciseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="exercise" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                  <Bar dataKey="progress" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ChartLine className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Not enough data to show progress</p>
                  <p className="text-sm">Log more workouts to see your progress!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Trends</h3>
            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} lbs`, 'Total Volume']} />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ChartLine className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No volume data available</p>
                  <p className="text-sm">Log workouts to track your volume trends!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personal Records */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Records</h3>
          {recentRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRecords.map((record, index) => {
                const isNew = new Date(record.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const isRecent = new Date(record.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                
                return (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{record.exerciseName}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        isNew 
                          ? 'bg-accent/10 text-accent' 
                          : isRecent 
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isNew ? 'NEW' : isRecent ? 'RECENT' : 'PREV'}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${
                      isNew ? 'text-accent' : isRecent ? 'text-secondary' : 'text-gray-700'
                    }`}>
                      {record.weight} lbs
                    </p>
                    <p className="text-sm text-gray-600">
                      {record.reps} reps • {formatRelativeTime(record.date)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No personal records yet</p>
              <p className="text-sm">Start logging workouts to track your personal bests!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
