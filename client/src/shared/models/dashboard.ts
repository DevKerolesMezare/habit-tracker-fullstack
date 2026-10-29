export interface Dashboard {
  today: string;
  habits: DashboardHabit[];
  completions: DashboardCompletion[];
}

export interface DashboardHabit {
  habitId: number;
  habitName: string;
  frequencyName: string;
}

export interface DashboardCompletion {
  completionId: number;
  habitId: number;
  completionDate: string;
  statusName: string;
}
