import { useCallback, useEffect, useRef, useState } from 'react';

interface FakeProgressOptions {
  initialValue?: number;
  maxValue?: number;
  updateInterval?: number;
  startOnMount?: boolean;
}

export const useMockProgress = (options: FakeProgressOptions = {}) => {
  const {
    initialValue = 5,
    maxValue = 99,
    updateInterval,
    startOnMount,
  } = options;
  const [progress, setProgress] = useState(initialValue);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setProgress((currentProgress) =>
        currentProgress === maxValue ? currentProgress : currentProgress + 1
      );
    }, updateInterval);
  }, [maxValue, updateInterval]);

  const stopProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (startOnMount) {
      startProgress();
    }
    return () => {
      stopProgress();
    };
  }, [startOnMount, startProgress]);
  return {
    progress,
    startProgress,
    stopProgress,
  };
};
