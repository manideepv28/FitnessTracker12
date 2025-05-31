import { Card, CardContent } from "@/components/ui/card";
import { useStats, useWorkouts } from "@/hooks/use-storage";
import { 
  CalendarDays, 
  Weight, 
  Trophy, 
  Clock,
  Dumbbell,
  Terminal,
  TrendingUp
} from "lucide-react";
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

export default function Dashboard() {
  const { stats } = useStats();
  const { workouts } = useWorkouts();

  // Get recent workouts (last 3)
  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Generate weekly progress data
  const weeklyData = [
    { day: 'Mon', workouts: 1 },
    { day: 'Tue', workouts: 0 },
    { day: 'Wed', workouts: 1 },
    { day: 'Thu', workouts: 1 },
    { day: 'Fri', workouts: 0 },
    { day: 'Sat', workouts: 1 },
    { day: 'Sun', workouts: 0 },
  ];

  // Generate strength progress data
  const strengthData = [
    { week: 'Week 1', benchPress: 185, squat: 225 },
    { week: 'Week 2', benchPress: 190, squat: 235 },
    { week: 'Week 3', benchPress: 195, squat: 245 },
    { week: 'Week 4', benchPress: 200, squat: 255 },
  ];

  const formatWorkoutIcon = (exerciseCount: number) => {
    if (exerciseCount >= 6) return <Terminal className="h-4 w-4 text-white" />;
    return <Dumbbell className="h-4 w-4 text-white" />;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
        <p className="text-blue-100 mb-4">Let's crush your fitness goals today</p>
        <div className="flex flex-wrap gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <div className="text-sm text-blue-100">Total Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-blue-100">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {stats.weeklyGoal.current}/{stats.weeklyGoal.target}
            </div>
            <div className="text-sm text-blue-100">Weekly Goal</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                <p className="text-xs text-secondary">
                  {stats.thisWeek > 2 ? '+2 from last week' : 'Keep going!'}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Weight</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalWeight.toLocaleString()}
                </p>
                <p className="text-xs text-secondary">lbs lifted</p>
              </div>
              <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Weight className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Set</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bestSet}</p>
                <p className="text-xs text-accent">lbs Personal Best</p>
              </div>
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgDuration}</p>
                <p className="text-xs text-primary">minutes</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 2]} />
                <Tooltip />
                <Bar dataKey="workouts" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="benchPress" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Bench Press"
                />
                <Line 
                  type="monotone" 
                  dataKey="squat" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Squat"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </button>
          </div>
          
          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No workouts yet. Start logging your first workout!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout, index) => {
                const totalWeight = workout.exercises.reduce((total, exercise) => 
                  total + exercise.sets.reduce((setTotal, set) => 
                    setTotal + (set.weight * set.reps), 0), 0);

                const iconBg = index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-accent';
                
                return (
                  <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 ${iconBg} rounded-full flex items-center justify-center`}>
                        {formatWorkoutIcon(workout.exercises.length)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{workout.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatRelativeTime(workout.date)}
                          {workout.duration && ` • ${workout.duration} minutes`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{workout.exercises.length} exercises</p>
                      <p className="text-sm text-secondary">{totalWeight.toLocaleString()} lbs total</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
