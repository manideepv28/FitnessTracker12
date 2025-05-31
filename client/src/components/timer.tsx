import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TimerProps {
  onComplete?: () => void;
}

export default function Timer({ onComplete }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const startTimer = () => {
    if (seconds === 0) return;
    
    setIsRunning(true);
    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  const setPresetTime = (time: number) => {
    if (!isRunning) {
      setSeconds(time);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rest Timer</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-4">
            {formatTime(seconds)}
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setPresetTime(60)}
                disabled={isRunning}
              >
                1 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setPresetTime(90)}
                disabled={isRunning}
              >
                1.5 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setPresetTime(120)}
                disabled={isRunning}
              >
                2 min
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-secondary hover:bg-secondary/90"
                onClick={isRunning ? stopTimer : startTimer}
                disabled={!isRunning && seconds === 0}
              >
                {isRunning ? "Stop" : "Start"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetTimer}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
