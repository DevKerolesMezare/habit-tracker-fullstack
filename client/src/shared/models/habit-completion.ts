export interface HabitCompletion {
  completionId: number;
  habitId: number;
  completionDate: string;
  statusId: number;
  statusName: string;
  impactScore: number;
  notes: string | null;
}

export interface CreateHabitCompletion {
  completionDate: string;
  statusId: number;
  notes: string | null;
}

export interface UpdateHabitCompletion {
  completionDate: string;
  statusId: number;
  notes: string | null;
}
