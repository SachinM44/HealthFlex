export type TimerStatus = 'Running' | 'Paused' | 'Completed';

export type Category = {
  id: string;
  name: string;
  expanded: boolean;
};

export type Timer = {
  id: string;
  name: string;
  duration: number; // in seconds
  remainingTime: number;
  status: TimerStatus;
  categoryId: string;
  createdAt: number;
  completedAt?: number;
  halfwayAlert?: boolean;
  halfwayAlertTriggered?: boolean;
};

export type TimerLog = {
  id: string;
  timerId: string;
  timerName: string;
  categoryId: string;
  categoryName: string;
  completedAt: number;
  duration: number;
};