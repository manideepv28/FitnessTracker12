import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { initializeSampleData } from "./lib/sample-data";
import { useDataManagement } from "./hooks/use-storage";
import Navigation from "./components/navigation";
import Dashboard from "./pages/dashboard";
import Workouts from "./pages/workouts";
import Progress from "./pages/progress";
import Exercises from "./pages/exercises";
import NotFound from "./pages/not-found";
import Toast from "./components/toast";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/progress" component={Progress} />
      <Route path="/exercises" component={Exercises} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { exportData } = useDataManagement();

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    setToastMessage("Data synced successfully!");
  };

  const handleExport = () => {
    try {
      exportData();
      setToastMessage("Data exported successfully!");
    } catch (error) {
      setToastMessage("Failed to export data");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-light">
          <Navigation 
            onSync={handleSync}
            onExport={handleExport}
            isSyncing={isSyncing}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Router />
          </main>
        </div>
        
        <Toaster />
        
        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
