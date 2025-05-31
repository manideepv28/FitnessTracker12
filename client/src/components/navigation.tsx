import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  ChartLine, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Dumbbell,
  FolderSync,
  Download,
  User
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: ChartLine, mobileLabel: "Dashboard" },
  { path: "/workouts", label: "Log Workout", icon: PlusCircle, mobileLabel: "Log" },
  { path: "/progress", label: "Progress", icon: BarChart3, mobileLabel: "Progress" },
  { path: "/exercises", label: "Exercises", icon: Book, mobileLabel: "Exercises" },
];

interface NavigationProps {
  onSync: () => void;
  onExport: () => void;
  isSyncing: boolean;
}

export default function Navigation({ onSync, onExport, isSyncing }: NavigationProps) {
  const [location, navigate] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">
                <Dumbbell className="inline h-6 w-6 mr-2" />
                FitTracker Pro
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      className={`text-sm font-medium ${
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:text-primary"
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSync}
              disabled={isSyncing}
              className="text-secondary hover:text-secondary/80"
            >
              <FolderSync className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="text-gray-600 hover:text-primary"
            >
              <Download className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="sm" className="rounded-full p-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`flex flex-col items-center py-2 px-4 ${
                  isActive ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.mobileLabel}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
